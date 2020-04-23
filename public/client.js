
 // To get video &amp; voice from webca
 // Instantiate PeerConnection
const socket = io('http://localhost:8000/');
socket.on('connect',()=>{
    console.log("connected server");
})

 peer = new PeerConnection(socket);
 // Setup peer methods
 setPeerMethod(peer);
 function setPeerMethod(peer) {
   // On incoming call
   peer.onUserFound = function (messageData) {
     // ...
     // Handle UI for the incoming call
     // ...
     // On call accept
     getUserMedia(chatObject.data.callType, function (stream) {
       peer.toUsername = callerUserId;
       peer.fromUsername = loggedInUser.username;
       peer.addStream(stream);
       peer.sendParticipationRequest(callerUserId);
     });
   };
   // Render media-stream elements for both caller and callee respectively
   peer.onStreamAdded = function (e) {
     var media = e.mediaElement;
     if (chatObject.data.callType == 'video') {
       addVideo(media);
     } else {
       addAudio(media);
     }
   };
   // Remove media-stream elements
   peer.onStreamEnded = function (e) {
     // ...
   };
 };
 function addVideo(video) {
   var video_id = video.getAttribute('id');
   if (video_id == 'selfMedia') {
     $('#selfVideoContainer').append(video);
   } else {
     if (chatObject.data.callTimer == 0) {
       chatObject.data.callTimer = startTimer('callTimer');
       peer.stopBroadcast();
     }
     $('#otherVideoContainer').append(video);
   }
   // Show loading animation.
   var playPromise = video.play();
   if (playPromise !== undefined) {
     playPromise.then(function (_) {
       // Automatic playback started!
       // Show playing UI.
     }).catch(function (error) {
       // Auto-play was prevented
       // Show paused UI.
     });
   }
   scaleVideos();
 };
 function addAudio() {
   // Similar to addVideo()
   // ...
 };

 function getUserMedia(mediaType, callback) {
   var mediaStreamConstraints = {};
   if (mediaType == 'audio') {
     mediaStreamConstraints = {
       audio: {
         echoCancellation: true
       }
     };
     window.mediaType = 'audio';
   } else
     window.mediaType = 'video';
   if (mediaType == 'video') {
     mediaStreamConstraints = {
       audio: {
       echoCancellation: true
       },
       video: {
       optional: [],
       mandatory: {}
       }
     };
   }
   navigator.getUserMedia(mediaStreamConstraints, function (stream) {
     if (peer)
       peer.mediaType = mediaType == 'audio' ? 'audio' : 'video';
     callback(stream);
     var mediaElement = document.createElement(mediaType == 'audio' ? 'audio' : 'video');
     mediaElement.id = 'selfMedia';
     mediaElement.preload = 'none';
     mediaElement[isGecko ? 'mozSrcObject' : 'src'] = isGecko ? stream : (window.URL || window.webkitURL).createObjectURL(stream);
     mediaElement.controls = false;
     mediaElement.muted = true;
     mediaElement.volume = 0;
     peer.onStreamAdded({
       mediaElement: mediaElement,
       username: username,
       stream: stream
     });
   }, function () {
     alert('Could not connect camera!');
   });
 }

function btnClicked(){
    console.log("clcicked")
    getUserMedia('audio',(x)=>{
        console.log('get media');
        console.log(x);
    });
}