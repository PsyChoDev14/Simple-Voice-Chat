const startButton = document.getElementById('startButton');
const leaveButton = document.getElementById('leaveButton');
const soundBar = document.getElementById('soundBar');
const canvasContext = soundBar.getContext('2d');

let localStream;
let peerConnection;
let audioContext;
let analyser;
let dataArray;
let animationId;

const socket = io('/');

const constraints = {
  audio: true,
  video: false
};

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  leaveButton.disabled = false;

  try {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(localStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);

    drawSoundBar();

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    peerConnection = new RTCPeerConnection(config);

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.ontrack = event => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
});

leaveButton.addEventListener('click', () => {
  leaveButton.disabled = true;
  startButton.disabled = false;

  if (peerConnection) {
    peerConnection.close();
  }
  if (audioContext) {
    audioContext.close();
  }
  cancelAnimationFrame(animationId);
  clearCanvas();

  socket.emit('leave');
});

socket.on('offer', async (offer) => {
  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(config);
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', async (candidate) => {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (e) {
    console.error('Error adding received ice candidate', e);
  }
});

function drawSoundBar() {
  animationId = requestAnimationFrame(drawSoundBar);

  analyser.getByteFrequencyData(dataArray);

  canvasContext.fillStyle = 'rgb(200, 200, 200)';
  canvasContext.fillRect(0, 0, soundBar.width, soundBar.height);

  const barWidth = (soundBar.width / dataArray.length) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    barHeight = dataArray[i];

    canvasContext.fillStyle = 'rgb(177, 52, 235)';
    canvasContext.fillRect(x, soundBar.height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, soundBar.width, soundBar.height);
}
