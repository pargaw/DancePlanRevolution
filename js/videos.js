$(document).on('click', '#submitVideo', function(e) {
	var inputURL = $('#videoURL').val();
	console.log(inputURL);
	var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
	var link = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)/;
	if(!re.test(inputURL)){
		$(".help-block with-errors").visibility = "visible";
		console.log("error");
	}
	else{
		var newinput = inputURL.replace(link, 'https://www.youtube.com/embed/' );
		$('#iframeVideo').attr('src', newinput);
		uploadedVideo();
	}
});

function uploadedVideo(){
	var x = $("#doneUpload");
	console.log(x, x.style);
    x.style.visibility = "visible";
    setTimeout(function(){ x.style.visibility = "hidden"; }, 500);
}