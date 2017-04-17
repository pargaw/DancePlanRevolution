function uploadVideo(){
	console.log("entering");
	var div = $('body');
	var myDropzone = new Dropzone("div#myId", { url: "/file/post"});
};