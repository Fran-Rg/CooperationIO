
var CASE = 7;
var WAIT = 3000;
var moles=new Array(CASE)

for (var i = 0 ; i<CASE;++i)
{
	moles[i] = new Array(CASE);
	for (var j = 0; j < CASE; ++j)
		moles[i][j] = Date.now() - WAIT;
}


function generate_moles()
{
	var html = '<div class="mole-container center-block">';
	var now = Date.now();
	for(var i = 0;i<CASE;++i)
	{
		for (var j = 0; j < CASE; ++j)
		{
			html += '<div class="mole-case mole-'+i+'-'+j+'" key="'+i+'.'+j+'"'
			if(now < moles[i][j])
				html += 'style="opacity:0;"';
			html += '><img src="/img/cage.jpg"></div>';
		}
	}
	html +='</div>';

	return html;
}

function static()
{
	var data = {};
	data["html"] = '<h4>Can you click all cages and make them disappear all at the same time?</h4>' + generate_moles();
	data["html"] +='<script>\
		var my_moles=new Array('+CASE+');\
		function init(){\
			for (var i = 0 ; i<'+CASE+';++i)\
			{\
				my_moles[i] = new Array('+CASE+');\
				for (var j = 0; j < '+CASE+'; ++j)\
					my_moles[i][j] = null;\
			}\
			';
	var now = Date.now();
	for(var i = 0;i<CASE;++i)
	{
		for (var j = 0; j < CASE; ++j)
		{
			if(now < moles[i][j])
				data["html"] += 'my_moles['+i+']['+j+'] = setTimeout(function(){$(".mole-'+i+'-'+j+'").css("opacity",1);my_moles['+i+']['+j+']=null;},'+(moles[i][j]-now)+');';
		}
	}
	data["html"] +='\
		};\
		$(".mole-case").click(function()\
		{\
			var mcase = $(this).attr("key").split(".").map(function(c){return parseInt(c);});\
			var i = mcase[0]; var j = mcase[1];\
			if(my_moles[i][j] != null)\
			{\
				clearTimeout(my_moles[i][j]);\
			}\
			else\
				$(".mole-"+i+"-"+j).fadeTo(1000,0);\
			my_moles[i][j] = setTimeout(function(){$(".mole-"+i+"-"+j).css("opacity", 1);my_moles[i][j]=null;},'+WAIT+');\
			sendToGame(mcase);\
		});\
		init();\
		</script>';
	data["js"] = 'feed_it = function(mole_info){\
		var i = mole_info[0]; var j = mole_info[1];\
		if(my_moles[i][j] != null)\
			clearTimeout(my_moles[i][j]);\
		else\
			$(".mole-"+i+"-"+j).fadeTo(1000,0);\
		my_moles[i][j] = setInterval(function(){$(".mole-"+i+"-"+j).css("opacity", 1);},'+WAIT+')\
	};\
	';
	return data;
}

function process_data(socket, mole)
{
	console.log("Received", mole)
	if(mole[0]>=0 && mole[0]<=CASE && mole[1]>=0 && mole[1]<=CASE)
	{
		var now = Date.now();
		moles[mole[0]][mole[1]] = now + WAIT;

		var is_complete = true;
		for(var i=0;i<CASE;++i)
		{
			for (var j=0; j<CASE; ++j)
			{
				if(now > moles[i][j])
				{
					is_complete = false;
					break;
				}
			}
		}
		console.log("Complete?", is_complete)
		if(is_complete)
			return ["S", mole];
		return ["B", mole];
	}
	return ["F", mole];
}

module.exports.static = static
module.exports.process_data = process_data

