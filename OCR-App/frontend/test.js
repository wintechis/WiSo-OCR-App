//<script>
const { createWorker, createScheduler } = Tesseract;
const scheduler = createScheduler();
const video = document.getElementById("user-video");
const messages = document.getElementById("messages");
let timerId;

const addMessage = (m, bold) => {
  let msg = `<p>${m}</p>`;
  if (bold) {
    msg = `<p class="bold">${m}</p>`;
  }
  messages.innerHTML += msg;
  messages.scrollTop = messages.scrollHeight;
};

const doOCR = async () => {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 360;
  c.getContext("2d").drawImage(video, 0, 0, 640, 360);
  const start = new Date();
  const {
    data: { text },
  } = await scheduler.addJob("recognize", c);
  const end = new Date();
  addMessage(
    `[${start.getMinutes()}:${start.getSeconds()} - ${end.getMinutes()}:${end.getSeconds()}], ${
      (end - start) / 1000
    } s`
  );
  text.split("\n").forEach((line) => {
    addMessage(line);
  });
};
(async () => {
  addMessage("Initializing Tesseract.js");
  for (let i = 0; i < 4; i++) {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("ger");
    await worker.initialize("ger");
    scheduler.addWorker(worker);
  }
  addMessage("Initialized Tesseract.js");
  video.addEventListener("play", () => {
    timerId = setInterval(doOCR, 1000);
  });
  video.addEventListener("pause", () => {
    clearInterval(timerId);
  });
  addMessage("Now you can play the video. :)");
  video.controls = true;
})();

//</script>
