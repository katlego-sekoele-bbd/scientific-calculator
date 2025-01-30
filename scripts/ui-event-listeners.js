import { preValidate, tokenize } from './lexer.js';
import {
    evaluatePostfixTokenExpression,
    infixToPostfix,
} from './parser-evaluator.js';

export function addEventListeners() {
    const buttons = document.querySelectorAll('button');
    const screen = document.getElementById('screen');
    const errorScreen = document.getElementById('error-screen');
    const previousKeys = [];

    for (let button of buttons) {
        switch (button.id) {
            case 'lparen-btn':
                handleKeydownInputInsert(button, screen, '(');
                break;
            case 'rparen-btn':
                handleKeydownInputInsert(button, screen, ')');
                break;
            case 'pow-btn':
                handleKeydownInputInsert(button, screen, '^(');
                break;
            case 'fact-btn':
                handleKeydownInputInsert(button, screen, '!');
                break;
            case 'abs-btn':
                handleKeydownInputInsert(button, screen, 'abs(');
                break;
            case 'sin-btn':
                handleKeydownInputInsert(button, screen, 'sin(');
                break;
            case 'cos-btn':
                handleKeydownInputInsert(button, screen, 'cos(');
                break;
            case 'tan-btn':
                handleKeydownInputInsert(button, screen, 'tan(');
                break;
            case 'log-btn':
                handleKeydownInputInsert(button, screen, 'log(');
                break;
            case 'sec-btn':
                handleKeydownInputInsert(button, screen, 'sec(');
                break;
            case 'csc-btn':
                handleKeydownInputInsert(button, screen, 'csc(');
                break;
            case 'cot-btn':
                handleKeydownInputInsert(button, screen, 'cot(');
                break;
            case 'ln-btn':
                handleKeydownInputInsert(button, screen, 'ln(');
                break;
            case 'sqrt-btn':
                handleKeydownInputInsert(button, screen, 'sqrt(');
                break;
            case 'cbrt-btn':
                handleKeydownInputInsert(button, screen, 'cbrt(');
                break;
            case 'ac-btn':
                button.addEventListener('click', () => {
                    screen.value = screen.value.slice(0, -1);
                });
                break;
            case 'comma-btn':
                handleKeydownInputInsert(button, screen, ',');
                break;
            case 'percent-btn':
                handleKeydownInputInsert(button, screen, '%');
                break;
            case 'divide-btn':
                handleKeydownInputInsert(button, screen, '÷');
                break;
            case 'seven-btn':
                handleKeydownInputInsert(button, screen, '7');
                break;
            case 'eight-btn':
                handleKeydownInputInsert(button, screen, '8');
                break;
            case 'nine-btn':
                handleKeydownInputInsert(button, screen, '9');
                break;
            case 'times-btn':
                handleKeydownInputInsert(button, screen, '×');
                break;
            case 'four-btn':
                handleKeydownInputInsert(button, screen, '4');
                break;
            case 'five-btn':
                handleKeydownInputInsert(button, screen, '5');
                break;
            case 'six-btn':
                handleKeydownInputInsert(button, screen, '6');
                break;
            case 'minus-btn':
                handleKeydownInputInsert(button, screen, '-');
                break;
            case 'one-btn':
                handleKeydownInputInsert(button, screen, '1');
                break;
            case 'two-btn':
                handleKeydownInputInsert(button, screen, '2');
                break;
            case 'three-btn':
                handleKeydownInputInsert(button, screen, '3');
                break;
            case 'plus-btn':
                handleKeydownInputInsert(button, screen, '+');
                break;
            case 'zero-btn':
                handleKeydownInputInsert(button, screen, '0');
                break;
            case 'decimal-btn':
                handleKeydownInputInsert(button, screen, '.');
                break;
            case 'equals-btn':
                button.addEventListener('click', () => {
                    const expression = screen.value
                        .replace('×', '*')
                        .replace('÷', '/');

                    let errorMessage;
                    try {
                        preValidate(expression);
                    } catch (e) {
                        let errorMessage = e;
                        console.log(errorMessage.message);
                    }

                    const tokens = tokenize(expression);
                    const postFixOrder = infixToPostfix(tokens);
                    const resultToken =
                        evaluatePostfixTokenExpression(postFixOrder);
                    screen.value = resultToken.value;
                });
                break;
        }
    }

    console.log(screen);
    console.log(buttons);
}

function handleKeydownInputInsert(button, input, textToInsert) {
    button.addEventListener('click', () => {
        input.value += textToInsert;
    });
}
