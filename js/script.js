const nums = document.querySelectorAll('.calculator__key');
const calculator = document.querySelector('.calculator');
const display = document.querySelector('.calculator__display');

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  if (operator === 'add') {
    return firstNum + secondNum;
  }
  if (operator === 'subtract') {
    return firstNum - secondNum;
  }
  if (operator === 'multiply') {
    return firstNum * secondNum;
  }
  if (operator === 'devide') {
    return firstNum / secondNum;
  }
};

const getKeyType = (key) => {
  const { action } = key.dataset;

  if (!action) return 'number';
  if (action === 'add' || action === 'subtract' || action === 'multiplay' || action === 'divide') return 'operator';
  return action;
};

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key);
  const firstValue = calculator.dataset.firstValue;
  const modValue = calculator.dataset.modValue;
  const operator = key.dataset.action;
  const previousKeyType = calculator.dataset.previousKeyType;
  calculator.dataset.previousKeyType = keyType;

  Array.from(key.parentNode.children).forEach((key) => key.classList.remove('calculator__key_pressed'));

  if (keyType === 'operator') {
    if (operator && displayedNum && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      calculator.dataset.firstValue = calculatedValue;
    } else {
      calculator.dataset.firstValue = displayedNum;
    }

    key.classList.add('calculator__key_pressed');
    calculator.dataset.operator = operator;
  }

  if (keyType === 'clear') {
    if (key.textContent === 'AC') {
      calculator.dataset.firstValue = '';
      calculator.dataset.modValue = '';
      calculator.dataset.operator = '';
      calculator.dataset.previousKeyType = '';
    } else {
      key.textContent = 'AC';
    }
  }

  if (keyType !== 'clear') {
    const clearButton = document.querySelector('[data-action=clear]');
    clearButton.textContent = 'CE';
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' ? modValue : displayedNum;
  }
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const action = key.dataset.action;
  const firstValue = state.firstValue;
  const modValue = state.modValue;
  const operator = state.operator;
  const previousKeyType = state.previousKeyType;

  const keyType = getKeyType(key);

  if (keyType === 'number') {
    return displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate' ? keyContent : displayedNum + keyContent;
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) {
      return displayedNum + '.';
    }
    if (previousKeyType === 'operator' || previousKeyType === 'calculator') {
      return '0.';
    }
    return displayedNum;
  }

  if (keyType === 'operator') {
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;

    if (operator && firstValue && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      return calculate(firstValue, operator, displayedNum);
    } else {
      return displayedNum;
    }
  }

  if (keyType === 'clear') return 0;

  if (keyType === 'calculate') {
    let firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;
    let modValue = calculator.dataset.modValue;

    if (firstValue) {
      return previousKeyType === 'calculate' ? calculate(displayedNum, operator, modValue) : calculate(firstValue, operator, displayedNum);
    } else {
      return displayedNum;
    }
  }
};

for (i = 0; i < nums.length; i++) {
  nums[i].addEventListener('click', function (e) {
    const key = e.target;
    const displayedNum = display.textContent;
    const resultString = createResultString(e.target, displayedNum, calculator.dataset);

    display.textContent = resultString;
    updateCalculatorState(key, calculator, resultString, displayedNum);
  });
}
