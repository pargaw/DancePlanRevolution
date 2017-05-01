/*
Control page for determining which content is displayed for given task
*/

// GLOBALS
var TASKS = ["Attendance", "Videos", "Announcements"]
var currentTask = 0; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroup = "Twinkle Toes";
// var currentDanceGroup; // TODO delete line above + uncomment this when done

// SETUP
// TODO every time new dance group is chosen on main page,
// update currentDanceGroup and localStorage accordingly
// localStorage.clear();
localStorage.setItem("currentDanceGroup", currentDanceGroup);

function initializePage() { 	
	// stop automatic carousel movement 
	$("#myCarousel").carousel({
	    pause: true,
	    interval: false
	});

	// set page title
	if (currentTask==0){
		$(".task-name").text(TASKS[currentTask]+" for: "+getDate());
	}else{
		$(".task-name").text(TASKS[currentTask]);	
	}

	// set dance group
	if (localStorage.currentDanceGroup != "undefined") {
		this.currentDanceGroup = localStorage.currentDanceGroup;
	}


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
	setupMembers();
}

window.onload = initializePage;



// CLICK HANDLERS
$(document).on('click', '.navbar-brand', function(e) {
	window.location.href='index.html';		
});

// if we change currentTask, change content displayed by the carousel 
$(document).on('click', '.taskbar a', function(e) {
	console.log('taks a');
	currentTask = $(this).attr('id');
	updateTaskPgContent(true);
});

$(document).on('click', '#addNew', function(e) {
	addNewTaskItem();
});

$(document).on('click','#submitVideo', function(e){
  var videoInputURL = $('#videoURL').val();
  var iframe = $('iframe').attr('src', videoInputURL);
})

// use new index of carousel to update page content
$(document).on('slide.bs.carousel', '.carousel', function(e) {
	console.log('caro');
	var slideFrom = $(this).find('.active').index();
	var slideTo = $(e.relatedTarget).index();
	// console.log(slideFrom+' => '+slideTo);
    currentTask = slideTo - 2;
    updateTaskPgContent();
});


// GENERAL TASK MANIPULATION
function addNewTaskItem(){
	if (currentTask == 0) { 
		// ???
	} else if (currentTask == 2) {
		createNewAnnouncement();
	} 
}	

function updateTaskPgContent(indirect) {  
	// move to new carousel item if tab, not carousel arrow, was clicked
	if (indirect) {
	 	$("#myCarousel").carousel(parseInt(currentTask));
	}
	
	// update page title
	if (currentTask == 0){
		$(".task-name").text(TASKS[currentTask] + " for: " + getDate());
	} else {
		$(".task-name").text(TASKS[currentTask]);	
	}

	//set Search textbox text
	var searchTxt = document.getElementById('searchText');
	if (currentTask==0){
		searchText.placeholder = "Search people...";
	} 
	if (currentTask==1){
		searchText.placeholder = "Search video...";
	} 
	if (currentTask==2){
		searchText.placeholder = "Search announcement...";
	}

	// activate element in secondary bar
	$(".taskbar li>a").removeClass('active');
	$(".taskbar li>a#" + currentTask).addClass('active');

	var newTaskButton = $('#addNew');
	var dateButton = $('#dateButton');

	if (currentTask == 0) { 
		$('#addNewVideo').hide();
		$('#addNew').show();
		// newTaskButton.find('p').text('Add member');
		// dateButton.find('p').text('Choose date');
	} else if (currentTask == 1) { 
		console.log(currentTask);
		$('#addNewVideo').show();
		$('#addNew').hide();
		// dateButton.find('p').text('Filter by date');
	} else if (currentTask == 2) {
		console.log(currentTask);
		$('#addNewVideo').hide();
		$('#addNew').show();
		// newTaskButton.find('p').text('Add announcement');
		// dateButton.find('p').text('Filter by date');
	}	
}


// UTILITIES
// return date in mm/dd/yy starting form
function getDate() {
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();

	var date = m + "/" + d + "/" + y;
	return date;
}


