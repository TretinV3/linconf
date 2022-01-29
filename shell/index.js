
let commands;
$.getJSON("./commands.json", data => {
    commands = data;
});

let nmapOutput;
$.get('./nmapText.txt', data => {
    nmapOutput = data;
}, 'text');


const bc = new BroadcastChannel('hackme');

async function initShell() {
    sendMessage("Last login: Mon Jan 17 18:59:43")

    sendMessage("You have no mail")

    sendMessage("")


    $("#termianlIn").keypress((event) => {
        if (event.keyCode === 13) {
            event.preventDefault();

            //console.log($("#termianlIn").val());

            runCommand($("#termianlIn").val())
            $("#termianlIn").val("");

        }
    })


    bc.postMessage("shell connected")

    bc.onmessage = event => {
        const message = event.data;
        if (message == "who is open") {
            bc.postMessage("shell connected")
        }else if (message == "shell.nc.received") {
            sendMessage("Connection from 127.0.0.1 port 5555");
        }
    }


    window.addEventListener('beforeunload', function (e) {
        bc.postMessage("shell disconnected")
    });
}

function sendMessage(message) {
    $("#out").before(`${message}<br>`)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(message) {

    if (!isNcAtive) {
        sendMessage("C:/root > " + message)

        const cmd = message.split(" ");
        if (!commands[cmd[0]]) return sendMessage("zsh: command not found: " + cmd[0]);

        const command = commands[cmd[0]];

        window[command.action](cmd);
    }else{
        sendMessage(message);
        if(message == "exit") isNcAtive=false;
    }
}


async function nmap(args) {
    if (args.length !== 2) {
        if (getCookie("etape") == "start") {
            bc.postMessage("game.etape.nmaptest");
            bc.postMessage("chat.send.nmaptest");
        }
        return sendMessage("usage: nmap &#60;ip&gt;");
    }

    if (args[1] != "127.0.0.1") return sendMessage("unknow ip address");

    sendMessage("scaning...")
    await sleep(1580);
    //console.log(nmapOutput.split("\n").join("<br>"));

    sendMessage(nmapOutput.split("\n").join("<br>").replace("${date}", new Date().toDateString()));

    if (getCookie("etape") == "nmaptest") {

        bc.postMessage("chat.send.nmap");
        await sleep(3000);
        bc.postMessage("game.etape.nmap");
    }

}

let isNcAtive = false;

async function nc(args) {
    if (args.length !== 3) {
        return sendMessage("usage: nc -nvlp &#60;port&gt;");
    }

    if (args[2] != "5555") return sendMessage("unknow port");

    sendMessage("Listening on 0.0.0.0 5555")
    isNcAtive = true;
    if (getCookie("etape") == "nc") {

        bc.postMessage("chat.send.reverse");
        bc.postMessage("game.etape.reverse");
    }

}

function reset(args) {
    bc.postMessage("game.reset");
}

function active() {
    console.log("hello world")
    document.getElementById("shell").style.display = "";
    document.getElementById("button").style.display = "none";
    initShell();
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
