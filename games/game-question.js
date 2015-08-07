

module.exports = function(question, answer)
{
	that = {};
	that.static = function()
	{
		var data = {};
		data["html"] = question + '<div class="answer-holder"></div><div id="custom-search-input">\
            <div class="input-group col-md-12">\
                <input type="text" class="form-control input-lg question-input" placeholder="Answer" />\
                <span class="input-group-btn">\
                    <button class="btn btn-info btn-lg question-btn" type="button">\
                        <i class="glyphicon glyphicon-barcode"></i>\
                    </button>\
                </span>\
            </div>\
		<script>audiojs.events.ready(function(){var as = audiojs.createAll();});\
		$(".question-input").keyup(function(e){if(e.keyCode == 13)sendAnswer();});$(document).on("click", ".question-btn", function (e){sendAnswer();});\
		function sendAnswer(){sendToGame($(".question-input").val().trim());$(".question-input").val("");}</script>';
		var dismissable_alert = '"<div class=\'alert alert-warning alert-dismissible\' role=\'alert\'>\
				<button type=\'button\' class=\'close\' data-dismiss=\'alert\' aria-label=\'Close\'><span aria-hidden=\'true\'>&times;</span></button>\
				Nope! <strong>"+data+"</strong> is not the right answer.</div>"'
		data["js"] = 'feed_it = function feed_answer(data){$(".answer-holder").append('+dismissable_alert+');};';
		return data
	}

	that.process_data = function(socket, data)
	{
		if(data != answer)
			return ['A', data];
		return ['S', answer];
	}

	return that;
}