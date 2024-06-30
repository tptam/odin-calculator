const MAX_DIGIT = 9;

let num1 = null;
let num2 = null;
let op = null;
let lastButton;

let currentDisplay = 0;

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


function inputOperator(input) {
    if (num1 === null) {
        num1 = currentDisplay;
        op = input;
    } else if (lastButton === "operator"){
        op = input;
    } else {
        num2 = currentDisplay;
        currentDisplay = operate(op, num1, num2);
        num1 = currentDisplay;
        num2 = null;
        op = input;
    }
}

function clear() {
    num1 = null;
    num2 = null;
    op = null;
    currentDisplay = 0;    
}


function inputNumber(num){
    if (currentDisplay.toString().length > MAX_DIGIT) {
        return;
    }
    if (currentDisplay === 0) {
        currentDisplay = num;
    } else if (op !== null && num2 === null) {
        currentDisplay = num;
    } else {
        currentDisplay = currentDisplay * 10 + num;
    }
}

function updateDisplay() {
    const display = document.querySelector("#display");
    display.textContent = currentDisplay;
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