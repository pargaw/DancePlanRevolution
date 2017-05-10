var VALID_FILE_EXTS = ['avi', 'mov', 'mp4'];
var selectedFolder = ''; 
var file;
var uploadType = '';
var validURL = '';
var idCount = 0;
var videoName = '';
var folderName = '';
var folderIsAlreadyClicked = true;
var numOfFolders = 0;
// $('.overlay').hide();

function checkURLValidity(input){
    var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var reEmbed = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/embed\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    if(re.test(input) || reEmbed.test(input)){return true;}
    else{return false;}
}

$(document).on('click', '#cancelVideoPost', function(e) { 
    hideVideoUploadForm();
});

$(document).on('click',  '#filterByFolder' , function(e){
    displayFolderNames();
    for(i =0; i<= numOfFolders-1;i++){
        $('#folderID'+i).on('click', function(evt){
            var folderName = $(this).text();
            displayAllVideosInFolder(folderName);
            $('#videoFolders').empty();
        })
    }
});

$(document).on('click', '#addNewVideo', function(e) {
    $('#uploadOptions').toggle();
    $('#newVideo').hide();
    uploadType = '';
});

$(document).on('click', '#localUpload', function(e) {
    uploadType = 'local';
    $('#uploadOptions').toggle();
    $('#videoNameInput, #videoURL').hide();
    $('#folderSelection, #fileUpload, #newVideo, #videoButtons').show();

    $('#videoURL').removeAttr('required');
    $('#videoNameInput').removeAttr('required');
    $('#uploadVideoFile').attr('required', '');
});

$(document).on('click', '#urlUpload', function(e) {
    uploadType = 'url';
    $('#uploadOptions').toggle();
    $('#fileUpload').hide();
    $('#folderSelection, #newVideo, #videoNameInput, #videoURL, #videoButtons').show();
    $('#videoURL').focus();

    $('#videoURL').attr('required', '');
    $('#videoNameInput').attr('required', '');
    $('#uploadVideoFile').removeAttr('required');
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

            // TODO check that selectedFolder name isn't duplicate of existing one
        });
    } else {
        folderName = selectedFolder;
        selectedFolder = '/' + folderName + '/';
    }

    if ((validURL || file) && videoName) { 
        $("#submitVideo").prop('disabled', false);
    };
});

$(document).on('keyup', '#videoNameInput', function(e) {
    videoName = $(this).val();

    // TODO check that selectedFolder name isn't duplicate of existing one
});

$(document).on('click','#folderIDadd_new_folder', function(evt){
})

function include(arr, filename) {
    var file_ext = filename.substring(filename.length-3, filename.length);
    var valid_file = arr.indexOf(file_ext) != -1;
    return valid_file;
}

function loadFolderNames() {

    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID);
    dbFoldersRef.on('value', function(snapshot) {
        var select = document.getElementById('folders');
        select.innerHTML = '';
        var data = snapshot.val();
        var optionDefault = document.createElement('option');
        optionDefault.id = 'defaultOption';
        optionDefault.text = 'Choose a folder';
        select.appendChild(optionDefault);

        if (data) {
            var keys = Object.keys(data); 

            //the default option should be the first to come up in the folder dropdown
            keys.forEach(function(key) {
                var option = document.createElement('option');
                option.id = key;
                option.text = key;
                select.appendChild(option);
            })
        }
        
        // let users create a new folder
        var option = document.createElement('option');
        option.id = 'newFolderOption';
        option.text = 'Add a new folder';
        select.appendChild(option);
    });
}

function displayFolderNames(){
    if(!folderIsAlreadyClicked){
        numOfFolders = 0;
        var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID);
        dbFoldersRef.on('value', function(snapshot) {
            var data = snapshot.val();
            console.log(data);
            if (data) {
                var keys = Object.keys(data); 
                var id = 0;
                // addFolderHTML("Add new folder...", "add_new_folder");         
                //the default option should be the first to come up in the folder dropdown
                keys.forEach(function(key) {
                    console.log(key, id);
                    addFolderHTML(key, id);
                    id +=1;
                    numOfFolders+=1;
                }); 
            }
        });
        folderIsAlreadyClicked = true;
    }
    else{
        numOfFolders=0;
        //remove folders?
        $('#videoFolders').empty();
        folderIsAlreadyClicked = false;
    }
}

