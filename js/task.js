// This will be the control page for determining which content is displayed.
//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);


// SAMPLE DATA
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

<<<<<<< HEAD
=======
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

>>>>>>> f17cd7f580faca601071012216b8ed5f22be2473
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
	var taskCarousel = $('.carousel')[0];
	if (currentTask == 0) { 
		newTaskButton.find('p').text('Add new member for today');
		// taskCarousel.carousel(0);
		// $('#myCarousel').carousel($('.carousel-indicators li').data('slide-to')+1);
		$('.carousel-indicators li.active').removeClass('active');
        $('#' + PREFIX_ID_PAGINATION + current_id.replace(PREFIX_ID_SLIDESHOW,"")).addClass('active');

		console.log($('.carousel-inner'));
	} else if (currentTask == 1) {
<<<<<<< HEAD
		newTaskButton.find('p').text('Upload new video');
		$('#myCarousel').carousel(1);
=======
		newTaskButton.find('p').text('Add new video');
>>>>>>> f17cd7f580faca601071012216b8ed5f22be2473
	} else if (currentTask == 2) {
		newTaskButton.find('p').text('Add new announcement');
		$('#myCarousel').carousel(2);
	}	
}



// Attendance
var members = ['beth','rob','stef','david']
var t = $('.table');
console.log(t);

// var numrows = Math.ceil(members.length/3.0);
// var counter = 0;
// for(var i = 0; i < numrows; i++){
//   var tr = t.insertRow();
//   for(var j = 0; j < 3; j++){
//       var td = tr.insertCell();

//       //add member image to table
//       var member = document.createElement("IMG");
//       member.setAttribute("src", "img/"+members[counter]+".jpg");
//       counter +=1;

//       //add check mark in the same place
//       var check = document.createElement("IMG");
//       check.setAttribute("src", "img/redCheck.png")
//       check.style.visibility = 'hidden';

//       td.setAttribute("align","center");
//       td.appendChild(member);
//       td.appendChild(check);
//   }
// }
// var div = document.getElementById("attend");
// div.appendChild(t);



//Videos
function addButtonsUpdate(){
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



//Announcements
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


console.log(ANNOUNCEMENTS);

function createNewAnnouncement() {
	var para = document.createElement("p");
	var node = document.createTextNode("This is new.");
	para.appendChild(node);
	var element = document.getElementById("div1");
	element.appendChild(para);
}
