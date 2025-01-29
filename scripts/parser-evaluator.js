import { Token, TOKEN_DETAILS, TOKEN_TYPES, tokenize } from './lexer.js';

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

export function evaluate(postfixExpression) {
    const tokens = tokenize(expression);

    for (const token of tokens) {
    }
}
