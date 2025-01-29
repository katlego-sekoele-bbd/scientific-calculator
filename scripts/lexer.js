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
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
    },
    '-': {
        representation: '-',
        precedence: 9,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
    },
    '/': {
        representation: '/',
        precedence: 10,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
    },
    '*': {
        representation: '*',
        precedence: 10,
        type: TOKEN_TYPES.leftAssociativeBinaryOperator,
    },
    '^': {
        representation: '^',
        precedence: 12,
        type: TOKEN_TYPES.rightAssociativeBinaryOperator,
    },
    '---': {
        representation: '---',
        precedence: 11,
        type: TOKEN_TYPES.prefixUnaryOperator,
    },
    '+++': {
        representation: '+++',
        precedence: 11,
        type: TOKEN_TYPES.prefixUnaryOperator,
    },
    '%': {
        representation: '%',
        precedence: 10,
        type: TOKEN_TYPES.postfixUnaryOperator,
    },
    '!': {
        representation: '!',
        precedence: 11,
        type: TOKEN_TYPES.postfixUnaryOperator,
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
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    cos: {
        representation: 'cos',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    tan: {
        representation: 'tan',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    sec: {
        representation: 'sec',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    cosec: {
        representation: 'cosec',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    cot: {
        representation: 'cot',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    abs: {
        representation: 'abs',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    log: {
        representation: 'log',
        precedence: 13,
        n_operands: 2,
        type: TOKEN_TYPES.function,
    },
    ln: {
        representation: 'ln',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    sqrt: {
        representation: 'sqrt',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
    },
    cbrt: {
        representation: 'cbrt',
        precedence: 13,
        n_operands: 1,
        type: TOKEN_TYPES.function,
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
            const value = Number.parseFloat(substring);
            tokens.push(new Token(TOKEN_DETAILS.number, value));
            index = index + jumpDistance;
        } else if (currentChar.match(/[a-zA-Z]/g)) {
            // function
            const [substring, jumpDistance] = getMatchingString(
                /[a-zA-Z]/g,
                input,
                index
            );
            tokens.push(new Token(TOKEN_DETAILS[substring]));
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
        }
    }

    return tokens;
}
