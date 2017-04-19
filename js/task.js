// This will be the control page for determining which content is displayed.
//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);


// SAMPLE DATA

// GLOBALS
var TASKS = ["attendance", "videos", "announcements"]
var currentTask = 2; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroup = "Twinkle Toes";
// var currentDanceGroup; // TODO delete line above + uncomment this when done

// TODO every time new dance group is chosen on main page,
// update currentDanceGroup and localStorage accordingly
localStorage.clear();
localStorage.setItem("currentDanceGroup", currentDanceGroup);
// console.log(localStorage);


$(document).ready(function() {      
	// TODO must ensure that carousel is always non-moving, unless 
	// arrow is clicked by user. But even after that, it should be
	// stationary until the next click.
	$("#myCarousel").carousel({
	    pause: true,
	    interval: false
	});

	initializePage();
});

function initializePage() { 	
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
	var newTaskButton = $('.new_task');
	if (currentTask == 0) { 
		newTaskButton.find('p').text('Add new member for today');
	} else if (currentTask == 1) {
		newTaskButton.find('p').text('Add new video');
	} else if (currentTask == 2) {
		newTaskButton.find('p').text('Add new announcement');
	}	
}

// Attendance
// var members = ['beth','rob','stef','david']
// var table = $('#myTable');
// console.log($(this));
// var row = table.insertRow(0);
// members.forEach(function(value){
//   console.log(members);
//   var cell1 = row.insertCell(0);
//   var cell2 = row.insertCell(1);
//   cell1.innerHTML = "hi";
// });

//Videos
function addButtonsUpdate(){
	var newTaskButton = $('.new_task');
	if (currentTask == 1) {
	
	} 
}

//Announcements
var ANNOUNCEMENTS = {
	"0" : {
		"date": "2017-02-03T00:00:00.000Z", 
		"message": "First post of the semester - welcome! :)"
	},

	"1" : {
		"date": "2017-02-09T00:00:00.000Z", 
		"message": "Office hours tomorrow are cancelled."
	}
};

console.log(ANNOUNCEMENTS);

function createNewAnnouncement() {
	// var para = document.createElement("p");
	// var node = document.createTextNode("This is new.");
	// para.appendChild(node);
	// element.appendChild(para);

	var dateHeader = document.getElementById("dateHeader");

	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();
	document.getElementById("dateHeader").innerHTML = m + "/" + d + "/" + y;
}
