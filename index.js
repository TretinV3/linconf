let etape = "init";

async function loadPage(pageName) {
    $("#page").load("./pages/" + pageName + ".html");

    if (getCookie("etape") == "nmap" && pageName == "safeSecur/login") {
        setEtape("loginpage");
        bc.postMessage("chat.send.loginpage");
        await sleep(2000);
        bc.postMessage("chat.send.sqltest");
    }
}

const bc = new BroadcastChannel('hackme');

bc.onmessage = async (event) => {
    if(event.data=="game.reset"){
        await setEtape("init");
        await goPageEtape();
    }else if (event.data.startsWith("game.etape.")) {
        const etapeId = event.data.split('.')[2];
        
        setEtape(etapeId);

    }
}

let pageLinks;
$.getJSON("./pages/links", data => {
    pageLinks = data;
});

console.log(getCookie("etape"));

function setEtape(etapeName) {
    etape=etapeName;
    setCookie("etape", etapeName, 1);
    if(pageLinks[getCookie("etape")]) goPageEtape(etapeName);
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
function setCookie(cname, cvalue, exdays){
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

async function goPageEtape(){
    await sleep(1000);
    loadPage(pageLinks[getCookie("etape")]);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}