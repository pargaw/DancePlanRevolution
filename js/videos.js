var task = "videos";

var addNew = $('#addNew')[0];
addNew.innerHTML='Add New Video';

mouse.on('click', '#buttonAdd'){
	var div = $('body');
	var myDropzone = new Dropzone("div#myId", { url: "/file/post"});
}