//go to index page when home icon is clicked
function goHome(){
	window.location.href = 'index.html';
}

function goToSettings(){
	window.location.href = 'settings.html';
}

function goToTask(){
	window.location.href = 'task.html'; //change later to respective slide
}

function getTeamName(){
	return localStorage.getItem("currentDanceGroup");
}