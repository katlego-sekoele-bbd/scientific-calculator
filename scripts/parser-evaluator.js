import { Token, TOKEN_DETAILS, TOKEN_TYPES, tokenize } from './lexer.js';

/**
 * Algorithms credit -> http://www.neocomputer.org/projects/lang/infix.html
 */

function handleBinaryOperator(
    operatorStack,
    outputStack,
    associativity,
    currentOperator
) {
    function conditionHelper() {
        let condition;
        if (associativity === 'left') {
            condition =
                operatorStack[operatorStack.length - 1] ===
                    TOKEN_TYPES.openParenthesis &&
                operatorStack[operatorStack.length - 1].precedence >=
                    currentOperator.precedence;
        } else if (associativity === 'right') {
            condition =
                operatorStack[operatorStack.length - 1] ===
                    TOKEN_TYPES.openParenthesis &&
                operatorStack[operatorStack.length - 1].precedence >
                    currentOperator.precedence;
        }

        return condition;
    }

    while (operatorStack.length > 0 && conditionHelper()) {
        const greaterPrecedenceOperator = operatorStack.pop();
        outputStack.push(greaterPrecedenceOperator);
    }
    operatorStack.push(currentOperator);
}

export function infixToPostfix(tokens) {
    const operatorStack = [];
    const functionArgumentsStack = [];
    const outputStack = [];

    for (const token of tokens) {
        if (
            token.type !== TOKEN_TYPES.closeParenthesis &&
            functionArgumentsStack.length > 0 &&
            functionArgumentsStack.at(-1) === 0
        ) {
            functionArgumentsStack[functionArgumentsStack.length - 1]++;
            outputStack.push(token);
        } else if (token.type === TOKEN_TYPES.operand) {
            outputStack.push(token);
        } else if (token.type === TOKEN_TYPES.leftAssociativeBinaryOperator) {
            handleBinaryOperator(operatorStack, outputStack, 'left', token);
        } else if (token.type === TOKEN_TYPES.rightAssociativeBinaryOperator) {
            handleBinaryOperator(operatorStack, outputStack, 'right', token);
        } else if (token.type === TOKEN_TYPES.prefixUnaryOperator) {
            operatorStack.push(token);
        } else if (token.type === TOKEN_TYPES.postfixUnaryOperator) {
            outputStack.push(token);
        } else if (token.type === TOKEN_TYPES.function) {
            operatorStack.push(token);
        } else if (token.type === TOKEN_TYPES.openParenthesis) {
            if (
                operatorStack.at(-1) &&
                operatorStack.at(-1).type === TOKEN_TYPES.function
            ) {
                functionArgumentsStack.push(0);
            }

            operatorStack.push(token);
        } else if (token.type === TOKEN_TYPES.closeParenthesis) {
            while (operatorStack.at(-1).type !== TOKEN_TYPES.openParenthesis) {
                const topOperator = operatorStack.pop();
                outputStack.push(topOperator);
            }
            const _topOpenParenthesis = operatorStack.pop();

            if (
                operatorStack.length > 0 &&
                operatorStack.at(-1).type === TOKEN_TYPES.function
            ) {
                const topArgument = functionArgumentsStack.pop();
                outputStack.push(topArgument);
                const topFunction = operatorStack.pop();
                outputStack.push(topFunction);
            }
        } else if (token.type === TOKEN_TYPES.comma) {
            functionArgumentsStack[functionArgumentsStack.length - 1]++;
            while (operatorStack.at(-1).type !== TOKEN_TYPES.openParenthesis) {
                const topOperator = operatorStack.pop();
                outputStack.push(topOperator);
            }
        }
    }

    while (operatorStack.length > 0) {
        const operator = operatorStack.pop();
        outputStack.push(operator);
    }

    return outputStack;
}

function popN(array, n) {
    const popped = [];
    for (let i = 0; i < n; i++) {
        popped.push(array.pop());
    }
    return popped;
}

export function evaluatePostfixTokenExpression(postfixExpression) {
    const outputStack = [];
    let expectedOperands = 0;
    for (const token of postfixExpression) {
        if (token.type === TOKEN_TYPES.operand) {
            outputStack.push(token);
        } else if (typeof token === 'number') {
            expectedOperands = token;
        } else {
            // assume that this is an operator
            if (
                (expectedOperands && expectedOperands === token.numOperands) ||
                !expectedOperands
            ) {
                const operandTokens = popN(outputStack, token.numOperands);
                const operands = operandTokens.map((token) => token.value);
                const result = token.applyOperator(
                    operandTokens.map((token) => token.value)
                );
                outputStack.push(new Token(TOKEN_DETAILS.number, result));
                expectedOperands = 0;
            }
        }
    }
    return outputStack[0];
}
