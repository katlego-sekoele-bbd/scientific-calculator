export const TOKEN_TYPES = {
    operand: 'operand',
    leftAssociativeBinaryOperator: 'leftAssociativeBinaryOperator',
    rightAssociativeBinaryOperator: 'rightAssociativeBinaryOperator',
    postfixUnaryOperator: 'postfixUnaryOperator',
    prefixUnaryOperator: 'prefixUnaryOperator',
    function: 'function',
    openParenthesis: 'openParenthesis',
    closeParenthesis: 'closeParenthesis',
    comma: 'comma',
};

export const TOKEN_DETAILS = {
    ',': {
        representation: ',',
        type: TOKEN_TYPES.comma,
    },
    '+': {
        representation: '+',
        precedence: 9,
        numOperands: 2,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
        applyOperator: (operands) => operands[0] + operands[1],
    },
    '-': {
        representation: '-',
        precedence: 9,
        numOperands: 2,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
        applyOperator: (operands) => operands[1] - operands[0],
    },
    '/': {
        representation: '/',
        precedence: 10,
        numOperands: 2,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
        applyOperator: (operands) => operands[1] / operands[0],
    },
    '*': {
        representation: '*',
        precedence: 10,
        numOperands: 2,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
        applyOperator: (operands) => operands[0] * operands[1],
    },
    '^': {
        representation: '^',
        precedence: 12,
        numOperands: 2,
        type: TOKEN_TYPES.rightAssociativeBinaryOperator,
        applyOperator: (operands) => operands[0] ** operands[1],
    },
    '---': {
        representation: '---',
        precedence: 11,
        numOperands: 1,
        type: TOKEN_TYPES.prefixUnaryOperator,
        applyOperator: (operands) => -operands[0],
    },
    '+++': {
        representation: '+++',
        precedence: 11,
        numOperands: 1,
        type: TOKEN_TYPES.prefixUnaryOperator,
        applyOperator: (operands) => +operands[0],
    },
    '%': {
        representation: '%',
        precedence: 10,
        numOperands: 1,
        type: TOKEN_TYPES.postfixUnaryOperator,
        applyOperator: (operands) => operands[0] / 100,
    },
    '!': {
        representation: '!',
        precedence: 11,
        numOperands: 1,
        type: TOKEN_TYPES.postfixUnaryOperator,
        applyOperator: (operands) => {
            let value = 1;
            for (let i = operands[0]; i > 0; i--) {
                value *= i;
            }
            return value;
        },
    },
    number: {
        representation: 'NUMBER',
        precedence: 0,
        type: TOKEN_TYPES.operand,
    },
    '(': {
        representation: '(',
        type: TOKEN_TYPES.openParenthesis,
        precedence: 13,
    },
    ')': {
        representation: ')',
        type: TOKEN_TYPES.closeParenthesis,
        precedence: 13,
    },
    sin: {
        representation: 'sin',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.sin(operands[0]),
    },
    cos: {
        representation: 'cos',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.cos(operands[0]),
    },
    tan: {
        representation: 'tan',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.tan(operands[0]),
    },
    sec: {
        representation: 'sec',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => 1 / Math.cos(operands[0]),
    },
    csc: {
        representation: 'csc',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => 1 / Math.sin(operands[0]),
    },
    cot: {
        representation: 'cot',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) =>
            Math.cos(operands[0]) / Math.sin(operands[0]),
    },
    abs: {
        representation: 'abs',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.abs(operands[0]),
    },
    log: {
        representation: 'log',
        precedence: 13,
        numOperands: 2,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) =>
            Math.log(operands[1]) / Math.log(operands[0]),
    },
    ln: {
        representation: 'ln',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.log(operands[0]),
    },
    sqrt: {
        representation: 'sqrt',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.sqrt(operands[0]),
    },
    cbrt: {
        representation: 'cbrt',
        precedence: 13,
        numOperands: 1,
        type: TOKEN_TYPES.function,
        applyOperator: (operands) => Math.cbrt(operands[0]),
    },
};

export class Token {
    constructor(tokenDetails, value) {
        Object.assign(this, tokenDetails);
        this.value = value;
    }
}

//[] -> single character match
//^ -> negate
//a-z -> range from a to z
//* -> nought or many
//+ -> one or more
//? -> optional
//{n} -> exactly n times
//{n,} -> at least n times
//{x,y} -> between x and y times

export function getMatchingString(regex, text, fromIndex) {
    let buffer = '';
    let index = fromIndex;
    let currentChar = text.at(index);

    while (index < text.length && currentChar.match(regex)) {
        buffer += currentChar;
        currentChar = text.at(++index);
    }
    return [buffer, index - fromIndex - 1];
}

export function preValidate(expression) {
    if (!bracketsAreBalanced(expression))
        throw new SyntaxError(`Parenthesis are mismatched`);
}

function bracketsAreBalanced(expression) {
    const stack = [];
    const characterArray = expression.split('');
    for (let character of characterArray) {
        if (character === '(') {
            stack.push(character);
        } else if (character === ')') {
            const value = stack.pop();
            if (!value) return false;
        }
    }
    if (stack.length > 0) return false;
    else return true;
}

export function tokenize(expression) {
    const input = expression.replace(/\s/g, '');
    const tokens = [];
    let numTokens = 0;

    for (let index = 0; index < input.length; index++) {
        const currentChar = input.at(index);
        if (currentChar.match(/[0-9]/g)) {
            // number
            const [substring, jumpDistance] = getMatchingString(
                /[0-9.]/g,
                input,
                index
            );

            if ((substring.match(/\./g) || []).length > 1) {
                console.log;

                throw new SyntaxError(
                    `Too many decimal points in the number ${substring} at position ${index}`
                );
            } else {
                const value = Number.parseFloat(substring);
                tokens.push(new Token(TOKEN_DETAILS.number, value));
                index = index + jumpDistance;
            }
        } else if (currentChar.match(/[a-zA-Z]/g)) {
            // function
            const [substring, jumpDistance] = getMatchingString(
                /[a-zA-Z]/g,
                input,
                index
            );
            if (TOKEN_DETAILS[substring]) {
                tokens.push(new Token(TOKEN_DETAILS[substring]));
            } else {
                throw new SyntaxError(
                    `Unexpected token ${substring} at position ${index}`
                );
            }
            index = index + jumpDistance;
        } else if (currentChar.match(/[\+-]/g)) {
            // possible unary + or -
            const previousToken = tokens.at(-1);
            const isUnary =
                !previousToken ||
                (previousToken.type !== TOKEN_TYPES.operand &&
                    previousToken.type !== TOKEN_TYPES.closeParenthesis);

            if (isUnary) {
                tokens.push(new Token(TOKEN_DETAILS[currentChar.repeat(3)]));
            } else {
                tokens.push(new Token(TOKEN_DETAILS[currentChar]));
            }
        } else if (currentChar.match(/[\,\+\-\/\*\^\%\!\(\)]/g)) {
            // operator or parenthesis
            tokens.push(new Token(TOKEN_DETAILS[currentChar]));
        } else {
            throw new SyntaxError(
                `Unexpected token ${currentChar} at position ${index}`
            );
        }
    }

    if (
        tokens.at(-1).type !== TOKEN_TYPES.closeParenthesis &&
        tokens.at(-1).type !== TOKEN_TYPES.operand &&
        tokens.at(-1).type !== TOKEN_TYPES.postfixUnaryOperator
    ) {
        throw new SyntaxError(`Expression is incomplete`);
    } else {
        return tokens;
    }
}

export function validateTokens(tokens) {}
