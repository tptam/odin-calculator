const MAX_DIGIT = 10;

// State values
const INITIAL = 0;
const NUM1_INPUTTING = 1;
const OP_INPUTTING = 2;
const NUM2_INPUTTING = 3;

const NUM_KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const OP_KEYS = {"+": "add", "-": "subtract", "*": "multiply", "/": "divide"};
const EQUAL_KEYS = ["=", "Enter"];
const BACKSPACE_KEYS = ["Backspace", "Delete"];
const POINT_KEYS = [".", ","];

let num1;
let num2;
let op;

let state;
let inputtingFraction;

let displayValue;
let displayString;


const numberButtons = document.querySelectorAll("button.number");
numberButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputNumber(parseInt(e.target.value));
            updateDisplay();
        }
    );
});

const operatorButtons = document.querySelectorAll("button.operator");
operatorButtons.forEach(button => {
    button.addEventListener(
        "click",
        (e) => {
            inputOperator(e.target.value);
            updateDisplay();
        }
    );
});

const equalButton = document.querySelector("#equal");
equalButton.addEventListener(
    "click",
    (e) => {
        inputEqual();
        updateDisplay();
    }
);

const clearButton = document.querySelector("#clear");
clearButton.addEventListener(
    "click",
    (e) => {
        clear();
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

const pointButton = document.querySelector("#point");
pointButton.addEventListener(
    "click",
    (e) => {
        inputPoint();
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

// For touch screen devices
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener(
        "touchstart",
        (e) => {
            glowButton(e.target.id);
        }
    );
    button.addEventListener(
        "touchend",
        (e) => {
            unglowButton(e.target.id);
        }
    );
});

//For keystroke input
document.addEventListener(
    "keydown",
    (e) => {
        if (NUM_KEYS.includes(e.key)) {
            inputNumber(parseInt(e.key));
            updateDisplay();
            glowButton("num" + e.key);
        } else if (e.key in OP_KEYS) {
            inputOperator(e.key);
            updateDisplay();
            glowButton(OP_KEYS[e.key]);
        } else if (EQUAL_KEYS.includes(e.key)) {
            inputEqual();
            updateDisplay();
            glowButton("equal");
        } else if (BACKSPACE_KEYS.includes(e.key)) {
            inputBackspace();
            updateDisplay();
            glowButton("backspace");
        } else if (POINT_KEYS.includes(e.key)) {
            inputPoint();
            updateDisplay();
            glowButton("point");
        }
    }
)
document.addEventListener(
    "keyup",
    (e) => {
        if (NUM_KEYS.includes(e.key)) {
            unglowButton("num" + e.key);
        } else if (e.key in OP_KEYS) {
            unglowButton(OP_KEYS[e.key]);
        } else if (EQUAL_KEYS.includes(e.key)) {
            unglowButton("equal");
        } else if (BACKSPACE_KEYS.includes(e.key)) {
            unglowButton("backspace");
        } else if (POINT_KEYS.includes(e.key)) {
            unglowButton("point");
        }
    }
);


clear();
updateDisplay();


function setState(newState) {
    state = newState;
    switch (state) {
        case INITIAL:
            endInputFraction();
            disableBackspace();
            return;
        case NUM1_INPUTTING:
            enableBackspace();
            return;
        case NUM2_INPUTTING:
            enableBackspace();
            return;
        case OP_INPUTTING:
            endInputFraction();
            disableBackspace();
            return;
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


function inputOperator(input) {
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


function inputSign() {
    switch (state) {
        case INITIAL:
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


function updateDisplay() {
    const display = document.querySelector("#display");
    display.textContent = displayString;
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => button.blur());
}


function enableBackspace() {
    const backspaceButton = document.querySelector("#backspace");
    backspaceButton.disabled = false;
}


function disableBackspace() {
    const backspaceButton = document.querySelector("#backspace");
    backspaceButton.disabled = true;
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


function glowButton(id) {
    const target = document.querySelector("#" + id);
    if (target.disabled) {
        return;
    }
    target.classList.add("glowing");
    const glowClass = Array.from(target.classList).find(x=>x.startsWith("glow-"));
    if (glowClass) {
        target.classList.add(glowClass.replace("glow", "glowing"));
    }
}


function unglowButton(id){
    const target = document.querySelector("#" + id);
    if (target.disabled) {
        return;
    }
    target.classList.remove("glowing");
    const glowingClass = Array.from(target.classList).find(x=>x.startsWith("glowing-"));
    if (glowingClass) {
        target.classList.remove(glowingClass);
    } 
}


function getDisplayStringLength(){
    return displayString.replace(/[.-]/g, "").length;
}


function getResultString(num){
    if (Number.isNaN(num)) {
        return "undefined @_@";
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
        const nonFractionDigit = (split[0] + "e" + split[2]).length;
        const fractionDigit = MAX_DIGIT - nonFractionDigit;
        return num.toExponential(fractionDigit);
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