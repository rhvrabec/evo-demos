(message => {
    $('#hello').text('Found device ' + message)
})('HELLO')

function foo()
{
    var text = $('#hello').text()
    $('#hello').text(text + ' FOOBAR')
}

foo()
