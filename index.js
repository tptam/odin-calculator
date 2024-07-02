const MAX_DIGIT = 10;

// State values
const INITIAL = 0;
const NUM1_INPUTTING = 1;
const OP_INPUTTING = 2;
const NUM2_INPUTTING = 3;

// Keyboard input keys
const NUMS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const OPS = ["+", "-", "*", "/"];
const EQUALS = ["=", "Enter"];
const BACKSPACES = ["Backspace", "Delete"];
const POINTS = [".", ","];

let num1;
let num2;
let op;
let state;
let inputtingFraction;

let displayValue;
let displayString;

clear();
updateDisplay();

const numberButtons = document.querySelectorAll("button.number");
numberButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputNumber(parseInt(e.target.value));
            updateDisplay();
        }
    )
});

const operatorButtons = document.querySelectorAll("button.operator");
operatorButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputOperator(e.target.value);
            disableBackspace();
            updateDisplay();
        }
    )
});


const clearButton = document.querySelector("#clear");
clearButton.addEventListener(
    "click",
    (e) => {
        clear();
        updateDisplay();
    }
);

const equalButton = document.querySelector("#equal");
equalButton.addEventListener(
    "click",
    (e) => {
        inputEqual();
        updateDisplay();
    }
);

const pointButton = document.querySelector("#point");
pointButton.addEventListener(
    "click",
    (e) => {
        inputPoint();
        updateDisplay();
    }
);

const backspaceButton = document.querySelector("#backspace");
backspaceButton.addEventListener(
    "click",
    (e) => {
        inputBackspace();
        updateDisplay();
    }
);

const signButton = document.querySelector("#sign");
signButton.addEventListener(
    "click",
    (e) => {
        inputSign();
        updateDisplay();
    }
);

document.addEventListener(
    "keydown",
    (e) => {
        if (NUMS.includes(e.key)) {
            inputNumber(parseInt(e.key));
            updateDisplay();
        } else if (OPS.includes(e.key)) {
            inputOperator(e.key);
            updateDisplay();
        } else if (EQUALS.includes(e.key)) {
            inputEqual();
            updateDisplay();
        } else if (BACKSPACES.includes(e.key)) {
            inputBackspace();
            updateDisplay();
        } else if (POINTS.includes(e.key)) {
            inputPoint();
            updateDisplay();
        }
    }
)


function setState(newState) {
    state = newState;
    switch (state) {
        case INITIAL:
            endInputFraction();
            disableBackspace();
        case NUM1_INPUTTING:
            enableBackspace();
        case NUM2_INPUTTING:
            enableBackspace();
        case OP_INPUTTING:
            endInputFraction();
            disableBackspace;
    }
}

function inputSign() {
    switch (state) {
        case INITIAL:
            displayString = "-0";
            displayValue = 0;
            setState(NUM1_INPUTTING);
            return;
        case NUM1_INPUTTING:
            if (displayString[0] === "-") {
                displayString = displayString.slice(1);
            } else {
                displayString = "-" + displayString;
            }
            displayValue = parseFloat(displayString);
            return;
        case OP_INPUTTING:
            displayString = "-0";
            displayValue = 0;
            setState(NUM2_INPUTTING);
            return;
    }
}

function inputBackspace() {
    switch (state) {
        case INITIAL:
        case OP_INPUTTING:
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            displayString = displayString.slice(0, -1);
            if (!displayString.includes(".")) {
                endInputFraction();
            }
            if (displayString === "" || displayString === "-") {
                displayString = "0";
                displayValue = 0;
            } else {
                displayValue = parseFloat(displayString);
            }
            return;
    }
}

function enableBackspace() {
    const backspaceButton = document.querySelector("#backspace");
    backspaceButton.disabled = false;
}

function disableBackspace() {
    const backspaceButton = document.querySelector("#backspace");
    backspaceButton.disabled = true;
}

function inputPoint() {
    switch (state) {
        case INITIAL:
            startInputFraction();
            displayValue = 0;
            displayString =  "0.";
            setState(NUM1_INPUTTING);
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (inputtingFraction) {
                return;
            } else {
                startInputFraction();
                displayString =  displayString + ".";
                return;
            }
        case OP_INPUTTING:
            startInputFraction();
            displayValue = 0;
            displayString =  "0.";
            setState(NUM2_INPUTTING);
            break;
    }
}

