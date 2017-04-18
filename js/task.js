// This will be the control page for determining which content is displayed.
//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);


// GLOBALS
var TASKS = ["Attendance", "Videos", "Announcements"]
var currentTask = 2; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroup = "Twinkle Toes";
// var currentDanceGroup; // TODO delete line above + uncomment this when done



// SETUP
// TODO every time new dance group is chosen on main page,
// update currentDanceGroup and localStorage accordingly
// localStorage.clear();
localStorage.setItem("currentDanceGroup", currentDanceGroup);
console.log('Local storage content: ', localStorage);

$(document).ready(function() {  
    // stop automatic carousel movement 
	$("#myCarousel").carousel({
	    pause: true,
	    interval: false
	});

	initializePage();
});

function initializePage() { 	
	// set page title
	$(".task-name").text(TASKS[currentTask]);
	console.log($(".task-name").val());

	// set dance group
	if (localStorage.currentDanceGroup != "undefined") {
		this.currentDanceGroup = localStorage.currentDanceGroup;
	}

	console.log(localStorage.currentDanceGroup);

	// set current dance group based on the last one seen
	if (this.currentDanceGroup) {
		$(".dance-group a").text(this.currentDanceGroup);
	} else {		
		$(".dance-group a").text(this.currentDanceGroup);

		// TODO delete line above and uncomment one below when done 
		// $(".dance-group").text("Choose a team below");
	}

	updateTaskPgContent();
	displayAllAnnouncements();
}


// CLICK HANDLERS
// if we change currentTask, we change the content displayed by the carousel 
$(document).on('click', '.tasks a', function(e) {
	currentTask = $(this).attr('id');
	updateTaskPgContent();
});


$(document).on('click', '#myCarousel', function() {
	// subtract 2 b/c we have pg title and add/filter button divs
	// before the main carousel items
    currentTask = $('div.active').index() - 2;
    updateTaskPgContent();
});

$(document).on('click', '#addNew', function(e) {
	e.preventDefault();
	addNewTaskItem();
});


// GENERAL TASK MANIPULATION
function addNewTaskItem(){
	if (currentTask == 0) { 

	} else if (currentTask == 1) {
		var myDropzone = new Dropzone(document.body, 
			{ url: "/file/post"});
		myDropzone.on('addedfile', function(file){
			file.previewElement.querySelector().onclick;
		})
	} else if (currentTask == 2) {
		createNewAnnouncement();
	} 
}	

function updateTaskPgContent() {  
	// move to appropriate carousel item
	$("#myCarousel").carousel(parseInt(currentTask));
	
	// update page title
	$(".task-name").text(TASKS[currentTask]);

	// activate element in secondary bar
	$(".nav-link#" + currentTask).focus();

	var newTaskButton = $('.new_task');

	if (currentTask == 0) { 
		newTaskButton.find('p').text('Add member for today');
	} else if (currentTask == 1) {
		newTaskButton.find('p').text('Add video');
	} else if (currentTask == 2) {
		newTaskButton.find('p').text('Add announcement');
	}	
}


// UTILITIES
// return date in mm/dd/yy string form
function getDate() {
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();

	var date = m + "/" + d + "/" + y;
	return date;
}


