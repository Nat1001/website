if (document.cookie != "") {
  let last_timer_duration_ms = getCookie("last_timer_duration");
  if (isNaN(last_timer_duration_ms)) {
    document.getElementById("last_timer_button").classList.add("hidden");
  }
  let last_timer_duration = msToCoundtown(last_timer_duration_ms);
  //Update last timer button
  document.getElementById("last_timer_button").innerHTML =
    "Last timer : " + last_timer_duration;
  //TODO: ajouter la fonction de l'event onclick
  document
    .getElementById("last_timer_button")
    .setAttribute(
      "onclick",
      "startCountDown(" + last_timer_duration_ms / 1000 + ")"
    );
} else {
  document.getElementById("last_timer_button").classList.add("hidden");
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function startCountDown(time) {
  if (time == 0) {
    startButton = document.getElementById("start");
    if (startButton.classList.contains("locked")) {
      return;
    }

    let duration = userDuration();

    open(
      `/countDown/countDown.html?end=${
        Date.now() + duration
      }&start=${Date.now()}`,
      "_self"
    );
  } else {
    open(
      `/countDown/countDown.html?end=${
        Date.now() + time * 1000
      }&start=${Date.now()}`,
      "_self"
    );
  }
}

function editCountDown(buttonPressed, amount) {
  // If button is locked just return
  if (buttonPressed.classList.contains("locked")) {
    return;
  }

  // Calculates maximum value for the selected unit
  let max;
  let unit = buttonPressed.id.split("_")[0];
  switch (unit) {
    case "seconds":
      max = 60;
      break;

    case "minutes":
      max = 60;
      break;

    case "hours":
      max = 24;
      break;

    default:
      max = null;
      break;
  }

  // Calculate the new total duration of the countdown
  let duration = userDuration();
  duration += amount;

  // Converts overflows
  let newDate = textDate(date(duration));
  let countDownInput;
  let units = ["days", "hours", "minutes", "seconds"];
  for (let i = 0; i < units.length; i++) {
    countDownInput = document.getElementById(`${units[i]}_duration`);
    countDownInput.value = newDate[i];
  }

  if (duration < 0) {
    duration = 0;
  }

  // Locks or unlocks buttons
  startButton = document.getElementById("start");

  duration = userDuration();
  if (duration == 0) {
    // Locks start button
    if (!startButton.classList.contains("locked")) {
      startButton.classList.add("locked");
    }
    for (let i = 0; i < units.length; i++) {
      // Locks all down buttons
      let editButton = document.getElementById(`${units[i]}_down`);
      if (!editButton.classList.contains("locked")) {
        editButton.classList.add("locked");
      }
    }
  }

  // Puts all down buttons in an array
  let downButtons = [];
  for (let i = 0; i < 4; i++) {
    downButtons.push(document.getElementById(`${units[i]}_down`));
  }
  if (duration != 0) {
    // Unlocks start button
    if (startButton.classList.contains("locked")) {
      startButton.classList.remove("locked");
    }
    // Unlocks buttons of inferiors units
    for (let i = 0; i < downButtons.length; i++) {
      if (downButtons[downButtons.length - i - 1].id == buttonPressed.id) {
        break;
      }
      if (
        downButtons[downButtons.length - i - 1].classList.contains("locked")
      ) {
        downButtons[downButtons.length - i - 1].classList.remove("locked");
      }
    }
  }

  for (let i = 0; i < units.length; i++) {
    let downButton = document.getElementById(`${units[i]}_down`);
    let value = document.getElementById(
      `${downButton.id.split("_")[0]}_duration`
    ).value;
    if (parseFloat(value) == 0 && !downButton.classList.contains("locked")) {
      for (let i = 0; i < downButtons.length; i++) {
        if (downButtons[i].id == downButton.id) {
          // Locks button if cannot converts from a superior unit
          downButton.classList.add("locked");
          break;
        }
        if (!downButtons[i].classList.contains("locked")) {
          break;
        } // Doesn't lock cause conversion from a superior is possible
      }
    }
    if (parseFloat(value) != 0 && downButton.classList.contains("locked")) {
      downButton.classList.remove("locked");
    } // Unlocks down button
  }
}

function userDuration() {
  let days = parseFloat(document.getElementById("days_duration").value);
  let hours = parseFloat(document.getElementById("hours_duration").value);
  let minutes = parseFloat(document.getElementById("minutes_duration").value);
  let seconds = parseFloat(document.getElementById("seconds_duration").value);

  duration =
    days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;

  return duration;
}

function date(ms) {
  let days = ~~(ms / 86400000);
  ms -= days * 86400000;
  let hours = ~~(ms / 3600000);
  ms -= hours * 3600000;
  let minutes = ~~(ms / 60000);
  ms -= minutes * 60000;
  let seconds = ~~(ms / 1000);

  let duration = [days, hours, minutes, seconds];
  return duration;
}

function textDate(date) {
  let names = ["d", "h", "m", "s"];
  let text = [];
  date.map((x, index) => text.push(`${x}${names[index]}`));
  return text;
}

function msToCoundtown(ms) {
  let days = Math.floor(ms / (1000 * 60 * 60 * 24));
  let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((ms % (1000 * 60)) / 1000);
  let duration = [days, hours, minutes, seconds];

  let names = ["d", "h", "m", "s"];
  let notNull = false;
  for (let i = 0; i < duration.length; i++) {
    const x = duration[i];
    if (x == 0 && names[i] != "s" && notNull == false) {
      continue;
    }
    duration[i] = x + names[i];
    notNull = true;
  }

  return duration.filter((x) => x[0] != 0 && x != 0).join(" ");
}
