//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);

// SAMPLE DATA
Dropzone.autoDiscover = false;

// Putting a <button> element in the dropzone message which can be targeted by the keyboard.
// Note: Clicking the dropzone area or the button will trigger the file browser.
var myDropzone = new Dropzone('#my-awesome-dropzone', { 
	dictDefaultMessage: "Drop files here or <button type='button'>select</button> to upload."
});
