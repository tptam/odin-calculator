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

clear();
updateDisplay();

const numberButtons = document.querySelectorAll("button.number");
numberButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputNumber(parseInt(e.target.value));
        }
    )
});

const operatorButtons = document.querySelectorAll("button.operator");
operatorButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputOperator(e.target.value);
        }
    )
});


const clearButton = document.querySelector("#clear");
clearButton.addEventListener(
    "click",
    (e) => {
        clear();
    }
);

const equalButton = document.querySelector("#equal");
equalButton.addEventListener(
    "click",
    (e) => {
        inputEqual();
    }
);

const pointButton = document.querySelector("#point");
pointButton.addEventListener(
    "click",
    (e) => {
        inputPoint();
    }
);

function inputPoint() {
    switch (state) {
        case INITIAL:
            startInputFraction();
            currentDisplayValue = 0;
            state = NUM1_INPUTTING;
            updateDisplay("0.");
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (inputtingFraction) {
                return;
            } else {
                startInputFraction();
                updateDisplay(currentDisplayValue.toString() + ".");
                return;
            }
        case OP_INPUTTING:
            startInputFraction();
            currentDisplayValue = 0;
            updateDisplay("0.");
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
            return;
        case NUM1_INPUTTING:
            endInputFraction();
            state = INITIAL;
            return;
        case OP_INPUTTING:
            num2 = num1;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            updateDisplay();
            break;
        case NUM2_INPUTTING:
            endInputFraction();
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            updateDisplay();
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
            return;
        case OP_INPUTTING:
            op = input;
            return;
        case NUM2_INPUTTING:
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            num1 = currentDisplayValue;
            op = input;
            endInputFraction();
            state = OP_INPUTTING;
            updateDisplay();
            break;
    }
}


function clear() {
    endInputFraction();
    currentDisplayValue = 0;
    state = INITIAL;
    updateDisplay();
}


function inputNumber(num){
    switch(state) {
        case INITIAL:
            currentDisplayValue = num;
            state = NUM1_INPUTTING;
            updateDisplay();
            return;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (currentDisplayString.length === MAX_DIGIT) {
                return;
            } else {
                if (inputtingFraction) {
                    currentDisplayValue = parseFloat((currentDisplayString + num));
                } else {
                    currentDisplayValue = parseInt((currentDisplayString + num));
                }
                updateDisplay(currentDisplayString + num);
                return;
            }
        case OP_INPUTTING:
            currentDisplayValue = num;
            state = NUM2_INPUTTING;
            updateDisplay();
            return;
    }
}


function updateDisplay(str) {
    const display = document.querySelector("#display");
    if (str === undefined) {
        display.textContent = getResultString(currentDisplayValue);
    } else {
        display.textContent = str;
    }
    currentDisplayString = display.textContent;
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