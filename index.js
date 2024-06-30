const MAX_DIGIT = 9;

// State values
const NUM1_INPUTTING = 1;
const OP_INPUTTING = 2;
const NUM2_INPUTTING = 3;

let num1 = null;
let num2 = null;
let op = null;
let lastButton;
let state = NUM1_INPUTTING;

let currentDisplayValue = 0;


const numberButtons = document.querySelectorAll("button.number");
numberButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputNumber(parseInt(e.target.value));
            lastButton = "number";
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
            lastButton = "operator";
            updateDisplay();
        }
    )
});


const clearButton = document.querySelector("#clear");
clearButton.addEventListener(
    "click",
    (e) => {
        clear();
        lastButton = "clear";
        updateDisplay();
    }
);

const equalButton = document.querySelector("#equal");
equalButton.addEventListener(
    "click",
    (e) => {
        inputEqual();
        lastButton = "equal";
        updateDisplay();
    }
);


function inputEqual() {
    if (lastButton === "equal") {
        return;
    }
    num2 = currentDisplayValue;
    currentDisplayValue = operate(op, num1, num2);
    num1 = null;
    num2 = null;
    op = null;
}

function inputOperator(input) {
    if (num1 === null) {
        num1 = currentDisplayValue;
        op = input;
    } else if (lastButton === "operator"){
        op = input;
    } else {
        num2 = currentDisplayValue;
        currentDisplayValue = operate(op, num1, num2);
        num1 = currentDisplayValue;
        num2 = null;
        op = input;
    }
}

function clear() {
    num1 = null;
    num2 = null;
    op = null;
    currentDisplayValue = 0;    
}


function inputNumber(num){
    if (currentDisplayValue.toString().length > MAX_DIGIT) {
        return;
    }
    if (lastButton === "number") {
        currentDisplayValue = currentDisplayValue * 10 + num;
    } else {
        currentDisplayValue = num;
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
    if (num === Infinity) {
        return "infinity 0_0";
    }
    if (num.toString().length <= MAX_DIGIT) {
        return num.toString();
    } else {
        let scientific = num.toExponential();
        if (scientific.length <= MAX_DIGIT) {
            return scientific;
        } else {
            const parts = scientific.split(/[\.e]/);
            const fractionDigits = MAX_DIGIT - (parts.at(0) + parts.at(-1)).length - 2;
            return num.toExponential(fractionDigits);
        }
    }
}