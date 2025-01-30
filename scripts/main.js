import { TOKEN_DETAILS, tokenize, preValidate } from './lexer.js';
import {
    evaluatePostfixTokenExpression,
    infixToPostfix,
} from './parser-evaluator.js';

document.addEventListener('DOMContentLoaded', (event) => {
    let expressions = ['3 + 5', '10 - 4', '6 * 7', '20 / 5', '2 ^ 3']; // passed
    expressions = ['---5', '+++5', '50%']; // passed
    expressions = ['5!', '3!', '0!']; // passed
    expressions = ['3 + 4 * 2', '(3 + 4) * 2', '2 ^ (3 + 1)']; // passed
    expressions = ['sin(0)', 'cos(0)', 'tan(0)', 'sin(3.14/2)', 'cos(3.14)']; // passed
    expressions = ['log(8,2)', 'ln(2.71)']; // passed
    expressions = ['sqrt(25)', 'cbrt(27)']; // passed
    expressions = ['log(0, 2)', 'ln(0)']; // passed
    expressions = ['abs(-2)', 'abs(5)', 'abs(4/-2)']; // failed
    expressions = [
        '2 + 3 * 4 - 5 / 2',
        '10 + sqrt(16) * 3 - 5!',
        '(2 ^ 3) + (5 * 4) - sqrt(36)',
        '10 / (2 + 3) + 7 * (2 ^ 3)',
        '(3 + 5)! / (4! * 2!)',
    ]; // failed
    expressions = [
        '(5 + 3) * (10 - 4) / 2',
        '((2 + 3) ^ 2) - ((4 + 1) * 3)',
        '((3! + 4) * (2 ^ 3)) / sqrt(16)',
        'log(1000, 10) + (sqrt(49) * cbrt(27))',
    ]; // failed
    // expressions = ['3 + 5 hello(8)', '10 - 4', '6 * 7', '20 / 5', '2 ^ 3']; // passed

    for (const exp of expressions) {
        preValidate(exp);

        const tokens = tokenize(exp);

        const postFixOrder = infixToPostfix(tokens);
        console.log(postFixOrder);
        const resultToken = evaluatePostfixTokenExpression(postFixOrder);
        console.log(exp, '=', resultToken.value);
    }
});
