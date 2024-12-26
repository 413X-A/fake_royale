// Variablen
let nutzer = ["Mama","Papa","Luce","Alex"];
let ein_nutzer = nutzer[Math.floor(Math.random() * nutzer.length)]
let sekunden = 0;
let minuten = 0;
let stunden = 0;
let tage = 0;
let jahre = 0;

function counter() {
    setInterval(() => {
    sekunden++;
    text_content();
    }, 1000);
}

function ueberschriften() {
    document.getElementById('index-ueberschrift').textContent = "Willkommen, " + ein_nutzer;
    document.getElementById('index-spielstart').textContent = "Spiel starten";
}

function spiel_starten() {
    window.location.href = "spiel.html";
}

function text_content() {
    if (sekunden === 60) {
        sekunden = 0;
        minuten++;
    }
    if (minuten === 60) {
        minuten = 0;
        stunden++;
    }
    if (stunden === 24) {
        stunden = 0;
        tage++;
    }
    if (tage === 365) {
        tage = 0;
        jahre++;
    }
    document.getElementById('index-counter').textContent = jahre + "j " + tage + "t " + stunden + "h " + minuten + "m " + sekunden + "s ";
}

// Loop starten
counter();
ueberschriften();