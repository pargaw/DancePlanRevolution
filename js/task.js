// This will be the control page for determining which content is displayed.
//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);

// GLOBALS
var TASKS = ["attendance", "videos", "announcements"]
var currentTask = 0; // should be 0, 1, or 2, specifying one of the above tasks

var ANNOUNCEMENTS = {
	"0" : {
		"date": "1980-01-02T00:00:00.000Z", 
		"message": "Sample announcement #0."
	},

	"1" : {
		"date": "1980-01-03T00:00:00.000Z", 
		"message": "Sample announcement #1."
	}
};

var VIDEOS = {
}

console.log(ANNOUNCEMENTS);

function createNewAnnouncement() {
	var para = document.createElement("p");
	var node = document.createTextNode("This is new.");
	para.appendChild(node);
	var element = document.getElementById("div1");
	element.appendChild(para);
}

// if we change currentTask, we change the content displayed by the carousel in task.html
$(document).on('click', '.tasks a', function(e) {
	currentTask = $(this).attr('id');
	updateTaskContent();
});

$(document).on('click', '#addNew', function(e) {
	addButtonsUpdate();
});

function updateTaskContent() {
	var taskCarousel = $('.carousel');
	var newTaskButton = $('.new_task');
	if (currentTask == 0) { 
		newTaskButton.find('p').text('Add new member for today');
	} else if (currentTask == 1) {
		newTaskButton.find('p').text('Upload new video');
	} else if (currentTask == 2) {
		newTaskButton.find('p').text('Add new announcement');
	}	
}

function addButtonsUpdate(){
	var taskCarousel = $('.carousel');
	var newTaskButton = $('.new_task');
	if (currentTask == 0) { 
	} else if (currentTask == 1) {
		var myDropzone = new Dropzone(document.body, 
			{ url: "/file/post"});
		myDropzone.on('addedfile', function(file){
			file.previewElement.querySelector().onclick;
		})
	} else if (currentTask == 2) {
	} 
}