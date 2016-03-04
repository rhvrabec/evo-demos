(message => {
    $('#hello').text('Found device ' + message)
})('HELLO')

function foo()
{
    var text = $('#hello').text()
    $('#hello').text(text + ' FOOB')
}

foo()

/*
import * as math from "mylib";

console.log("2π = " + math.sum(math.pi, math.pi));
*/
