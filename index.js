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


let currentDisplayValue;
let currentDisplayString;
let nextDisplayString;

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

function inputPoint() {
    switch (state) {
        case INITIAL:
            startInputFraction();
            currentDisplayValue = 0;
            state = NUM1_INPUTTING;
            nextDisplayString = "0.";
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (inputtingFraction) {
                return;
            } else {
                startInputFraction();
                nextDisplayString = currentDisplayValue.toString() + ".";
                return;
            }
        case OP_INPUTTING:
            startInputFraction();
            currentDisplayValue = 0;
            nextDisplayString = "0.";
            state = NUM2_INPUTTING;
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
            // nextDisplayString = currentDisplayString;
            return;
        case NUM1_INPUTTING:
            endInputFraction();
            state = INITIAL;
            // nextDisplayString = currentDisplayString;
            return;
        case OP_INPUTTING:
            num2 = num1;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            nextDisplayString = getResultString(currentDisplayValue);
            break;
        case NUM2_INPUTTING:
            endInputFraction();
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            nextDisplayString = getResultString(currentDisplayValue);
            break;
    }
}

function inputOperator(input) {
    switch (state) {
        case INITIAL:
        case NUM1_INPUTTING:
            num1 = currentDisplayValue;
            op = input;
            endInputFraction();
            state = OP_INPUTTING;
            // nextDisplayString = currentDisplayString;
            return;
        case OP_INPUTTING:
            op = input;
            // nextDisplayString = currentDisplayString;
            return;
        case NUM2_INPUTTING:
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            num1 = currentDisplayValue;
            op = input;
            endInputFraction();
            state = OP_INPUTTING;
            nextDisplayString = getResultString(currentDisplayValue);
            break;
    }
}


function clear() {
    endInputFraction();
    currentDisplayValue = 0;
    state = INITIAL;
    nextDisplayString = "0";
}


function inputNumber(num){
    switch(state) {
        case INITIAL:
            currentDisplayValue = num;
            state = NUM1_INPUTTING;
            nextDisplayString = num.toString();
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (currentDisplayString.length === MAX_DIGIT) {
                return;
            } else {
                currentDisplayValue = parseFloat((currentDisplayString + num));
                nextDisplayString = currentDisplayString + num;
                return;
            }
        case OP_INPUTTING:
            currentDisplayValue = num;
            state = NUM2_INPUTTING;
            nextDisplayString = num.toString();
            return;
    }
}


function updateDisplay() {
    const display = document.querySelector("#display");
    display.textContent = nextDisplayString;
    currentDisplayString = nextDisplayString;
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
    const str = num.toFixed(MAX_DIGIT).slice(0, MAX_DIGIT);
    return str.at(-1) === "." ? str.slice(0, -1) : str;
}