function displayAllVideosInFolder(foldername){
    console.log(foldername);
    var selectedFolder = '/'+ foldername + '/';
    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID + selectedFolder);
    var dbVideosRef = danceDatabase.ref('/videos/' + currentDanceGroupID);
    dbFoldersRef.on('value', function(snapshot) {
        var data = snapshot.val();
        var keys = Object.keys(data);
        keys.forEach(function(key){
            dbVideosRef.on('value', function(snapshot){
                var dataVideo = snapshot.val();
                var keyVideo = Object.keys(dataVideo);
                keyVideo.forEach(function(key){
                    var date = dataVideo[key].date;  
                    addIframeVideo (dataVideo[key].url, date, foldername);
                })
            })
        })
    })
}

function chooseVideo() {
    var fileTracker = document.getElementById("uploadVideoFile");
    var txt = "";
    var selectErrorMsg = "Please choose a video!";

    if ('files' in fileTracker) {
        if (fileTracker.files.length == 0) {
            // TODO bootstrap validation
            // console.log(selectErrorMsg);
            return;
        } else {
            for (var i = 0; i < fileTracker.files.length; i++) {
                file = fileTracker.files[i];
                // console.log('file', file);

                var videoNameLabel = document.getElementById('videoNameLabel');
                // console.log('videoNameLabel', videoNameLabel);
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
            // console.log(selectErrorMsg);
        } else {
            // TODO bootstrap validation
            // console.log('Uploading from file is not supported by this browser. Please upload from URL instead.')
            // console.log('path of selected file', fileTracker.value);
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

// function deleteVideo(key,folder){

  
//     // $('#myDeleteModal').modal('show');

//     // $('#yesBtn').on('click', function() {

//     //     var vid = danceDatabase.ref('videos/'+currentDanceGroupID).child(key);
//     //     // vid.remove();

//     //     var folder = danceDatabase.ref('videofolders/'+currentDanceGroupID+"/"+folder).child(key);
//     //     // folder.remove();

//     //   // $("#announDiv" + key).fadeOut('slow', function() {
//     //   //   var ref = danceDatabase.ref('announcements/'+currentDanceGroupID).child(key);
//     //   //   ref.remove();
//     //   //   announcementDiv.parentElement.remove();
//     //   // });   
//     //   $('#myModal').modal('hide');
//     // });
        
    
// }

function resetVideoParams() { 
    selectedFolder = ''; 
    file = null;
    uploadType = '';
    validURL = '';
    videoName = '';
    folderName = '';
    $('#videoNameInput').val('');
    hideVideoUploadForm();
}

function hideVideoUploadForm() {
    removeLoadingOverlay();
    $('#newVideo')[0].reset();
    $('#newVideo').hide();
}

function postVideo() { 
    var dbVideoRef = danceDatabase.ref('videos/' + currentDanceGroupID);
    var dbFolderRef = danceDatabase.ref('videofolders/' + currentDanceGroupID + selectedFolder);

    // console.log('file and selectedFolder', this.file, this.selectedFolder);

    if (uploadType == 'local') {
        if (file && selectedFolder) {
            addLoadingOverlay();
            console.log('foldername', selectedFolder);

            console.log('filevideo (possibly changed?) name', videoName);
            var videoName = file.name;
            var folderPath = 'groups/' + currentDanceGroupID + selectedFolder;
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
        } 
        else {
            if (!this.file) {
                $('#fileUpload').effect( "shake" );
            }

            if (!this.selectedFolder) {
                $('#folderSelection').effect( "shake" ); 
            }
        } 
    }
    else if (uploadType == 'url') {
        console.log('url, name, folder', this.validURL, this.videoName, this.selectedFolder);
        
        if (validURL && videoName && selectedFolder) {
            addLoadingOverlay();
            console.log('videoName in link before saveVideoToDatabase', this.videoName);
            saveVideoToDatabase(dbVideoRef, dbFolderRef, this.videoName, validURL);    
        } else {
            if (!this.validURL) {
                $('#videoURL').effect( "shake" );
            }  

            if (!this.videoName) {
                $('#videoNameInput').effect( "shake" );
            }

            if (!this.selectedFolder) {
                $('#folderSelection').effect( "shake" );
            }   
        }
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
                var groupName = "test"; //hardcoded to test for now
                addIframeVideo(src, date, groupName)
                postVideo();
                $('#videoURL').val("");
                $('#newVideo').hide();
                $('#videoButtons').hide();
            });
        } else {
            $("#submitVideo").prop('disabled', true);
        }
    });
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

function createGroupTagForVideo(groupName){
    document.getElementById('groupTag').innerHTML = "<h4> #" + groupName + "</h4>";
}

function addIframeVideo (src,date, groupName) {
    console.log("adding video", src, groupName);
    $('<div class="panel panel-default" id="video'+ src+'"><div class="videoDates" style="position: relative"><h4>'+ date
        +'</h4><img class="deleteVid" src="img/red_trash.png" id="deleteVid"'+ src+'></div>'+'<div class="groupTag" style="position: relative"> <h4>#'+ groupName 
        +'folder </h4></div>' +'<div style="margin:auto" class="embed-responsive embed-responsive-16by9" style="margin-top:30px"> <iframe allowfullscreen id="iframe'+ idCount + '" class="embed-responsive-item" src="https://www.youtube.com/embed/'+
        src+'"></iframe></div></div>').prependTo('#videoDisplay');
    idCount +=1;

    document.getElementById("video"+src).onclick = function() {
        console.log("here to delete "+'videos/'+currentDanceGroupID+" "+src+"\n and "+'videofolders/'+currentDanceGroupID+"/"+groupName);
        $('#myDeleteVidModal').modal('show');

        $('#yesVidBtn').on('click', function() {
          $("#video" + src).fadeOut('slow', function() {
            var vid = danceDatabase.ref('videos/'+currentDanceGroupID).child(src);
            vid.remove();

            var folder = danceDatabase.ref('videofolders/'+currentDanceGroupID+"/"+groupName).child(src);
            folder.remove();
            document.getElementById("video"+src).remove();
          });   
          $('#myDeleteVidModal').modal('hide');
        });
    }
}

function pauseTheVideos(){
    for (i=0; i <= idCount-1; i++){
        $('#iframe'+i).attr('src', $('#iframe'+i).attr('src'));
    }
}

// folder stuff
function addFolderHTML(name, folderId){
    // $('<div class="panel panel-default folder-name" style="margin-top:20px"><div class="row"><h4 class="panel-body" id="folderID' + 
    //     folderId+ '"><span class="glyphicon glyphicon-folder-close" style="margin:auto; margin-right:20px; margin-left: 20px"></span>'+ name 
    //     + '</h4></div></div>').prependTo('#videoFolders');
    $('<div class="panel panel-default folder-name" style="margin-top:20px"> <div class="row"><div class="col-6"><div id="leftDiv"><h4 class="panel-body" id="folderID' + folderId+ '"><span class="glyphicon glyphicon-folder-close" style="margin:auto; margin-right:20px; margin-left: 20px"></span>'+ name 
        + '</h4></div></div><div class="col"><div class="rightDiv"><img id="editBtn" class="editBtn src="img/green_edit.png"><img class="deleteBtn src="img/red_trash.png" class="deleteBtn-KjkaykfGOpbn-rf683r"></div></div></div>').prependTo('#videoFolders');
}

function addLoadingOverlay() {
    $("<div id='loadingOverlay' />").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 100, 
        background: "url(img/load.gif) no-repeat 50% 50%"
    }).appendTo($("#newVideo").css("position", "relative")); 
}

function removeLoadingOverlay(){ 
    $('#loadingOverlay').remove();
}
