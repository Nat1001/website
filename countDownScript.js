let countDownDate = GetURLParameter("end");
let startedAt = GetURLParameter("start");
let started = false;
let ended = false;

let start = GetURLParameter("start");
let duration = countDownDate - startedAt;
document.cookie =
  "last_timer_duration=" +
  duration +
  ";expires=" +
  `${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}` +
  ";path=/";

setTimeout(() => {}, (countDownDate - Date.now()) % 1000);

countDownElement = document.getElementById("countDown");

let countDown = setInterval(function () {
  document.getElementById("permalink").classList.remove("hidden");

  let now = new Date().getTime();
  let distance = countDownDate - now;

  // Update copyToClipboard button
  if (!navigator.clipboard) {
  } else {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (text != window.location) {
          // Permalink no longer in clipboard
          let permalink = document.getElementById("permalink");
          if (permalink.classList.contains("flash")) {
            permalink.innerHTML =
              "Click to copy your permalink to this countdown";
            permalink.classList.remove("flash");
          } else {
            if (
              permalink.textContent !=
              "Click to copy your permalink to this countdown"
            ) {
              permalink.classList.add("flash");
            }
          }
        }
      })
      .catch((err) => {
        // Can't access to clipboard content, maybe cause tab isn't focused
        // console.error('Failed to read clipboard contents: ', err);
      });
  }

  if (isNaN(distance) || countDownDate < startedAt) {
    clearInterval(countDown);
    countDownElement.innerHTML = "Incorrect date provided";
    document.title = "Incorrect date provided";
  } else {
    if (ended == false) {
      if (distance < 0) {
        // Timer ended
        countDownElement.innerHTML = "Timer ended";
        document.title = "Timer ended";
        //Flash
        countDownElement.classList.add("flash");

        // Bip sound
        if (started == true) {
          let bip = new Audio("./assets/timer_ended_bip_sound.mp3");
          bip.volume = 1;
          bip.play();
        }
        ended = true;
      } else {
        countDownElement.innerHTML = ms(distance);
        document.title = ms(distance);
        started = true;
      }
    }

    // Edit time elapsed
    if (startedAt < Date.now()) {
      elapsed = ms(Date.now() - startedAt);
      document.getElementById(
        "time_elapsed"
      ).innerHTML = `Time elapsed: ${elapsed}`;
      if (Date.now() > countDownDate) {
        countDownElement.innerHTML = `Timer ended +${ms(
          Date.now() - countDownDate
        )}`;
      }
    }
  }
}, 1000);

function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function ms(ms) {
  let days = Math.floor(ms / (1000 * 60 * 60 * 24));
  let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((ms % (1000 * 60)) / 1000);
  let duration = [days, hours, minutes, seconds];

  let date = textDate(duration);
  return date;
}

function textDate(date) {
  let names = ["d", "h", "m", "s"];
  let notNull = false;
  for (let i = 0; i < date.length; i++) {
    const x = date[i];
    if (x == 0 && names[i] != "s" && notNull == false) {
      continue;
    }
    date[i] = x + names[i];
    notNull = true;
  }
  return date.filter((x) => x != 0).join(" ");
}

function copy(text) {
  if (!navigator.clipboard) {
    return err;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Popup "SUCCESSFUL"
    })
    .catch(() => {
      // Fail
    });
}

function copyLink() {
  if (!navigator.clipboard) {
    return err;
  }
  navigator.clipboard
    .writeText(window.location)
    .then(() => {
      // Popup "SUCCESSFUL"
    })
    .catch(() => {
      // Fail
    });
}

function editTemp(text, id, duration, replace) {
  element = document.getElementById(id);
  if (element != null) {
    previous = element.textContent;
    element.classList.add("flash");
    element.innerHTML = text;
    setTimeout(() => {
      element.classList.remove("flash");
      if (replace == true) {
        element.innerHTML = previous;
      }
    }, duration);
  }
}
