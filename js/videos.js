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
		localStorage.setItem('videos', Json.stringify(SAMPLEVIDEOS));
		var template = getVideoTemplate(date, inputURL);
		document.getElementById('display').prepend(template);
	}
	var createdNewIframe = document.createElement('iframe'); //need to add new form
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


// function getVideoTemplate(date, url) { 
// 	var dateDiv = document.createElement("div");
//   	var dateText = document.createElement("h5");	  	
//   	dateText.innerHTML = date;
//   	dateDiv.appendChild(dateText);

// 	var urlDiv = document.createElement("div");
// 	var urlText = document.createTextNode(url); 
//   	msgDiv.appendChild(msgText);

//   	var videoDiv = document.createElement("div");
//   	videoDiv.appendChild(dateDiv);
//   	videoDiv.appendChild(urlDiv);
//   	videoDiv.className = "panel-body";

//   	var panelDiv = document.createElement("div");
//   	panelDiv.className = "panel panel-default";
//   	panelDiv.appendChild(videoDiv);

//   	return panelDiv;
// }


// function displayAllVideos() {
// 	var videoContainer = document.createElement("div");
// 	var videos = JSON.parse(localStorage.getItem('videos'));
// 	if (!videos) {
// 		videos = SAMPLEVIDEOS;
// 	}

// 	for (i = videos.length; i--;) { 
// 		var video = videos[i];
// 		var date = video["date"];
// 		var url = video["url"]; 
// 		console.log(video, date, url);

// 		var template = getVideoTemplate(date, url);
// 	    videoContainer.appendChild(template);
// 	}

// 	document.getElementById('display').appendChild(videoContainer);

// 	if (!localStorage.getItem('videos')) {
// 		localStorage.setItem("videos", JSON.stringify(SAMPLEVIDEOS));
// 	}
// }
