
define('moduleC', [
    'moduleA',
    'moduleB'
], function(
    A,
    B
) {
    console.log('require module ' + A + ' and ' + B);
    console.log('moduleC');
    return 'C';
});

