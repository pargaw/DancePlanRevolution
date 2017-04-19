// https://www.sanwebe.com/2013/03/addremove-input-fields-dynamically-with-jquery
$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
    var add_button      = $(".add_field_button"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input class="form-control width-50" type="text" name="mytext[]"/><span class="glyphicon glyphicon-remove remove_field" aria-hidden="true"></span></div>'); //add input box
        }
    });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});

$(document).on('click', '#addNew', function(e) {
	$('#newGroup').toggle();
});

$(document).on('click', '#cancelButton', function(e) {
	$('#newGroup').hide();
});

$(document).on('click', '#doneButton', function(e) {
	addNewGroup();
});

function getGroupTemplate(name) { 
	var groupDiv = document.createElement("div");
	groupDiv.className = "panel panel-default group-name";

  	var groupName = document.createElement("h4");	  	
  	groupName.className = "panel-body";
  	groupName.innerHTML = name;

  	groupDiv.appendChild(groupName);
  	return groupDiv;
}


var sampleGroups = [
	{
		"name": "Kool Kids"
	},

	{
		"name": "Cosmic Chaos"
	},

	{
		"name": "Ultralife"
	},

	{
		"name": "Foo Fite or Flite"
	}
];


$(document).on('keydown', 'input', function(e) {
	if (e.which == 13) {
        e.preventDefault();
    }
});

$(document).on('click', '.group-name h4', function(e) {
	if ($(this).text() == 'Twinkle Toes') {
		window.location.href='task.html';		
	}
});

function addNewGroup() {
	var name = $('#groupInp').val();
	var member = $('.main-member').val();

	if (name && member) { 
		var template = getGroupTemplate(name);
		document.getElementById('groups').prepend(template);

		sampleGroups.push({"name": name});
		localStorage.setItem("groups", JSON.stringify(sampleGroups));

        $('#newGroup').get(0).reset();
		$('#newGroup').toggle();
	} else {
		$("#newGroup").effect( "shake", {direction: 'up'} );
	}
}


function displayAllGroups() {
	var groupContainer = document.getElementById("groups");
	var groups = JSON.parse(localStorage.getItem('groups'));
	if (!groups) {
		groups = sampleGroups;
	}

	for (i = groups.length; i--;) { 
		var group = groups[i];
		var name = group["name"];

		var template = getGroupTemplate(name);
	    groupContainer.appendChild(template);
	}

	if (!localStorage.getItem('groups')) {
		localStorage.setItem("groups", JSON.stringify(sampleGroups));
	}
}

window.onload = displayAllGroups;
