var VALID_FILE_EXTS = ['avi', 'mov', 'mp4'];
var selectedFolder = ''; 
var file;
var uploadType = '';
var validURL = '';
var idCount = 0;
var videoName = '';
var folderName = '';
// $('.overlay').hide();

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
    $.get( "getTitle.php", { src: src } )
    .done(function( data ) {
        alert( "Data Loaded: " + data );
    }); 
}


$(document).on('click', '#cancelVideoPost', function(e) {
    $('#newVideo').hide();
    $('#videoNameLabel').empty();
});

$(document).on('click', '#addNewVideo', function(e) {
    $('#uploadOptions').toggle();
    $('#newVideo').hide();
    uploadType = '';
});

$(document).on('click', '#localUpload', function(e) {
    uploadType = 'local';
    $('#uploadOptions').toggle();
    $('#newVideo').show();
    $('#fileUpload').show();
    $('#folderSelection').show();
    $('#videoTextInput').hide();
    $('#videoButtons').show();
});

$(document).on('click', '#urlUpload', function(e) {
    uploadType = 'url';
    $('#uploadOptions').toggle();
    $('#newVideo').show();
    $('#fileUpload').hide();
    $('#folderSelection').show();
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

            // TODO check that selectedFolder name isn't duplicate of existing one
        });
    } else {
        console.log('updated folder?');
        folderName = selectedFolder;
        selectedFolder = '/' + folderName + '/';
    }

    if ((validURL || file) && videoName) { 
        console.log('videoName that unlocks submit button', videoName);
        $("#submitVideo").prop('disabled', false);
    };
});

$(document).on('keyup', '#videoNameInput', function(e) {
    videoName = $(this).val();
    console.log('videoName in keyup', videoName);

    // TODO check that selectedFolder name isn't duplicate of existing one
});

function include(arr, filename) {
    var file_ext = filename.substring(filename.length-3, filename.length);
    var valid_file = arr.indexOf(file_ext) != -1;
    console.log('valid file', valid_file);
    return valid_file;
}

