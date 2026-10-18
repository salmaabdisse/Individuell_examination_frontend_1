
//Datum och tid START
function formateraTid(datum) {
    const hours = String(datum.getHours()).padStart(2, "0");
    const minutes = String(datum.getMinutes()).padStart(2, "0");
    const seconds = String(datum.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}



function formateraDatum(datum) {
    return datum.toLocaleDateString("sv-SE", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"

    });

}


function arOppet(datum) {
    const weekday = datum.getDay();
    const hour = datum.getHours();

    if (weekday >= 1 && weekday <= 5) {
        if (hour >= 7 && hour < 18) {
            return true;
        }
    }
    if (weekday === 6) {
        if (hour >= 9 && hour < 14) {
            return true;
        }
    }
    return false;
}

const dateElement = document.getElementById("dagensDatum");
const nu = new Date();
dateElement.textContent = formateraDatum(nu);

const timeElement = document.getElementById("tidNu");
timeElement.textContent = formateraTid(nu);

const statusElement = document.getElementById("status");
if (arOppet(nu) === true) {
    statusElement.textContent = "Öppet";
} else {
    statusElement.textContent = "Stängt";
}


setInterval(() => {
    const nu = new Date();
    dateElement.textContent = formateraDatum(nu)
    timeElement.textContent = formateraTid(nu)

    if (arOppet(nu) === true) {
        statusElement.textContent = "Öppet";
    } else {
        statusElement.textContent = "Stängt";
    }
}, 1000);
//Datum och tid END


//DOM
const form = document.querySelector("#bokningsForm");
const inputName = document.querySelector("#namn");
const bokningslista = document.querySelector("#bokningsLista");
const statistik = document.querySelector("#bokningsStats");
const bokningsfel = document.querySelector("#bokningsFel");
const inputDate = document.querySelector("#date");
//

//Hämtar sparade bokningar om tillgängliga
const sparadeBokningar = localStorage.getItem("bokningar");
const bokningar = JSON.parse(sparadeBokningar) || [];
//

//class skapad, hanterar bokningar och dess lagring
class Bokningslista {
    constructor(bokningar) {
        this.bokningar = bokningar;
    }
    laggTill(bokning) {
        this.bokningar.push(bokning)
        this.spara();
    }
    spara() {
        localStorage.setItem("bokningar", JSON.stringify(this.bokningar));
    }
    taBort(index) {
        this.bokningar.splice(index, 1);
        this.spara();
    }

    antal() {
        return this.bokningar.length;
    }
}
const minLista = new Bokningslista(bokningar);
//

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = inputName.value.trim();
    const date = inputDate.value;
    if (name === "" || date === "") {
        bokningsfel.textContent = " Var vänlig och skriv in dina uppgifter*"

        return;
    }
    else {
        bokningsfel.textContent = ""

        const bokning = {
            name: inputName.value.trim(),
            date: inputDate.value

        };

        minLista.laggTill(bokning);
        form.reset();
    }
    renderBokningar()
});

renderBokningar();

//kontrollerar om gamla bokningar finns,rensar och skapar medd om tom lista....
function renderBokningar() {
    bokningslista.innerHTML = "";

    statistik.textContent = "Antal bokningar: " + minLista.antal();


    if (minLista.bokningar.length === 0) {
        const ingaBokningar = document.createElement("p");
        ingaBokningar.textContent = " Du har inga förfrågningar ännu"
        //
        bokningslista.appendChild(ingaBokningar);
    }
    else {
        minLista.bokningar.forEach((bokning) => {
            const listElement = document.createElement("li");
            listElement.textContent = bokning.name + " - Datum: " + bokning.date;
            const avbokaBtn = document.createElement("button");
            avbokaBtn.textContent = "Avboka"
            avbokaBtn.classList.add("avbokaButton");

            listElement.appendChild(avbokaBtn);
            bokningslista.appendChild(listElement);

            avbokaBtn.addEventListener("click", (event) => {
                const index = minLista.bokningar.findIndex((annanBokning) =>
                    annanBokning.name === bokning.name &&
                    annanBokning.date === bokning.date
                );
                minLista.taBort(index);
                renderBokningar();
            });
        });
    }
};

//recensioner

const recensioner = [
    "Underbart och trevligt bemötande av hundskötarna!",
    "Fina promenadmöjligheter och tillgång till skogsområde",
    "Min hund är väldigt glad efter en heldag hos Tassen.",
    "Utmärkt service!",
    "Väldigt kunnig och professionell personal."
];


const recensionText = document.getElementById("recensionText");
const nyRecension = document.getElementById("nyRecension");


nyRecension.addEventListener("click", () => {
    const slumpa = Math.floor(Math.random() * recensioner.length);
    recensionText.textContent = recensioner[slumpa];
});


