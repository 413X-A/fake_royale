let nutzer = "Benutzer";
let sekunden = 60;
let minuten = 4;
let ausgewaehlteKarte = null;

let spielerTurmHP = 2500;
let gegnerTurmHP = 2500;

let gold = 0; // Startgold
let goldProSekunde = 1; // Gold pro Sekunde

// Funktion zum Generieren von Gold
function generiereGold() {
    setInterval(() => {
        gold += goldProSekunde;
        aktualisiereGoldAnzeige();
    }, 1000);
}

// Funktion zum Aktualisieren der Gold-Anzeige
function aktualisiereGoldAnzeige() {
    document.getElementById('gold-anzeige').textContent = "Gold: " + gold;
}

function counter() {
    setInterval(() => {
        sekunden--;
        text_content();
    }, 1000);
}

function ueberschriften() {
    document.getElementById('spiel-ueberschrift').textContent = "Willkommen, " + nutzer;
    document.getElementById('spiel-index').textContent = "Zur Index";
}

function zur_index() {
    window.location.href = "index.html";
}

function text_content() {
    if (sekunden === 0) {
        sekunden = 60;
        minuten--;
    }
    if (minuten === 0 && sekunden === 0) {
        minuten = 0;
        alert("Spiel beendet!");
    }
    document.getElementById('spiel-counter').textContent = minuten + "m " + sekunden + "s ";
}

function waehleKarte(karte) {
    ausgewaehlteKarte = karte;
}

// Spielmechanik

function aktualisiereHP() {
    document.querySelector('.spieler-turm').textContent = "HP: " + spielerTurmHP;
    document.querySelector('.gegner-turm').textContent = "HP: " + gegnerTurmHP;
}

function platziereEinheit(event) {
    if (ausgewaehlteKarte) {
        const einheitKosten = getEinheitKosten(ausgewaehlteKarte);

        if (gold >= einheitKosten) {
            const spielfeld = document.getElementById('spieloberflaeche').getBoundingClientRect();
            const klickY = event.clientY - spielfeld.top;

            // Spieler dürfen nur auf der unteren Hälfte platzieren
            if (klickY < spielfeld.height / 2) {
                alert("Einheiten können nur auf der unteren Hälfte platziert werden!");
                return;
            }

            gold -= einheitKosten;
            aktualisiereGoldAnzeige();

            const einheit = erstelleEinheit(ausgewaehlteKarte, event, spielfeld);
            einheit.dataset.hp = initialHP[ausgewaehlteKarte];
            einheit.dataset.initialHp = initialHP[ausgewaehlteKarte];

            bewegeEinheit(einheit, ausgewaehlteKarte);
            ausgewaehlteKarte = null;
        } else {
            alert("Nicht genügend Gold!");
        }
    } else {
        alert("Keine Karte ausgewählt!");
    }
}

function getEinheitKosten(einheitTyp) {
    switch (einheitTyp) {
        case "Frostläufer":
            return 4;
        case "Samurai":
            return 9;
        case "Ritter":
            return 5;
        case "Skelett":
            return 2;
        case "Wikinger":
            return 8;
        case "Nachtwächter":
            return 6;
        case "Drachen":
            return 17;
        default:
            return 0;
    }
}

const initialHP = {
    "Frostläufer": 60,
    "Samurai": 90,
    "Ritter": 180,
    "Skelett": 80,
    "Wikinger": 120,
    "Nachtwächter": 100,
    "Drachen": 350
};

function erstelleEinheit(karte, event, spielfeld) {
    const einheit = document.createElement('div');
    einheit.style.position = 'absolute';
    einheit.style.width = '35px';
    einheit.style.height = '35px';

    const avatar = document.createElement('img');
    avatar.style.width = '100%';
    avatar.style.height = '100%';
    avatar.style.objectFit = 'contain';

    switch (karte) {
        case "Frostläufer":
            avatar.src = "images/frostlaeufer.png";
            break;
        case "Samurai":
            avatar.src = "images/samurai.png";
            break;
        case "Ritter":
            avatar.src = "images/ritter.png";
            break;
        case "Skelett":
            avatar.src = "images/skelett.png";
            break;
        case "Wikinger":
            avatar.src = "images/wikinger.png";
            break;
        case "Nachtwächter":
            avatar.src = "images/nachtwaechter.png";
            break;
        case "Drachen":
            avatar.src = "images/drachen.png";
            break;
        default:
            avatar.src = "images/default.png";
    }
    einheit.appendChild(avatar);

    const klickX = event.clientX - spielfeld.left;
    const klickY = event.clientY - spielfeld.top;

    einheit.style.left = klickX - 20 + 'px';
    einheit.style.top = klickY - 20 + 'px';

    document.getElementById('spieloberflaeche').appendChild(einheit);

    const hpBalkenContainer = document.createElement('div');
    hpBalkenContainer.style.position = 'absolute';
    hpBalkenContainer.style.bottom = '-10px';
    hpBalkenContainer.style.left = '50%';
    hpBalkenContainer.style.transform = 'translateX(-50%)';
    hpBalkenContainer.style.width = '30px';
    hpBalkenContainer.style.height = '2.5px';

    const hpBalken = document.createElement('div');
    hpBalken.style.width = '100%';
    hpBalken.style.height = '100%';
    hpBalken.style.backgroundColor = 'green';

    hpBalkenContainer.appendChild(hpBalken);
    einheit.appendChild(hpBalkenContainer);

    return einheit;
}

function bewegeEinheit(einheit, einheitTyp) {
    const zielTurm = document.querySelector('.gegner-turm');
    const zielPosition = zielTurm.getBoundingClientRect();
    const spielfeldPosition = document.getElementById('spieloberflaeche').getBoundingClientRect();

    const zielX = zielPosition.left + zielPosition.width / 2 - spielfeldPosition.left;
    const zielY = zielPosition.top + zielPosition.height / 2 - spielfeldPosition.top;

    const geschwindigkeit = 1;
    let reichweite = 50; // Standardreichweite

    const interval = setInterval(() => {
        if (einheit.dataset.destroyed === "true") {
            clearInterval(interval);
            return;
        }

        const einheitPosition = einheit.getBoundingClientRect();
        const einheitX = einheit.offsetLeft + einheitPosition.width / 2;
        const einheitY = einheit.offsetTop + einheitPosition.height / 2;

        const deltaX = zielX - einheitX;
        const deltaY = zielY - einheitY;

        const abstand = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        if (abstand <= reichweite) {
            clearInterval(interval);
            angreifeTurm("gegner", einheitTyp);
        } else {
            const schrittX = (deltaX / abstand) * geschwindigkeit;
            const schrittY = (deltaY / abstand) * geschwindigkeit;

            einheit.style.left = einheit.offsetLeft + schrittX + 'px';
            einheit.style.top = einheit.offsetTop + schrittY + 'px';
        }
    }, 20);
}

// Bot-bezogene Funktionen entfernt

window.onload = () => {
    aktualisiereHP();
    counter();
    ueberschriften();
    generiereGold();
};
