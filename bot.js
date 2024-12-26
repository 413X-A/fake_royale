// Bot-KI-Skript

let botEinheiten = [];
let botGold = 0;
let botGoldProSekunde = 1;

function starteBot() {
    setInterval(() => {
        botGold += botGoldProSekunde;
        botAktion();
    }, 1000);
}

function botAktion() {
    // Wenn der Bot genug Gold hat, platziert er eine Einheit
    const botEinheitTypen = ["Frostläufer", "Samurai", "Ritter", "Skelett", "Wikinger", "Nachtwächter", "Drachen"];

    // Wähle zufällig eine Einheit aus
    const ausgewaehlteEinheit = botEinheitTypen[Math.floor(Math.random() * botEinheitTypen.length)];
    const kosten = getEinheitKosten(ausgewaehlteEinheit);

    if (botGold >= kosten) {
        botGold -= kosten;
        platziereBotEinheit(ausgewaehlteEinheit);
    }
}

function platziereBotEinheit(einheitTyp) {
    const spielfeld = document.getElementById('spieloberflaeche');

    const einheit = document.createElement('div');
    einheit.classList.add('bot-einheit');
    einheit.style.position = 'absolute';
    einheit.style.width = '35px';
    einheit.style.height = '35px';

    const avatar = document.createElement('img');
    avatar.style.width = '100%';
    avatar.style.height = '100%';
    avatar.style.objectFit = 'contain';

    switch (einheitTyp) {
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

    // Platziere die Einheit auf der gegnerischen Spielfeldhälfte
    const xPosition = Math.random() * (spielfeld.offsetWidth / 2) + spielfeld.offsetWidth / 2;
    const yPosition = Math.random() * spielfeld.offsetHeight;

    einheit.style.left = xPosition + 'px';
    einheit.style.top = yPosition + 'px';

    // Lebensbalken für die Einheit
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

    // Setze die HP der Einheit
    const initialHP = {
        "Frostläufer": 60,
        "Samurai": 90,
        "Ritter": 180,
        "Skelett": 80,
        "Wikinger": 120,
        "Nachtwächter": 100,
        "Drachen": 350
    };

    einheit.dataset.hp = initialHP[einheitTyp] || 0;
    einheit.dataset.initialHp = initialHP[einheitTyp] || 0;

    spielfeld.appendChild(einheit);
    botEinheiten.push(einheit);

    bewegeBotEinheit(einheit, einheitTyp);
}

function bewegeBotEinheit(einheit, einheitTyp) {
    const zielTurm = document.querySelector('.spieler-turm');
    const zielPosition = zielTurm.getBoundingClientRect();
    const spielfeldPosition = document.getElementById('spieloberflaeche').getBoundingClientRect();

    const zielX = zielPosition.left + zielPosition.width / 2 - spielfeldPosition.left;
    const zielY = zielPosition.top + zielPosition.height / 2 - spielfeldPosition.top;

    const geschwindigkeit = 1;
    const reichweite = getReichweite(einheitTyp);

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

            const angriffsInterval = setInterval(() => {
                if (einheit.dataset.destroyed === "true") {
                    clearInterval(angriffsInterval);
                    return;
                }

                const neuerAbstand = Math.sqrt((zielX - einheitX) ** 2 + (zielY - einheitY) ** 2);
                if (neuerAbstand > reichweite) {
                    clearInterval(angriffsInterval);
                } else {
                    angreifeTurm("spieler", einheitTyp);
                }
            }, 1000);
        } else {
            const schrittX = (deltaX / abstand) * geschwindigkeit;
            const schrittY = (deltaY / abstand) * geschwindigkeit;

            einheit.style.left = einheit.offsetLeft + schrittX + 'px';
            einheit.style.top = einheit.offsetTop + schrittY + 'px';
        }
    }, 20);
}

function getReichweite(einheitTyp) {
    switch (einheitTyp) {
        case "Frostläufer":
            return 35;
        case "Samurai":
            return 55;
        case "Ritter":
            return 45;
        case "Skelett":
            return 35;
        case "Wikinger":
            return 70;
        case "Nachtwächter":
            return 65;
        case "Drachen":
            return 100;
        default:
            return 0;
    }
}

// Starte den Bot
window.onload = () => {
    starteBot();
};
