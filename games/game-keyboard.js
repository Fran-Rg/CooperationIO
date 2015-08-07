
var keystatus= {}


function init()
{
	var listkeyboard  = "QWER".split('');
//	var listkeyboard  = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
//	var listkeyboard  = "QW".split('');
	listkeyboard.forEach(function(c){keystatus[c] = [];});
	//console.log("Key status init", keystatus);
}

function generate_keyboard()
{
	var html = '<div id="virtualKeyboard"><div id="keyboard" style="bottom: 0px;"><div id="keyboardHeader"></div><div id="keyboardSmallLetter">';
	for(l in keystatus)
	{
		if (keystatus[l].length > 0)
			html +='<div class="button button_'+l+' buttonDown"><div class="key">'+l.toLowerCase()+'</div></div>';
		else
			html +='<div class="button button_'+l+'"><div class="key">'+l.toLowerCase()+'</div></div>';
	}
	html +='</div></div></div>';

	return html;
}

function static()
{
	var data = {};
	data["html"] = '<h4>Can you press all keys at the same time?</h4>' + generate_keyboard();
	data["html"]+='<script>\
		var current_button = null;\
		$(document).keydown(function(e)\
		{\
			if(e.keyCode >= 65 && e.keyCode <= 90)\
			{\
				var letter = String.fromCharCode(e.keyCode).toUpperCase();\
				var button = ".button_" + letter;\
				if(button != current_button)\
				{\
					$(current_button).removeClass("buttonDown");\
					$(button).addClass("buttonDown");\
					socket.emit("game", letter);\
					current_button = button;\
					console.log("New current button", current_button);\
				}\
			}\
		});\
		$(document).keyup(function(e)\
		{\
			if(e.keyCode >= 65 && e.keyCode <= 90)\
			{\
				var letter = String.fromCharCode(e.keyCode).toUpperCase();\
				var button = ".button_" + letter;\
				$(button).removeClass("buttonDown");\
				if(button === current_button)\
				{\
					console.log("Released", current_button);\
					current_button = null;\
					socket.emit("game", null);\
				}\
			}\
		});</script>';
		data["js"] = 'feed_it = function(letters_info){\
			letters_info["+"].forEach(function(c){\
				if(!$(".button_"+c).hasClass("buttonDown"))\
					$(".button_"+c).addClass("buttonDown");\
			});\
			letters_info["-"].forEach(function(c){\
				if($(".button_"+c).hasClass("buttonDown"))\
					$(".button_"+c).removeClass("buttonDown");\
			});\
		};\
	';
	return data;
}

function process_data(socket, letter)
{
	var addr = socket.request.connection.remoteAddress;
	console.log("Newly pressed letter", letter, "for ", addr);
	//find last entry of this socket and remove
	for(l in keystatus)
	{
		var index = keystatus[l].indexOf(addr)
		if ( index >= 0)
			keystatus[l].splice(index,1);

	}

	if (letter != null && keystatus[letter] != undefined && keystatus[letter].indexOf(addr) === -1)
	{ //add new entry of this socket
		keystatus[letter].push(addr);
	}


	//we generate an overview of the whole keyboard at any time
	var generated_map = {'+':[],'-':[]}

	var is_complete = true;
	for(l in keystatus)
	{
		if(keystatus[l].length === 0)
			is_complete = false;
		if(keystatus[l].length === 0)
			generated_map['-'].push(l);
		else
			generated_map['+'].push(l);
	}
	console.log("Complete?", is_complete,"|Generated", generated_map)
	if(is_complete)
		return ["S", generated_map];
	return ["B", generated_map];
}

init();
module.exports.static = static
module.exports.process_data = process_data

