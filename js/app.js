/* ============================================================
   Assignment 2 · JavaScript Project · Scenario C: A squad sheet

   YOUR SCRIPT. It is empty on purpose. Everything it has to do
   is below, in the order the labs did it, and every line of it
   is something you have written before, except the three moves
   the brief lists under "Three things the labs did not do".

   The nine things (each one is a block in the rubric):

     1. The data: ONE array of objects, `players`, at least three
        properties of at least two types. Loaded from storage,
        with a fallback to defaults (see 7).
     2. render(): empties ul.item-list, loops the array, makes
        each <li class="item"> with createElement / textContent /
        append. No innerHTML. Puts the derived value (6) in
        p.summary.
     3. The form: listen for "submit" on form.add-form, call
        event.preventDefault(), read each field's .value, convert
        every number with Number(), push the object, render().
     4. Validation: the text field may not be empty (.trim()),
        the number must make sense for this scenario. On failure,
        a message in p.form-message with .is-error, and return.
        On success, clear the message and form.reset().
     5. A button on every player ("Scored"): made in render(),
        type = "button", listener changes the data, then render().
     6. A derived value worked out from the whole array every
        time render() runs: total goals, or the top scorer.
     7. save() after EVERY change to the data (3, 5, 8), with
        JSON.stringify. load() at the start with JSON.parse and
        `if (stored === null)` falling back to the defaults.
     8. button.clear-all: removeItem, defaults back, save(),
        render().
     9. Code you can explain: const/let used right, names that
        mean something, one render(), no errors in the console.

   Start with 1 and 2. A list that draws from an array is worth
   more than a form that does not work yet.
   ============================================================ */

console.log("app.js is running.");

const formElm = document.querySelector(".add-form");
const playerNameElm = document.querySelector("#player-name");
const playerShirtElm = document.querySelector("#player-shirt");
const playerGoalsElm = document.querySelector("#player-goals");
const playerPositionElm = document.querySelector("#player-position");
const itemList = document.querySelector(".item-list");

const formMessageError = document.querySelector(".form-message");

const summaryMsg = document.querySelector(".summary");

const clearAllBtn = document.querySelector(".clear-all");

let playerArray = [];
load();

formElm.addEventListener("submit", function (event) {
  event.preventDefault();

  const playerNameVal = playerNameElm.value;
  const playerShirtVal = playerShirtElm.value;
  const playerGoalsVal = Number(playerGoalsElm.value);
  const playerPositionVal = playerPositionElm.value;

  if (!validationCheck()) {
    formElm.reset();
    return;
  }

  const players = playerList(
    playerNameVal,
    playerShirtVal,
    playerGoalsVal,
    playerPositionVal,
  );

  save();

  render(players);
  totalGoals();
});

function playerList(name, shirt, goals, position) {
  playerArray.push({
    name: name,
    shirt: shirt,
    goals: goals,
    position: position,
  });

  return playerArray;
}

function renderPlayers(plist) {
  const card = document.createElement("li");
  card.classList.add("item");

  const pname = document.createElement("h3");
  pname.textContent = plist["name"];

  const pshirt = document.createElement("h3");
  pshirt.textContent = plist["shirt"];
  pshirt.classList.add("shirt");

  const pgoals = document.createElement("p");
  pgoals.textContent = plist["goals"];
  pgoals.classList.add("value");

  const pposition = document.createElement("p");
  pposition.textContent = plist["position"];
  pposition.classList.add("meta");

  const buttonScored = document.createElement("button");
  buttonScored.textContent = "Scored";

  card.append(pname, pshirt, pgoals, pposition, buttonScored);

  buttonScored.addEventListener("click", () => {
    const index = playerArray.findIndex((item) => item.name === plist.name);
    playerArray[index]["goals"] += 1;
    save();
    render(playerArray);
  });

  return card;
}

function render(playerobjArray) {
  itemList.replaceChildren();

  for (let item of playerobjArray) {
    itemList.append(renderPlayers(item));
  }
}

function validationCheck() {
  if (playerNameElm.value.trim() == "") {
    formMessageError.classList.add("is-error");
    formMessageError.textContent = "Text field cannot be empty";
    return false;
  }
  if (Number(playerShirtElm.value.trim()) > 99) {
    formMessageError.classList.add("is-error");
    formMessageError.textContent = "Number cannot exceed 99";
    return false;
  }
  return true;
}

function totalGoals() {
  let topScorer = "";
  let max = 0;
  let total = 0;
  for (let item of playerArray) {
    if (Number(item.goals) > max) {
      max = Number(item.goals);
      topScorer = item.name;
    }
    total = total + Number(item.goals);
  }

  summaryMsg.textContent = `${total} · Top scorer: ${topScorer}(${max})`;
}

function save() {
  localStorage.setItem("players", JSON.stringify(playerArray));
}

function load() {
  const stored = localStorage.getItem("players");

  if (stored === null) {
    return;
  }

  const updatedPlayerArray = JSON.parse(stored);
  playerArray = updatedPlayerArray;
  render(playerArray);
}

clearAllBtn.addEventListener("click", function () {
  itemList.replaceChildren();
  playerArray = [];
  localStorage.removeItem("players");
  summaryMsg.textContent = "";
});
