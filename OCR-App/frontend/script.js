var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const filter = document.getElementById("the-filter");
var result = document.getElementById("result");
const video = document.getElementById("user-video");

const loadVideo = async () => {
  const video = document.getElementById("user-video");
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.style.width = "500px";
  video.style.height = "500px";

  const facingMode = "user";
  const constraints = {
    audio: false,
    video: {
      facingMode,
    },
  };
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
  });
};

const takeSnapshot = () => {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, 540, 380);
  image = canvas.toDataURL("image/png");
  context.src = image;
  const myImage = new Image(image);
  recognizeText(image);
};

const recognizeText = (myImage) => {
  const { createWorker } = Tesseract;
  (async () => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("deu");
    await worker.initialize("deu");
    const {
      data: { text },
    } = await worker.recognize(myImage);
    console.log(text);
    filter.value = text;
    levin(text);
    await worker.terminate();
  })();
};

const levenshteinDistance = (str1 = "", str2 = "") => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

function levin(text) {
  var lsv = [];

  //Change to getting the list from the crawler
  var lse = [
    "Agnes Tremmel",
    "Nicole Koschate-Fischer",
    "Andreas Falke",
    "Beate Bäumler",
  ];

  for (i = 0; i < lse.length; i++) {
    lsv.push(levenshteinDistance(text, lse[i]));
    console.log(i + ": " + lsv[i]);
  }

  const min = Math.min(...lsv);

  if (min > 15) {
    filter.value = "Too inaccurate try again!";
  } else {
    console.log("Mininum Score: " + min);
    const index = lsv.indexOf(min);
    console.log("Index of the best fitting with lowest score: " + index);
    filter.value = lse[index];
  }
}
