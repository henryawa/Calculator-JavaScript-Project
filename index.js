const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".keys");
const displayNum = calculator.querySelector(".display-num");
const clearKey = calculator.querySelector("#clearKey");
const numKeys = calculator.querySelectorAll(".num-key");
const operatorKeys = calculator.querySelectorAll(".operator-key");

const add = (x, y) => {
  return x + y;
};

const subtract = (x, y) => {
  return x - y;
};

const divide = (x, y) => {
  return x / y;
};

const multiply = (x, y) => {
  return x * y;
};

const operate = (firstNum, operator, secondNum) => {
  firstNum = parseFloat(firstNum);
  secondNum = parseFloat(secondNum);

  switch (operator) {
    case "add":
      return add(firstNum, secondNum);
      break;

    case "subtract":
      return subtract(firstNum, secondNum);
      break;

    case "divide":
      return divide(firstNum, secondNum);
      break;

    case "multiply":
      return multiply(firstNum, secondNum);
      break;

    default:
      break;
  }
};

keys.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const key = e.target;
    const action = key.dataset.action;
    const keyValue = key.textContent;
    const displayNumValue = displayNum.textContent;

    const previousKeyType = calculator.dataset.previousKeyType;

    operatorKeys.forEach((operatorKey) => {
      operatorKey.classList.remove("clicked");
    });

    if (!action) {
      if (displayNumValue === "0" || previousKeyType === "operator") {
        displayNum.textContent = keyValue;
        clearKey.textContent = "C";
      } else {
        displayNum.textContent = displayNumValue + keyValue;
      }
      calculator.dataset.previousKeyType = "number";
    }

    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {
      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayNumValue;
      if (
        firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "calculate" &&
        previousKeyType !== "plusOrMinus"
      ) {
        const rhs = operate(firstValue, operator, secondValue);
        if (rhs.toString().length > 8) {
          rhs = rhs.toExponential(2);
        }
        displayNum.textContent = rhs;
        calculator.dataset.firstValue = rhs;
      } else {
        calculator.dataset.firstValue = displayNumValue;
      }

      key.classList.add("clicked");
      calculator.dataset.previousKeyType = "operator";
      calculator.dataset.operator = action;
    }

    if (action === "plusOrMinus") {
      if (displayNumValue.charAt(0) !== "-") {
        displayNum.textContent = "-" + displayNumValue;
      } else {
        displayNum.textContent = displayNumValue.substring(1);
      }
      calculator.dataset.previousKeyType = "plusOrMinus";
    }

    if (action === "percentage") {
      let firstValue = displayNumValue;
      let secondValue = "100";
      let operator = "divide";
      let rhs = operate(firstValue, operator, secondValue);
      if (rhs.toString().length > 8) {
        rhs = rhs.toExponential(2);
      }
      displayNum.textContent = rhs;
      calculator.dataset.previousKeyType = "percentage";
    }

    if (action === "decimal" && !displayNum.textContent.includes(".")) {
      if (previousKeyType === "operator" || previousKeyType === "calculate") {
        displayNum.textContent = "0.";
      } else {
        displayNum.textContent = displayNumValue + ".";
      }
      calculator.dataset.previousKeyType = "decimal";
    }

    if (action === "clear") {
      if (key.textContent === "AC") {
        calculator.dataset.firstValue = "";
        calculator.dataset.modValue = "";
        calculator.dataset.operator = "";
        calculator.dataset.previousKeyType = "";
      } else {
        clearKey.textContent = "AC";
      }

      displayNum.textContent = "0";
      calculator.dataset.previousKeyType = "clear";
    }

    if (action === "backspace") {
      if (displayNumValue.toString().length > 1) {
        displayNum.textContent = displayNumValue.slice(0, -1);
      } else {
        displayNum.textContent = "0";
      }
    }

    if (action === "calculate") {
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayNumValue;

      if (firstValue) {
        if (previousKeyType === "calculate") {
          firstValue = displayNumValue;
          secondValue = calculator.dataset.modifierValue;
        }
        let rhs = operate(firstValue, operator, secondValue);
        if (rhs.toString().length > 8) {
          rhs = rhs.toExponential(2);
        }
        displayNum.textContent = rhs;
      }

      calculator.dataset.modifierValue = secondValue;
      calculator.dataset.previousKeyType = "calculate";
    }
  }
});
