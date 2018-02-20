const WhitespaceExpression = {
    multiple: / {2}/g,
    leadingOrLone: /^ ((?=\S)|$)/g,
    trailing: / $/g
};

export default  WhitespaceExpression;