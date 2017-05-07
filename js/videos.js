var VIDEOS = [];
var FOLDERS = [];
var idCount = 0;
var folderID =0;

var VALID_FILE_EXTS = ['avi', 'mov', 'mp4']
var selectedFolder = ''; 
var file;

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

$(document).on('change', 'select', function(e) {
    selectedFolder = $(this).val();

    if (selectedFolder == '') {
        // TODO bootstrap validation;
        return;
    } else if (selectedFolder == 'Add a new folder') {
        // TODO add input element to type in
        // replace selectedFolder with whatever user entered if valid, i.e. non repetitive
        $('#newFolder').show();

        $(document).bind('keyup', '#newFolder', function(e) {
            folderName = $('#newFolder').val();
            selectedFolder = '/' + folderName + '/';
            console.log('selectedFolder in keyup', selectedFolder);

            // TODO validation that selectedFolder isn't duplicate name
        });
    } else {
        console.log('updated folder?');
        folderName = selectedFolder;
        selectedFolder = '/' + folderName + '/';
    }
});

function include(arr, filename) {
    var file_ext = filename.substring(filename.length-3, filename.length);
    var valid_file = arr.indexOf(file_ext) != -1;
    console.log('valid file', valid_file);
    return valid_file;
}

// function validType(file) {
//     return file.type
// }

function loadFolderNames() {
    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroup);
    dbFoldersRef.on('value', function(snapshot) {
        var select = document.getElementById('folders');
        select.innerHTML = '';

        var data = snapshot.val();
        var keys = Object.keys(data); 
        console.log(keys);

        keys.forEach(function(key) {
            // console.log(key);
            var option = document.createElement('option');
            option.id = key;
            option.text = key;

            // console.log(option);
            select.appendChild(option);
        })

        // let users create a new folder
        var option = document.createElement('option');
        option.id = 'newFolderOption';
        option.text = 'Add a new folder';
        select.appendChild(option);
    });
}

function chooseVideo() {
    var fileTracker = document.getElementById("uploadFile");
    var txt = "";
    var selectErrorMsg = "Please choose a video!";

    if ('files' in fileTracker) {
        if (fileTracker.files.length == 0) {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
            return;
        } else {
            for (var i = 0; i < fileTracker.files.length; i++) {
                file = fileTracker.files[i];
                console.log('file', file);  

                var videoNameLabel = document.getElementById('videoNameLabel');
                console.log('videoname label', videoNameLabel);
                videoNameLabel.innerHTML = file.name;
            }
        }
    } else {
        if (fileTracker.value == "") {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
        } else {
            // TODO bootstrap validation
            console.log('Uploading from file is not supported by this browser. Please upload from URL instead.')
            console.log('path of selected file', fileTracker.value);
        }
    }
}

function uploadVideoFromFile() {
    console.log('foldername', selectedFolder);

    var name = file.name;
    var folderPath = 'groups/' + currentDanceGroup + selectedFolder;
    var videoPath = folderPath + name;

    var folderRef = danceStorage.ref(folderPath);
    var videoRef = danceStorage.ref(videoPath);
    var dbVideoRef = danceDatabase.ref('videos/' + currentDanceGroup);

    // need id from dbVideoRef 
    var dbFolderRef = danceDatabase.ref('videofolders/' + currentDanceGroup + selectedFolder);

    console.log('file name', name);
    console.log('folder path', folderPath);
    console.log('video path', videoPath);  

    // check for valid file extension and for video name
    // change to validType
    if (include(VALID_FILE_EXTS, name)){ 
        // draw thumbnail of video in form
        // var canvas = document.getElementById('thumbnailCanvas');
        // canvas.getContext('2d').drawImage(file, 0, 0, file.videoWidth, file.videoHeight);

        videoRef.put(file).then(function(snapshot) {
            folderRef.child(name).getDownloadURL().then(function(url) {
                console.log('download url', url);

                var newPostRef = dbVideoRef.push({
                    date: getDate(true),
                    folder: folderName, 
                    name: name,
                    url: url
                });

                // Get the unique ID generated by a push()
                var postId = newPostRef.key;
                
                // dbFolderRef.push(postId);
                var newFolderKey = dbFolderRef.push().key;
                var update = {};
                update[newFolderKey] = postId; 
                dbFolderRef.update(update);

                $('#newFolder').hide();
                // TODO also empty its html

                return url;
            }).catch(function(error) {
                console.log('error', error);
            });
        }); 
    } 
}

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).ready(function(evt){
    $('#videoTextInput').hide();
    $('#videoButtons').hide();
    // displayAllVideos();
    // addFolderHTML("ed_sheeran_shape_of_you", "dance1_version1");
    // $("#dance1_version1").on('click', function(evt){
        //dissapear the folder?
    // });


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


function pauseTheVideos(){
    for (i=0; i <= idCount-1; i++){
        $('#iframe'+i).attr('src', $('#iframe'+i).attr('src'));
    }
}

// folder stuff
function addFolderHTML(name, folderId){
    $('<div class="panel panel-default folder-name"><div class="row"><h4 class="panel-body" id="' + folderId+ '"><span class="glyphicon glyphicon-folder-close" style="margin:auto; margin-right:20px; margin-left: 20px"></span>'+ name 
        + '</h4></div></div>').prependTo('#videoFolders');
}
//<button class="editFolderButton" style="width:30px; height:30px"></button> 
// <button class="btn btn-primary"></button> 

