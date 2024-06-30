const MAX_DIGIT = 9;

let num1 = null;
let num2 = null;
let op = null;

let currentDisplay = 0;

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

function inputNumber(num){
    if (Math.log10(currentDisplay) + 1 > MAX_DIGIT) {
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