
var count = 2000;


function static(){
	var data = {};
	data["html"] = '<h4>Click, click, click!</h4><button type="button" class="btn btn-success btn-lg btn3d game-btn center-block"><span class="glyphicon glyphicon-ok"></span> <span class="game-count">'+count+'</span></button>\
	<script>$(".game-btn").on("click",function(){sendToGame("click");});</script>';
	data["js"] = "feed_it = function tick_count(count){$('.game-count').text(count);};"
	return data
}

function process_data(socket, data)
{
	if (data === 'click')
	{
		console.log("Click left",count)
		--count
		var state = "E"
		if (count === 0)
			state = "S"
		return [state, count];
	}
	return null;
}

module.exports.static = static
module.exports.process_data = process_data
