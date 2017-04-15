// This will be the control page for displaying which 

// GLOBALS
var TASKS = ["attendance", "videos", "announcements"]
var currentTask; // should be 0, 1, or 2, specifying one of the above tasks

// if we change currentTask, we change the content displayed by the carousel in task.html

$(document).on('click', '.tasks a', function(e) {
	currentTask = $(this).attr('id');
	console.log(currentTask);
});


// top bar
var taskCarousel = $('.taskCarousel');
if (currentTask == 0) {
	pass;
} else if (currentTask == 1) {
	pass;
} else if (currentTask == 2) {
	pass;
}

// main content