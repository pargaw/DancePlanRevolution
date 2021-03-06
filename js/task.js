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
    checkAttendanceTable();
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
        },
        beforeShow: function () { 
            hideAttendanceForm();
            hideAnnouncementForm();
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


// use new index of carousel to update page content
$(document).on('slide.bs.carousel', '.carousel', function(e) {
    var slideFrom = $(this).find('.active').index();
    var slideTo = $(e.relatedTarget).index();
    currentTask = slideTo - 2;
    // updateTaskPgContent();
});


// GENERAL TASK MANIPULATION
function strip_text(text) {
    return text.replace(/^\s+|\s+$/g, '');
}

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
        // displayFolderNames();
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