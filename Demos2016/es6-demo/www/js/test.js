

var _mylib = require('mylib');

var math = _interopRequireWildcard(_mylib);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function (message) {
    $('#hello').text('Found device ' + message);
})('HELLO');

function foo() {
    var text = $('#hello').text();
    $('#hello').text(text + ' FOOB');
}

foo();

console.log("2π = " + math.sum(math.pi, math.pi));