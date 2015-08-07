var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var games = require('./games')
var game = games.shift();
var cheater_list = [];
var game_count = 1;


app.use(express.static('static'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res) {
	res.sendFile(__dirname + '/index_test.html');
});

function get_static()
{
	var game_data = game.static();
	var general_html = '<h1>Step '+game_count+'</h1>';
	game_data['html'] = general_html + game_data['html'];
	game_data['cheater'] = '';
	if (cheater_list.length > 0)
		game_data['cheater'] = '<div class="alert alert-danger" role="alert">The last cheater was "'+cheater_list.slice(-1)[0]+' (with IP:'+cheater_list.slice(-1)[1]+'). Shame on him/her!"</div>';
	return game_data;
}

io.on('connection', function(socket)
{
	socket.name = null;
	console.log("New connection from ", socket.request.connection.remoteAddress);
	socket.on('init',function(user)
	{
		if(typeof user === "string" && user != '')
		{
			socket.name = user;
			socket.emit('reload', get_static());
		}
	})

	socket.on('chat message', function(msg)
	{
		if(socket.name != null)
			socket.broadcast.emit('chat message', {'user':socket.name,'msg':msg});
	});

	socket.on('game', function(msg)
	{
		//TODO cheat test
		if(socket.name != null)
		{
			try
			{
				var step_info = game.process_data(socket, msg);
				if (step_info != null)
				{
					switch(step_info[0])
					{
						case 'A'://answer
							if (step_info[1] != null)
								socket.emit('game_feed', step_info[1]);
							break;
						case 'B'://broadcast
							if (step_info[1] != null)
								socket.broadcast.emit('game_feed', step_info[1]);
							break;
						case 'E'://emit
							if (step_info[1] != null)
								io.emit('game_feed', step_info[1]);
							break;
						case 'F'://cheat
							cheater_list.append([socket.name, socket.request.connection.remoteAddress]);
							var cheater = '<div class="alert alert-danger" role="alert">A new cheater:"'+socket.name+' (with IP:'+socket.request.connection.remoteAddress+')! Shame on him/her!"</div>';
							io.emit('cheater', cheater);
							break;
						case 'S'://success, next game
							var next_game = game[0]
							game = games.shift()
							++game_count
							io.emit('reload', get_static());
							break;
						default:
					}
				}
			}
			catch(err)
			{
			    console.error("Error when processing game data", err)
			}
		}
    })
});

http.listen(3000, "0.0.0.0", function()
{
	console.log('listening on *:3000');
});