function startInputFraction(){
    inputtingFraction = true;
    const pointButton = document.querySelector("#point");
    pointButton.disabled = true;
}

function endInputFraction(){
    inputtingFraction = false;
    const pointButton = document.querySelector("#point");
    pointButton.disabled = false;
}

function inputEqual() {
    switch (state) {
        case INITIAL:
            return;
        case NUM1_INPUTTING:
            setState(INITIAL);
            return;
        case OP_INPUTTING:
            num2 = num1;
            displayValue = operate(op, num1, num2);
            displayString =  getResultString(displayValue);
            setState(INITIAL);
            break;
        case NUM2_INPUTTING:
            num2 = displayValue;
            displayValue = operate(op, num1, num2);
            displayString =  getResultString(displayValue);
            setState(INITIAL);
            break;
    }
}

function inputOperator(input) {
    disableBackspace();
    switch (state) {
        case INITIAL:
        case NUM1_INPUTTING:
            num1 = displayValue;
            op = input;
            setState(OP_INPUTTING);
            return;
        case OP_INPUTTING:
            op = input;
            return;
        case NUM2_INPUTTING:
            num2 = displayValue;
            displayValue = operate(op, num1, num2);
            num1 = displayValue;
            op = input;
            setState(OP_INPUTTING);
            displayString =  getResultString(displayValue);
            break;
    }
}


function clear() {
    displayValue = 0;
    displayString =  "0";
    num1 = null;
    num2 = null;
    op = null;
    setState(INITIAL);
}


function inputNumber(num){
    switch(state) {
        case INITIAL:
            displayValue = num;
            displayString =  num.toString();
            setState(NUM1_INPUTTING);
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (getDisplayStringLength() === MAX_DIGIT) {
                return;
            } else {
                displayValue = parseFloat((displayString + num));
                if (displayString === "0") {
                    displayString = num.toString();
                } else if (displayString === "-0") {
                    displayString = "-" + num;
                } else {
                    displayString = displayString + num;
                }
                return;
            }
        case OP_INPUTTING:
            displayValue = num;
            displayString =  num.toString();
            setState(NUM2_INPUTTING);
            return;
    }
}


function updateDisplay() {
    const display = document.querySelector("#display");
    display.textContent = displayString;
}

function operate(op, num1, num2) {
    switch (op) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return multiply(num1, num2);
        case "/":
            return divide(num1, num2);
    }
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function getDisplayStringLength(){
    return displayString.replace(/[.-]/g, "").length;
}

function getResultString(num){
    if (Number.isNaN(num)) {
        return "nonsense @_@";
    } else if (!Number.isFinite(num)) {
        return "infinity 0_0";
    } else if (isWithinMaxDigit(num)) {
        return num.toString();
    } else if (isAbsTooLarge(num) || isAbsTooSmall(num)) {
        return roundScientific(num);
    } else {
        return roundStandard(num);
    }
}

function isAbsTooSmall(num){
    return Math.abs(num) < 10 ** -(MAX_DIGIT - 1);
}

function isAbsTooLarge(num){
    return Math.abs(num) > (10 ** MAX_DIGIT - 1);
}

function isWithinMaxDigit(num){
    const str = num.toString().replace(/[.-]/g, "");
    if (str.length > MAX_DIGIT || str.includes("e")){
        return false;
    }
    return true;
}

function roundScientific(num){
    let scientific_abs = Math.abs(num).toExponential();
    if (scientific_abs.length <= MAX_DIGIT) {
        return num.toExponential();
    } else {
        const split = scientific_abs.split(/[.e]/);
        const nonFractionDigits = (split[0] + "e" + split[2]).length;
        const fractionDigits = MAX_DIGIT - nonFractionDigits;
        return num.toExponential(fractionDigits);
    }
}

function roundStandard(num){
    let i = 0;
    let rounded = "";
    for (char of num.toFixed(MAX_DIGIT)) {
        rounded += char;
        if (char === "-" || char === ".") {
            continue;
        }
        i++;
        if (i >= MAX_DIGIT) {
            break;
        }
    }
    return rounded
        .replace(/0+$/, "")
        .replace(/\.$/, "");
}