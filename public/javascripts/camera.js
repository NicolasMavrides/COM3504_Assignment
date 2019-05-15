// Check that the browser supports GetUserMedia
function hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
}


if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser');
}

var width = 320;
var height= 0;
var video = null;
var canvas = null;
var photo = null;
var button = null;
var localMediaStream = false;

let constraints = {
    audio: false,
    video: true
};

function startUp(){
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    button = document.getElementById('startbutton');

    navigator.getUserMedia(constraints, function(stream) {
        video.srcObject=stream;
        video.play();
    }, errorCallback);

    video.addEventListener('canplay', function(ev){
        if (!localMediaStream) {
            height = video.videoHeight / (video.videoWidth/width);

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            localMediaStream = true;
        }
    }, false);

    button.addEventListener('click', snapshot, false);
}

function snapshot() {
    console.log('click');
    if (localMediaStream) {
        var ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        console.log(canvas.toDataURL('image/png'));
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        document.getElementById('image').value = data;
    }
}

function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}