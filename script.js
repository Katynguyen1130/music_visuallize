const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let audioSource;
let analyser;

// container.addEventListener('click', function() {
//     const audio1= new Audio('snare.mp3');
//     let audioCtx = new AudioContext();
//     audioSource = audioCtx.createMediaElementSource(audio1);
//     analyser = audioCtx.createAnalyser();
//     audioSource.connect(analyser);
//     analyser.connect(audioCtx.destination);
//     analyser.fftSize=64;
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);
//     console.log("buefferlength", bufferLength)

//     const barWidth = canvas.width/bufferLength;
//     let barHeight;
//     let x;

//     function animate () {
//         x =0;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         analyser.getByteFrequencyData(dataArray);
//         for (let i = 0; i< bufferLength ; i++) {

//             barHeight = dataArray[i];
//             ctx.fillStyle = 'white';
//             ctx.fillRect(x, canvas.height-barHeight, barWidth, barHeight);
//             x +=barWidth;
//         }
//         requestAnimationFrame(animate)
//     }
//     animate()

// });

file.addEventListener("change", (event) => {
  const files = event.target.files;
  const audio1 = document.getElementById("audio1");
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  let audioCtx = new AudioContext();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  console.log("buefferlength", bufferLength);

  const barWidth = canvas.width / 2 / bufferLength;
  let barHeight;

  function animate() {
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 1.5;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((i * Math.PI * 6) / bufferLength);

    const red = (i * barHeight) / 20;
    const green = i * 4;
    const blue = barHeight / 2;

    const hue = i * 15;

    ctx.fillStyle = "hsl(" + hue + ",100%, " + barHeight / 4 + "%)";
    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
}
