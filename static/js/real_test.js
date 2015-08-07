
$(document).ready(function()
{
	var current_button = null;
	$(document).keydown(function(e)
	{
		if(e.keyCode >= 65 && e.keyCode <= 90)
		{

			var button = ".button_" + String.fromCharCode(e.keyCode);
			if(current_button != button)
			{
				$(current_button).removeClass('buttonDown');
				$(button).addClass('buttonDown');
				current_button = button;
			}
		}
	});

	$(document).keyup(function(e)
	{
		if(e.keyCode >= 65 && e.keyCode <= 90)
		{
			var button = ".button_"+String.fromCharCode(e.keyCode);
			$(button).removeClass('buttonDown');
			current_button = null;
		}
	});

	audiojs.events.ready(function(){var as = audiojs.createAll();});

	$('.mole-case').click(function()
	{
		var that = $(this)
		var mcase = that.attr('key').split('.');
		console.log(mcase);
		that.fadeTo(1000,0,function()
		{
			setTimeout(function()
			{
				that.css('opacity',1);
			},1000)
		})
	});
});

