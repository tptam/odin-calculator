const MAX_DIGIT = 9;

// State values
const INITIAL = 0;
const NUM1_INPUTTING = 1;
const OP_INPUTTING = 2;
const NUM2_INPUTTING = 3;


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

function inputSign() {
    switch (state) {
        case INITIAL:
            displayString = "-0";
            displayValue = 0;
            enableBackspace();
            state = NUM1_INPUTTING;
            return;
        case NUM1_INPUTTING:
            if (displayString[0] === "-") {
                displayString = displayString.slice(1);
                return;
            } else {
                if (displayString.length > MAX_DIGIT) {
                    return;
                } else {
                    displayString = "-" + displayString;
                    displayValue = parseFloat(displayString);
                    return;
                }
            }
        case OP_INPUTTING:
            displayString = "-0";
            displayValue = 0;
            enableBackspace();
            state = NUM2_INPUTTING;
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
            state = NUM1_INPUTTING;
            enableBackspace();
            displayString =  "0.";
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
            state = NUM2_INPUTTING;
            enableBackspace();
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
            endInputFraction();
            state = INITIAL;
            disableBackspace();
            return;
        case OP_INPUTTING:
            num2 = num1;
            displayValue = operate(op, num1, num2);
            state = INITIAL;
            displayString =  getResultString(displayValue);
            break;
        case NUM2_INPUTTING:
            endInputFraction();
            num2 = displayValue;
            displayValue = operate(op, num1, num2);
            state = INITIAL;
            disableBackspace();
            displayString =  getResultString(displayValue);
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
            endInputFraction();
            state = OP_INPUTTING;
            return;
        case OP_INPUTTING:
            op = input;
            return;
        case NUM2_INPUTTING:
            num2 = displayValue;
            displayValue = operate(op, num1, num2);
            num1 = displayValue;
            op = input;
            endInputFraction();
            state = OP_INPUTTING;
            displayString =  getResultString(displayValue);
            break;
    }
}


function clear() {
    endInputFraction();
    displayValue = 0;
    displayString =  "0";
    num1 = null;
    num2 = null;
    op = null;
    state = INITIAL;
    disableBackspace();
}


function inputNumber(num){
    switch(state) {
        case INITIAL:
            displayValue = num;
            state = NUM1_INPUTTING;
            enableBackspace();
            displayString =  num.toString();
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (displayString.length === MAX_DIGIT) {
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
            state = NUM2_INPUTTING;
            enableBackspace();
            displayString =  num.toString();
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

function isAbsTooSmall(num) {
    return num > -1 * 10 ** (-MAX_DIGIT + 3) && num < 10 ** (-MAX_DIGIT + 2);
}

function isAbsTooLarge(num) {
    return num >= 10 ** MAX_DIGIT || num <= -1 * 10 ** (MAX_DIGIT - 1);
}

function isWithinMaxDigit(num){
    const str = num.toString();
    if (str.length > MAX_DIGIT || str.includes("e")){
        return false;
    }
    return true;
}

function roundScientific(num){
    let scientific = num.toExponential();
    if (scientific.length <= MAX_DIGIT) {
        return scientific;
    } else {
        const parts = scientific.split(/[\.e]/);
        const fractionDigits = MAX_DIGIT - (parts.at(0) + parts.at(-1)).length - 2;
        return num.toExponential(fractionDigits);
    }
}

function roundStandard(num) {
    return num
        .toFixed(MAX_DIGIT)
        .slice(0, MAX_DIGIT)
        .replace(/0+$/, "");
}