function loadFolderNames() {

    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroup);
    dbFoldersRef.on('value', function(snapshot) {
        var select = document.getElementById('folders');
        select.innerHTML = '';
        var data = snapshot.val();
        var keys = Object.keys(data); 
        var optionDefault = document.createElement('option');
        optionDefault.id = 'defaultOption';
        optionDefault.text = 'Choose a folder';
        select.appendChild(optionDefault);

        //the default option should be the first to come up in the folder dropdown
        keys.forEach(function(key) {
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
                console.log('videoNameLabel', videoNameLabel);
                videoNameLabel.innerHTML = file.name;
                videoName = file.name;

                if (selectedFolder) {
                    $("#submitVideo").prop('disabled', false);

                }
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

function saveVideoToDatabase(dbVideoRef, dbFolderRef, videoName, url) {
    console.log('url, name, folder', url, videoName, folderName);

    var newPostRef = dbVideoRef.push({
        date: getDate(true),
        folder: folderName, 
        name: videoName,
        url: url
    });

    // Get the unique ID generated by a push()
    var postId = newPostRef.key;
    
    // dbFolderRef.push(postId);
    var newFolderKey = dbFolderRef.push().key;
    var update = {};
    update[newFolderKey] = postId; 

    dbFolderRef.update(update).then(function() {
        $('#newFolder').hide();
        resetVideoParams();
        return url;
    });
}

function resetVideoParams() { 
    selectedFolder = ''; 
    file = null;
    uploadType = '';
    validURL = '';
    videoName = '';
    folderName = '';

    $('#videoNameInput').val('');
    console.log($('#videoNameInput').val(), $('#videoNameInput').text, $('#videoNameInput').innerHTML);
}

function postVideo() {
    var dbVideoRef = danceDatabase.ref('videos/' + currentDanceGroup);

    // need id from dbVideoRef 
    var dbFolderRef = danceDatabase.ref('videofolders/' + currentDanceGroup + selectedFolder);


    if (uploadType == 'local') {
        overlayLoad();
        console.log('foldername', selectedFolder);

        console.log('filevideo (possibly changed?) name', videoName);
        var videoName = file.name;

        // var file_ext = name.substring(name.length-4, name.length);

        // if (videoName.substring(videoName.length-4, videoName.length) != file_ext) {
        //     videoName += file_ext;
        // } 

        var folderPath = 'groups/' + currentDanceGroup + selectedFolder;
        var videoPath = folderPath + videoName;

        console.log('folder path', folderPath);
        console.log('video path', videoPath);  
        console.log('videoName', videoName);
        var folderRef = danceStorage.ref(folderPath);
        var videoRef = danceStorage.ref(videoPath);

        // draw thumbnail of video in form
        // var canvas = document.getElementById('thumbnailCanvas');
        // canvas.getContext('2d').drawImage(file, 0, 0, file.videoWidth, file.videoHeight);

        videoRef.put(file).then(function(snapshot) {
            console.log('videoName inside videoRef fn', videoName);
            folderRef.child(videoName).getDownloadURL().then(function(url) {
                console.log('videoName in upload before saveVideoToDatabase', videoName);
                saveVideoToDatabase(dbVideoRef, dbFolderRef, videoName, url);
            }).catch(function(error) {
                console.log('error', error);
            });
        }); 
    } else {
        console.log('videoName in link before saveVideoToDatabase', this.videoName);
        saveVideoToDatabase(dbVideoRef, dbFolderRef, this.videoName, validURL);
    }

}

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).ready(function(evt){
    // as of right now it doesnt yet recognize the autofill properly
    setTimeout(function (evt) {
    if ($('#videoURL:-webkit-autofill').val()) {
        $('#videoURL').val() = $('#videoURL:-webkit-autofill').val();
    }  }, 1);

    $('#videoURL').on('keyup', function(){
        var input = $('#videoURL').val();
        if (checkURLValidity(input)) {
            validURL = input;
            var src = input.replace("https://www.youtube.com/watch?v=", "");
            $("#submitVideo").prop('disabled', false);
            $("#submitVideo").unbind('click').on('click', function(evt){
                var date =  getDate(true);
                addIframeVideo(src, date);
                postVideo();
                $('#videoURL').val("");
                $('#newVideo').hide();
                $('#videoTextInput').hide();
                $('#videoButtons').hide();
            });
        } else {
            $("#submitVideo").prop('disabled', true);
        }
    });

    // $('#videoURL').on('keydown', function(evt){
    //     if(evt.keyCode == 13){
    //         console.log("am i pressing enter?>");
    //         var input = $('#videoURL').val();
    //         if (checkURLValidity(input)) {
    //             validURL = input;
    //             var src = input.replace("https://www.youtube.com/watch?v=", "");
    //             $("#submitVideo").prop('disabled', false);
    //             $("#submitVideo").unbind('click').on('click', function(evt){
    //                 var date = getDate(true);
    //                 addIframeVideo(src, date);
    //                 postVideo();
    //                 $('#videoURL').val("");
    //             });
    //         } else {
    //             $("#submitVideo").prop('disabled', true);
    //         }
    //     }
    // })

    $('.left.carousel-control, .right.carousel-control').on('click', function(evt){
        pauseTheVideos();
    }); 
})

function showVideoToast() {
    var x = document.getElementById("doneUpload");
    x.style.display = "block";
    setTimeout(function() {
        x.style.display = "none";
    }, 3000);
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


function overlayLoad(){
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="img/load.gif">' +
            '</div>';
        $(over).appendTo('body');

        setTimeout(function() {
            $('#overlay').remove();
        }, 1000);

        // hit escape to close the overlay
        // $(document).keyup(function(e) {
        //     if (e.which === 27) {
        //         $('#overlay').remove();
        //     }
        // });
}


