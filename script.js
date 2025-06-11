const display = document.getElementById("display");
const keypad = document.getElementById("keypad");

let firstNum = "";
let secondNum = "";
let operator = "";
let resultShown = false;

const keys = [
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "−",
  "0", ".", "=", "+",
  "Clear"
];

// Create buttons
keys.forEach(label => {
  const key = document.createElement("div");
  key.textContent = label;
  key.classList.add("key");

  if (["÷", "×", "−", "+", "="].includes(label)) key.classList.add("operator");
  if (label === "Clear") key.classList.add("clear");

  key.addEventListener("click", () => handleInput(label));
  keypad.appendChild(key);
});

function handleInput(label) {
  highlightKey(label);

  if (label === "Clear") {
    clearAll();
    return;
  }

  if (label === "=") {
    calculate();
    return;
  }

  if (["÷", "×", "−", "+"].includes(label)) {
    if (firstNum && !operator) {
      operator = label;
      display.textContent = `${firstNum} ${operator}`;
      resultShown = false;
    } else if (resultShown) {
      operator = label;
      secondNum = "";
      resultShown = false;
      display.textContent = `${firstNum} ${operator}`;
    }
    return;
  }

  // Handle number or dot
  if (resultShown && !operator) {
    // Start new calculation if user enters a digit after result
    clearAll();
  }

  if (!operator) {
    if (label === "." && firstNum.includes(".")) return;
    firstNum += label;
    display.textContent = firstNum;
  } else {
    if (label === "." && secondNum.includes(".")) return;
    secondNum += label;
    display.textContent = `${firstNum} ${operator} ${secondNum}`;
  }
}

function calculate() {
  if (!firstNum || !operator || !secondNum) return;

  let a = parseFloat(firstNum);
  let b = parseFloat(secondNum);
  let res = NaN;

  switch (operator) {
    case "+": res = a + b; break;
    case "−": res = a - b; break;
    case "×": res = a * b; break;
    case "÷":
      if (b === 0) {
        alert("Cannot divide by zero!");
        return;
      }
      res = Math.round((a / b) * 100) / 100;
      break;
  }

  display.textContent = res;

  // Setup for chaining
  firstNum = String(res);
  secondNum = "";
  operator = "";
  resultShown = true;
}

function clearAll() {
  firstNum = "";
  secondNum = "";
  operator = "";
  resultShown = false;
  display.textContent = "";
}

function highlightKey(label) {
  const key = [...keypad.children].find(el => el.textContent === label);
  if (key) {
    key.classList.add("highlight");
    setTimeout(() => key.classList.remove("highlight"), 100);
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  const keyMap = {
    "/": "÷",
    "*": "×",
    "-": "−",
    "+": "+",
    "Enter": "=",
    "=": "=",
    "Escape": "Clear"
  };

  if ((key >= "0" && key <= "9") || key === ".") {
    handleInput(key);
  } else if (key in keyMap) {
    event.preventDefault(); // Prevent unwanted side effects
    handleInput(keyMap[key]);
  }
});