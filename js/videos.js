var VIDEOS = [];
var FOLDERS = [];
var idCount = 0;
var folderID =0;

function checkURLValidity(input){
    var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var reEmbed = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/embed\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    if(re.test(input) || reEmbed.test(input)){return true;}
    else{return false;}
}

function displayAllVideos(){

}
//not detecting autocomplete at the moment 
//from here: https://stackoverflow.com/questions/14631592/detecting-autofill-on-chrome
function pushVideoToStorage(src, date){
    VIDEOS.push({"src":src, "date": date, "folder": idCount})
}


$(document).on('click', '#addNewVideo', function(e) {
    $('#newVideo').show();
    $('#videoTextInput').show();
    $('#videoButtons').show();
    $('#videoURL').focus();
});

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).ready(function(evt){
    $('#videoTextInput').hide();
    $('#videoButtons').hide();
    displayAllVideos();
    addFolderHTML("ed_sheeran_shape_of_you", "dance1_version1");
    // as of right now it doesnt yet recognize the autofill properly
    setTimeout(function (evt) {
    if ($('#videoURL:-webkit-autofill').val()) {
        $('#videoURL').val() = $('#videoURL:-webkit-autofill').val();
        }  }, 1);


    $('#videoURL').on('keyup', function(){
        var input = $('#videoURL').val();
        if (checkURLValidity(input)) {
            var src = input.replace("https://www.youtube.com/watch?v=", "");
            $("#submitVideo").prop('disabled', false);
            $("#submitVideo").unbind('click').on('click', function(evt){
                var date =  getDate(true);
                addIframeVideo(src, date);
                pushVideoToStorage(src, date);
                $('#videoURL').val("");
                $('#newVideo').hide();
                $('#videoTextInput').hide();
                $('#videoButtons').hide();
            });
        } else {
            $("#submitVideo").prop('disabled', true);
        }
    });

    $('#videoURL').on('keydown', function(evt){
        if(evt.keyCode == 13){
            console.log("am i pressing enter?>");
            var input = $('#videoURL').val();
            if (checkURLValidity(input)) {
                var src = input.replace("https://www.youtube.com/watch?v=", "");
                $("#submitVideo").prop('disabled', false);
                $("#submitVideo").unbind('click').on('click', function(evt){
                    var date = getDate(true);
                    addIframeVideo(src, date);
                    $('#videoURL').val("");
                });
            } else {
                $("#submitVideo").prop('disabled', true);
            }
        }
    })

    $('.left.carousel-control').on('click', function(evt){
        pauseTheVideos();
    });

    $('.right.carousel-control').on('click', function(evt){
        pauseTheVideos();
    });
})

function uploadedVideo() {
    var x = document.getElementById("doneUpload");
    x.style.visibility = "visible";
    setTimeout(function() {
        x.style.visibility = "hidden";
    }, 1200);
};

function createDateForVideo() {
    document.getElementById("date").innerHTML = "<h4>" + getDate() + "</h4>";
}

function addIframeVideo (src,date) {
    console.log("adding video", src);
    $('<div class="panel panel-default"><div class="videoDates" style="position: relative">'+ date
        +'</div><div style="margin:auto" class="embed-responsive embed-responsive-16by9" style="margin-top:30px"> <iframe allowfullscreen id="iframe'+ idCount + '" class="embed-responsive-item" src="https://www.youtube.com/embed/'+
        src+'"></iframe></div></div>').prependTo('#videoDisplay');
    idCount +=1;
}

function makeVideoTemplate(){
}

function pauseTheVideos(){
    for (i=0; i <= idCount-1; i++){
        $('#iframe'+i).attr('src', $('#iframe'+i).attr('src'));
    }
}

// folder stuff
function addFolderHTML(name, folderId){
    $('<div class="panel panel-default folder-name"><div class="row"><h4 class="panel-body" id="' + folderId+ '"><span class="glyphicon glyphicon-folder-close" style="margin:auto; margin-right:20px"></span>'+ name 
        + '</h4></div> <button class="btn btn-primary"></button> </div>').prependTo('#videoFolders');
}
//<button class="editFolderButton" style="width:30px; height:30px"></button> 
