// This will be the control page for determining which content is displayed.

// GLOBALS
var TASKS = ["attendance", "videos", "announcements"]
var currentTask; // should be 0, 1, or 2, specifying one of the above tasks



// if we change currentTask, we change the content displayed by the carousel in task.html
$(document).on('click', '.tasks a', function(e) {
	currentTask = $(this).attr('id');
	updateTaskContent();
});

function updateTaskContent() {
	var taskCarousel = $('.taskCarousel');
	var newTaskButton = $('.new_task');

	if (currentTask == 0) { 
		newTaskButton.find('p').text('Add member for today');
	} else if (currentTask == 1) {
		newTaskButton.find('p').text('Upload new video');
	} else if (currentTask == 2) {
		newTaskButton.find('p').text('Add new announcement');
	}	
}