

(function (message) {
    $('#hello').text('Found device ' + message);
})('HELLO');

function foo() {
    var text = $('#hello').text();
    $('#hello').text(text + ' FOOB');
}

foo();