const MAX_DIGIT = 9;

// State values
const INITIAL = 0;
const NUM1_INPUTTING = 1;
const OP_INPUTTING = 2;
const NUM2_INPUTTING = 3;

let num1;
let num2;
let op;
let state = INITIAL;

let currentDisplayValue = 0;


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


function inputEqual() {
    switch (state) {
        case INITIAL:
        case NUM1_INPUTTING:
            break;
        case OP_INPUTTING:
            num2 = num1;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            break;
        case NUM2_INPUTTING:
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            state = INITIAL;
            break;
    }
}

function inputOperator(input) {
    switch (state) {
        case INITIAL:
        case NUM1_INPUTTING:
            num1 = currentDisplayValue;
            op = input;
            state = OP_INPUTTING;
            break;
        case OP_INPUTTING:
            op = input;
            break;
        case NUM2_INPUTTING:
            num2 = currentDisplayValue;
            currentDisplayValue = operate(op, num1, num2);
            num1 = currentDisplayValue;
            op = input;
            state = OP_INPUTTING;
            break;
    }
}


function clear() {
    currentDisplayValue = 0;
    state = INITIAL;   
}


function inputNumber(num){
    switch(state) {
        case INITIAL:
            currentDisplayValue = num;
            state = NUM1_INPUTTING;
            break;
        case NUM1_INPUTTING:
        case NUM2_INPUTTING:
            if (currentDisplayValue.toString().length > MAX_DIGIT) {
                break;
            } else {
                currentDisplayValue = currentDisplayValue * 10 + num;
                break;
            }
        case OP_INPUTTING:
            currentDisplayValue = num;
            state = NUM2_INPUTTING;
            break;
    }
}

function updateDisplay() {
    const display = document.querySelector("#display");
    display.textContent = getResultString(currentDisplayValue);
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
    } else if (num === 0) {
        return "0";
    } else if (num > -1 * 10 ** (-MAX_DIGIT + 3) && num < 10 ** (-MAX_DIGIT + 2)) {
        // too small abs
        return roundScientific(num);
    } else if (num >= 10 ** MAX_DIGIT || num <= -1 * 10 ** (MAX_DIGIT - 1)) {
        // too large abs
        return roundScientific(num);
    } else {
        return roundFraction(num);
    }
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

function roundFraction(num) {
    return num.toFixed(MAX_DIGIT).slice(0, MAX_DIGIT).split(/\.?0*$/)[0];
}