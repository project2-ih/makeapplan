const participantsAvailable = [
  { type: "social", participants: [1, 2, 3, 4] },
  { type: "education", participants: [1] },
  { type: "recreational", participants: [1, 2, 3, 4, 5, 8] },
  { type: "diy", participants: [1] },
  { type: "charity", participants: [1] },
  { type: "cooking", participants: [1, 2, 3] },
  { type: "relaxation", participants: [1] },
  { type: "music", participants: [1, 4, 5] },
  { type: "busywork", participants: [1] }
];

const accessibilityAvailable = [
  { type: "social", accessibility: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.32, 0.35, 0.4, 0.7, 0.8, 0.9] },
  { type: "education", accessibility: [0.05, 0.1, 0.2, 0.25, 0.7, 0.8, 0.9] },
  { type: "recreational", accessibility: [0, 0.07, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.9, 1] },
  { type: "diy", accessibility: [0.1, 0.15, 0.2, 0.3, 0.6] },
  { type: "charity", accessibility: [0.05, 0.1, 0.35, 0.5] },
  { type: "cooking", accessibility: [0.05, 0.2, 0.3, 0.8] },
  { type: "relaxation", accessibility: [0, 0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.3, 0.5] },
  { type: "music", accessibility: [0, 0.2, 0.3, 0.4, 0.6, 0.8, 0.9] },
  { type: "busywork", accessibility: [0, 0.02, 0.1, 0.15] }
];

const pricesAvailable = [
  { type: "social", price: [0, 0.02, 0.05, 0.1, 0.2, 0.4, 0.5, 0.6] },
  { type: "education", price: [0, 0.05, 0.1] },
  { type: "recreational", price: [0, 0.05, 0.1, 0.2, 0.25, 0.3, 0.4, 0.8] },
  { type: "diy", price: [0, 0.1, 0.2, 0.3, 0.4] },
  { type: "charity", price: [0, 0.1, 0.4] },
  { type: "cooking", price: [0, 0.2, 0.3, 0.4] },
  { type: "relaxation", price: [0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.4] },
  { type: "music", price: [0, 0.05, 0.08, 0.1, 0.3, 0.55, 0.6] },
  { type: "busywork", price: [0, 0.05] }
];

function applyChangeToDropdown(type) {

  let availablesOfChosenParticipants = participantsAvailable.filter(x => x.type === type)[0].participants;
  let availablesOfChosenAccesibility = accessibilityAvailable.filter(x => x.type === type)[0].accessibility;
  let availablesOfChosenPrices = pricesAvailable.filter(x => x.type === type)[0].price;

  // Participants
  document.querySelectorAll(".participantsAvailable option")
    .forEach(x => x.removeAttribute("disabled", "disabled"));

  document.querySelectorAll(".participantsAvailable option")
    .forEach(x => {
    if (availablesOfChosenParticipants.indexOf(+x.value) === -1) {
      x.setAttribute("disabled", "disabled");
    }
  });

  // Accesibility
  document.querySelectorAll(".accessibilityAvailable option")
    .forEach(x => x.removeAttribute("disabled", "disabled"));

  document.querySelectorAll(".accessibilityAvailable option")
    .forEach(x => {
    if (availablesOfChosenAccesibility.indexOf(+x.value) === -1) {
      x.setAttribute("disabled", "disabled");
    }
  });

  // Prices
  document.querySelectorAll(".pricesAvailable option")
    .forEach(x => x.removeAttribute("disabled", "disabled"));

  document.querySelectorAll(".pricesAvailable option")
    .forEach(x => {
    if (availablesOfChosenPrices.indexOf(+x.value) === -1) {
      x.setAttribute("disabled", "disabled");
    }
  });
}

document.querySelector(".radio.education").onclick = function() {
  applyChangeToDropdown("education");
};

document.querySelector(".radio.recreational").onclick = function() {
  applyChangeToDropdown("recreational");
};

document.querySelector(".radio.social").onclick = function() {
  applyChangeToDropdown("social");
};

document.querySelector(".radio.diy").onclick = function() {
  applyChangeToDropdown("diy");
};

document.querySelector(".radio.charity").onclick = function() {
  applyChangeToDropdown("charity");
};

document.querySelector(".radio.cooking").onclick = function() {
  applyChangeToDropdown("cooking");
};

document.querySelector(".radio.relaxation").onclick = function() {
  applyChangeToDropdown("relaxation");
};

document.querySelector(".radio.music").onclick = function() {
  applyChangeToDropdown("music");
};

document.querySelector(".radio.busywork").onclick = function() {
  applyChangeToDropdown("busywork");
};