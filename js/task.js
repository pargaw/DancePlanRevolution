/*
Control page for determining which content is displayed for given task
*/
// GLOBALS
var TASKS = ["Attendance", "Videos", "Announcements"]
var currentTask = 0; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroupID = localStorage.getItem("currentDanceGroupID");
var currentDanceGroup = localStorage.getItem("currentDanceGroup");

// SETUP
function initializePage() {
    // $('.overlay').hide();
    // stop automatic carousel movement 
    $("#myCarousel").carousel({
        pause: true,
        interval: false
    });

    // set dance group
    if (localStorage.currentDanceGroupID != "undefined") {
        this.currentDanceGroupID = localStorage.currentDanceGroupID;
    }


    // set current dance group based on the last one seen
    if (this.currentDanceGroupID) {
        $(".dance-group a").text(this.currentDanceGroup);
    } else {
        $(".dance-group a").text(this.currentDanceGroup);

        // TODO delete line above and uncomment one below when done 
        // $(".dance-group").text("Choose a team below");
    }

    updateTaskPgContent();
    setupMembers();
}

window.onload = initializePage;



// CLICK HANDLERS -->TODO what is this for????
$(document).on('click', '.navbar-brand', function(e) {
    window.location.href = 'index.html';
});

// if we change currentTask, change content displayed by the carousel 
$(document).on('click', '.taskbar a', function(e) {
    currentTask = $(this).attr('id');
    updateTaskPgContent(true);
});

$(document).on('click', '#addNew', function(e) {
    addNewTaskItem();
});


$(document).ready(function() {
    // choose new date for a task
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        showOn: 'both',
        buttonImage: 'img/calendar.png',
        buttonImageOnly: true,  
        onSelect: function(dateText, inst) { 
            var newDate = dateText.replace(/\//g, '-');
            return changeDate(newDate);
        }
    });

    if (currentTask == 0) {
        var dateTooltipText = 'Select date';
    } else {
        var dateTooltipText = 'Filter by date';
    }
    $(".ui-datepicker-trigger").attr("data-toggle","tooltip");
    $(".ui-datepicker-trigger").attr("data-original-title", dateTooltipText);
    $(".ui-datepicker-trigger").attr("title", dateTooltipText);

    $('[data-toggle="tooltip"]').tooltip(); 

});

$()


// use new index of carousel to update page content
$(document).on('slide.bs.carousel', '.carousel', function(e) {
    var slideFrom = $(this).find('.active').index();
    var slideTo = $(e.relatedTarget).index();
    currentTask = slideTo - 2;
    // updateTaskPgContent();
});


// GENERAL TASK MANIPULATION
function addNewTaskItem() {
    if (currentTask == 0) {
        // ???
    } else if (currentTask == 2) {
        createNewAnnouncement();
    }
}

function changeDate(date) { 
    if (currentTask == 0) {
        reloadAttendance(date);
    } else if (currentTask == 1) {
        
    } else {
        displayAllAnnouncements(date);
    }
}

function updateTaskPgContent(indirect) {
    // move to new carousel item if tab, not carousel arrow, was clicked
    if (indirect) {
        $("#myCarousel").carousel(parseInt(currentTask));
    }

    // set page title
    if (currentTask == 0) {
        $(".task-name").text(TASKS[currentTask] + " for " + getDate());
    } else {
        $(".task-name").text(TASKS[currentTask]);
    }

    // activate element in secondary bar
    $(".taskbar li>a").removeClass('active');
    $(".taskbar li>a#" + currentTask).addClass('active');

    var newTaskButton = $('#addNew');
    var newVideoButton = $('#addNewVideo');
    var searchText = $('#searchText')[0];
    var filterByFolder = $('#filterByFolder');
    var resetDateFilter = $('.resetRow');
    var datePicker = $('.ui-datepicker-trigger');

    if (currentTask == 0) {
        $('#addNew').attr('data-original-title', 'Add new member');
        searchText.placeholder = "Search dancers...";
        newVideoButton.hide();
        newTaskButton.show();
        filterByFolder.hide();
        datePicker.show();
        resetDateFilter.hide();
    } else if (currentTask == 1) {
        searchText.placeholder = "Search videos...";
        newVideoButton.show();
        newTaskButton.hide();
        datePicker.hide();
        filterByFolder.show();
        resetDateFilter.hide();
        loadFolderNames();
    } else if (currentTask == 2) {
        displayAllAnnouncements();
        $('#addNew').attr('data-original-title', 'Add new announcement');
        searchText.placeholder = "Search announcements...";
        newVideoButton.hide();
        newTaskButton.show();
        filterByFolder.hide();
        datePicker.show();
    }
}


// UTILITIES
// return date in mm/dd/yy hh:mm starting form
function getDate(time_included, delimiter) {
    var n = new Date(); 
    // 01, 02, 03, ... 29, 30, 31
    var dd = (n.getDate() < 10 ? '0' : '') + n.getDate();
    // 01, 02, 03, ... 10, 11, 12
    var mm = ((n.getMonth() + 1) < 10 ? '0' : '') + (n.getMonth() + 1);
    // 1970, 1971, ... 2015, 2016, ...
    var yy = n.getFullYear();

    // firebase doesn't like keys with slashes,
    // so for attendance, we can save with hyphens instead
    if (delimiter) {
        var date = mm + delimiter + dd + delimiter + yy;
    } else {
        var date = mm + "-" + dd + "-" + yy;
    }


    if (time_included) {
        hr = n.getHours();
        min = n.getMinutes();
        if (hr >= 13) {
            ap = 'pm';
            hr -= 12;
        } else {
            ap = 'am';
        }

        if (min < 10) {
            min = '0' + min;
        }

        var time = " " + hr + ":" + min + ap;
        return date + time;
    };

    return date;
}

// get list of all members across all dance groups
function getMembers(){
    var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    membersRef.on("value", function(snapshot) {
        var members = snapshot.val();
        return members;
    });
}