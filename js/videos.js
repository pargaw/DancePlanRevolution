var SAMPLEVIDEOS = [
	{
		"date": "02/03/2017", 
		"url": "https://www.youtube.com/watch?v=jkGAvU7LJSM"
	}
];	

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).on('click', '.modal-content', function(e){
	var input = $('#videoURL').val();
	var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
	var link = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)/;
	if(re.test(input)){
		$("#submitVideo").removeAttr('disabled')
	}
	else{
		$("#submitVideo").attr('disabled', 'disabled');
	}
})

$(document).on('click', '#submitVideo', function(e) {
	var inputURL = $('#videoURL').val();
	var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
	var link = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)/;
	if(!re.test(inputURL)){
		$("#submitVideo").attr('disabled', 'disabled');
		$("#videoForm").effect("shake");
		$('.modal-content').effect('shake');
		inputCheckFalse();
	}
	else{
		var newinput = inputURL.replace(link, 'https://www.youtube.com/embed/');
		$('#iframeVideo').attr('src', newinput);
		var date = getDate();
		uploadedVideo();
		//{'date': date, 'url' : inputURL}
		// localStorage.setItem('videos', Json.stringify(SAMPLEVIDEOS));
		// var template = getVideoTemplate(date, inputURL);
		// document.getElementById('display').prepend(template);
	}
	// var createdNewIframe = document.createElement('iframe'); //need to add new form
});

// do not work properly as 4/30/17
function uploadedVideo(){
	var x = document.getElementById("doneUpload");
    x.style.visibility = "visible";
    setTimeout(function(){ x.style.visibility = "hidden"; }, 1200);
};

function createNewVideo() {  
	document.getElementById("date").innerHTML = "<h4>" + getDate() + "</h4>";
}


