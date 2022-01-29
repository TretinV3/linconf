
let text;
$.getJSON("./text.json", data => {
    text = data;
});

const masterName = 'Clara'


async function initChat() {


    const bc = new BroadcastChannel('hackme');

    bc.postMessage("chat connected");

    bc.onmessage = async event => {

        const message = event.data;
        if (message == "who is open") {
            await sleep(1000);
            bc.postMessage("chat connected")
        } else if (message.startsWith("chat.send.")) {
            const textId = message.split('.')[2];
            await sendtext(textId);

        }
    }

    window.addEventListener('beforeunload', function (e) {
        bc.postMessage("chat disconnected")
    });

    sendtext("lore");
}   

async function sendtext(textId) {
    for (let i = 0; i < text[textId].length; i++) {
        await sleep(text[textId][i].length * 10)
        sendMessage(text[textId][i]);
    }
}

function sendMessage(message) {
    $("#chat").before(`<p class="slide-up"><strong>[${masterName}]</strong> ${message}</p>`)
    const popup = new Audio('./popup.mp3');
    popup.play();
    popup.volume = 0.1;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function active() {
    document.getElementById("chat").style.display = "";
    document.getElementById("button").style.display = "none";
    initChat();
}
