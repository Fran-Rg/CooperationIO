var socket = io();

function sendMessage()
{
	var msg = $('#chat-input').val().trim();
	if(msg.length > 0)
	{
		var send_msg = "\
			<div class='row msg_container base_sent'> \
				<div class='col-md-10 col-xs-10'>\
					<div class='messages msg_sent'>\
						<p>"+msg+"</p>\
						<time>"+(new Date()).toLocaleString()+"</time>\
					</div>\
				</div>\
				<div class='col-md-2 col-xs-2 avatar'>\
					<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg'\
						 class=' img-responsive '>\
				</div>\
			</div>";
		socket.emit('chat message', msg);
		$('#chat-input').val('');
		$('.msg_container_base').append(send_msg);
		var height = $(".msg_container_base")[0].scrollHeight;
		$(".msg_container_base").scrollTop(height,"slow");
	}
}
$('.chat-input').keyup(function(e){
	if(e.keyCode == 13)
	{
		sendMessage();
	}
});
$(document).on('click', 'chat-btn', function (e) {
    sendMessage();
});

var connected = false;
function connect()
{
	var login = $('.login-input').val().trim();
	console.log("Login:", login)
	if (login != "")
	{
		$('.login-modal').remove();
		socket.emit('init',login);
	}

};
$('.login-input').keyup(function(e){
	if(e.keyCode == 13)
		connect();
});
$(document).on('click', '.login-btn', function (e) {
	connect();
});

var feed_it = null;
socket.on('reload', function(data)
{
	connected = true;
	var new_html = data.html;
	var new_js = data.js
	console.log('received:', data)
	feed_it = null;
	$(".page-include").fadeOut("slow", function()
	{
		$(".page-include").css('visibility','visible');
		$(".page-include").html(new_html);
		$(".page-include").fadeIn("slow");
		eval(new_js);
		$(".alert-holder").html(data['cheater']);
	});
});

socket.on('cheater', function(data)
{
	$(".alert-holder").html(data);
})

socket.on('chat message', function(data)
{
	var received_msg = "\
		<div class='row msg_container base_receive'> \
			<div class='col-md-2 col-xs-2 avatar'>\
				<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg'\
					 class=' img-responsive '>\
			</div>\
			<div class='col-md-10 col-xs-10'>\
				<div class='messages msg_receive'>\
					<p>"+data.msg+"</p>\
					<time>"+(new Date()).toLocaleString()+" - "+data.user+"</time>\
				</div>\
			</div>\
		</div>";
    $('.msg_container_base').append(received_msg);
    $(".msg_container_base").animate({ scrollTop: $(".msg_container_base")[0].scrollHeight }, "slow");
});


socket.on("game_feed", function(data)
{
	if(feed_it != null)
		feed_it(data);
});

function sendToGame(msg)
{
	if(connected)
		socket.emit('game', msg);
}
