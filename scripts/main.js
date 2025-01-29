import { TOKEN_DETAILS, tokenize } from './lexer.js';
import { infixToPostfix } from './parser-evaluator.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const sampleExpression1 =
        '( sin(30) + cos(45) - tan(60) ) * abs(-5) ^ 2 / sqrt(25) + ln(2.718) - 4! + sec(60) * csc(30) / cot(45) + (5%) ^ 3 - cbrt(27)';
    const sampleExpression2 = '2 + 5 * 8 + -7';
    const sampleExpression3 = 'sin(2)';
    const sampleExpression4 = '3 + tan ( 5 )';

    const tokens = tokenize(sampleExpression4);
    const postFixOrder = infixToPostfix(tokens);
    console.log(postFixOrder);
});
