// This will be the control page for determining which content is displayed.
//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);


// SAMPLE DATA

// GLOBALS
var TASKS = ["Attendance", "Videos", "Announcements"]
var currentTask = 2; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroup = "Twinkle Toes";
// var currentDanceGroup; // TODO delete line above + uncomment this when done

// TODO every time new dance group is chosen on main page,
// update currentDanceGroup and localStorage accordingly
// localStorage.clear();
localStorage.setItem("currentDanceGroup", currentDanceGroup);
console.log(localStorage);


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
	// set page title
	$(".task-name").text(TASKS[currentTask]);
	console.log($(".task-name").val());

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

	updateTaskContent();
	displayAllAnnouncements();
}


// if we change currentTask, we change the content displayed by the carousel in task.html
$(document).on('click', '.tasks a', function(e) {
	currentTask = $(this).attr('id');
	updateTaskContent();
});

$(".left").click(function(){
    $("#myCarousel").carousel("prev");
});

$(".right").click(function(){
    $("#myCarousel").carousel("next");
});

$(document).on('click', '#myCarousel', function() {
	// subtract 2 b/c we have pg title and add/filter button divs
	// before the main carousel items
    currentTask = $('div.active').index() - 2;
    updateTaskContent();
});

$(document).on('click', '#addNew', function(e) {
	addButtonsUpdate();
});

$(document).on('click', '#cancelButton', function(e) {
	$('#newAnnouncement').hide();
});

$(document).on('click', '#doneButton', function(e) {
	addNewAnnouncement();
});

function updateTaskContent() {  
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

//Announcements
var sampleAnnouncements = [
	{
		"date": "02/03/2017", 
		"msg": "First post of the semester - welcome! :)"
	},

	{
		"date": "02/09/2017", 
		"msg": "Office hours tomorrow are cancelled."
	}
];

function addNewAnnouncement() {
	var msg = $('#announcementInp').val();

	if (msg) { 
		var date = getDate();

		var oldAnnouncements = JSON.parse(localStorage.getItem('announcements'));
		oldAnnouncements.push({"date": date, "msg": msg});

		localStorage.setItem("announcements", JSON.stringify(oldAnnouncements));

		$('#announcementInp').val(null); 
		$('#newAnnouncement').hide();

		var template = getAnnouncementTemplate(date, msg);
		document.getElementById('display').prepend(template);
	} else {
		$("#announcementInp").effect("shake");
	}
}	

function getAnnouncementTemplate(date, msg) { 
	var dateDiv = document.createElement("div");
  	var dateText = document.createElement("h5");	  	
  	dateText.innerHTML = date;
  	dateDiv.appendChild(dateText);

	var msgDiv = document.createElement("div");
	var msgText = document.createTextNode(msg); 
  	msgDiv.appendChild(msgText);

  	var announcementDiv = document.createElement("div");
  	announcementDiv.appendChild(dateDiv);
  	announcementDiv.appendChild(msgDiv);
  	announcementDiv.className = "panel-body";

  	var panelDiv = document.createElement("div");
  	panelDiv.className = "panel panel-default";
  	panelDiv.appendChild(announcementDiv);

  	return panelDiv;
}

function displayAllAnnouncements() {
	var announcementContainer = document.createElement("div");
	var announcements = JSON.parse(localStorage.getItem('announcements'));

	for (i = announcements.length; i--;) { 
		var announcement = announcements[i];
		var date = announcement["date"];
		var msg = announcement["msg"]; 

		var template = getAnnouncementTemplate(date, msg);
	    announcementContainer.appendChild(template);
	}

	document.getElementById('display').appendChild(announcementContainer);
}

function getDate() {
	n =  new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();

	var date = m + "/" + d + "/" + y;
	return date;
}

function createNewAnnouncement() {  
	document.getElementById("dateHeader").innerHTML = "<h4>" + getDate() + "</h4>";
	$('#newAnnouncement').toggle();
}
