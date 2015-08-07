var click = require('./games/game-click')
var keyboard = require('./games/game-keyboard')
var question_factory = require('./games/game-question');
var mole = require('./games/game-mole');
var end = require('./games/game-end');


var morse_html = '<h4>Can you answer the following?</h4><br><div><audio src="/mp3/morse.mp3" preload="auto"/></audio></div><br>';
var hidden_html = '<h4>What\'s inside this image (no caps)?</h4><br><div><a href="/img/image.jpg"><img src="/img/image.jpg" style="width:200px;"></a><br>';
var morse_question = question_factory(morse_html,"#YouF4undM3");
var hidden_question = question_factory(hidden_html,"lobster");

games = [keyboard, end]
module.exports = games
