const micBtn = document.getElementById("micBtn");
const textBox = document.getElementById("textBox");
const statusText = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const wordCount = document.getElementById("wordCount");
const toast = document.getElementById("toast");


/* Speech Recognition */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition = null;
let listening = false;
let finalText = "";


function updateWordCount() {

  const text = textBox.value.trim();

  if (!text) {
    wordCount.innerText = "0 শব্দ";
    return;
  }

  const words = text.split(/\s+/).length;

  wordCount.innerText = words + " শব্দ";
}


if (!SpeechRecognition) {

  statusText.innerText =
    "এই ব্রাউজারে Voice Recognition নেই। Chrome ব্যবহার করুন।";

  micBtn.disabled = true;

} else {

  recognition = new SpeechRecognition();

  /* বাংলা */

  recognition.lang = "bn-BD";

  /* একটানা শুনবে */

  recognition.continuous = true;

  /* কথা বলার সময়ও লেখা দেখাবে */

  recognition.interimResults = true;


  recognition.onstart = function () {

    listening = true;

    micBtn.classList.add("listening");

    micBtn.innerText = "⏹️";

    statusText.innerText =
      "🔴 শুনছি... আব্বু কথা বলুন";

    statusText.classList.add("listening");
  };


  recognition.onresult = function (event) {

    let temporaryText = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      const transcript =
        event.results[i][0].transcript;

      if (event.results[i].isFinal) {

        finalText += transcript + " ";

      } else {

        temporaryText += transcript;

      }

    }


    textBox.value =
      finalText + temporaryText;

    updateWordCount();
  };


  recognition.onerror = function (event) {

    console.log("Speech error:", event.error);

    if (event.error === "not-allowed") {

      statusText.innerText =
        "🎙️ Microphone permission দিন";

    } else if (event.error === "no-speech") {

      statusText.innerText =
        "কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।";

    } else {

      statusText.innerText =
        "সমস্যা হয়েছে: " + event.error;

    }

    stopListening();
  };


  recognition.onend = function () {

    if (listening) {

      try {
        recognition.start();
      } catch (error) {
        stopListening();
      }

    } else {

      stopListening();

    }

  };


  micBtn.addEventListener("click", function () {

    if (!listening) {

      finalText = textBox.value.trim();

      if (finalText) {
        finalText += " ";
      }

      try {

        recognition.start();

      } catch (error) {

        console.log(error);

      }

    } else {

      stopListening();

    }

  });

}


function stopListening() {

  listening = false;

  micBtn.classList.remove("listening");

  micBtn.innerText = "🎙️";

  statusText.classList.remove("listening");

  statusText.innerText =
    "মাইক্রোফোন চালু করতে চাপ দিন";

  if (recognition) {

    try {
      recognition.stop();
    } catch (error) {}

  }

}


/* COPY */

copyBtn.addEventListener("click", async function () {

  const text = textBox.value.trim();

  if (!text) {

    showToast("আগে কিছু কথা বলুন 🙂");

    return;

  }


  try {

    await navigator.clipboard.writeText(text);

    showToast("লেখা কপি হয়েছে ✅");

  } catch (error) {

    textBox.select();

    document.execCommand("copy");

    showToast("লেখা কপি হয়েছে ✅");

  }

});


/* CLEAR */

clearBtn.addEventListener("click", function () {

  stopListening();

  finalText = "";

  textBox.value = "";

  updateWordCount();

  showToast("লেখা মুছে ফেলা হয়েছে");

});


/* MANUAL TYPING */

textBox.addEventListener("input", function () {

  finalText = textBox.value;

  updateWordCount();

});


/* TOAST */

function showToast(message) {

  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(function () {

    toast.classList.remove("show");

  }, 1800);

}


/* Initial */

updateWordCount();
