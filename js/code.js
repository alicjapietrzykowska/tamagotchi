(function () {
  // default variables
  const DEFAULT_STATISTIC_VALUE = 50;
  const ALERT_STATISTIC_VALUE = 30;
  const DEATH_STATISTIC_VALUE = 0;
  const DECREASE_STATS_INTERVAL = 2000;

  // HTML elements
  const buttonsList = document.querySelector(".buttons");
  const reviveBtn = document.querySelector("#revive");
  const animal = document.querySelector(".animal img");

  //variables for intervals
  let pressCareButtonInterval;
  let changeDefaultIconInterval;
  let decreaseStatsInterval;

  //flags
  let press = false;
  let dead = false;
  let sad = false;

  let eatNotify = false;
  let cureNotify = false;
  let petNotify = false;

  let notifications = [];
  const statistics = {};

  //Initiate Touch Emulator which allows touch events on mobile
  TouchEmulator();

  //update statistics value
  function setStat(name, value) {
    statistics[name] = value;
    document.querySelector(`#${name}`).value = value;
  }

  //run Notification
  function showNotification(need) {
    // show notification only for users who allowed it
    if (Notification.permission !== "granted") return;
    let options = {};
    switch (need) {
      case "eat":
        options = {
          body: "Let me eat!",
          icon: "img/hungry.png",
        };
        eatNotify = new Notification("Tamagotchi says", options);
        notifications.push(eatNotify);
        break;
      case "cure":
        options = {
          body: "I have fever!",
          icon: "img/sick.png",
        };
        cureNotify = new Notification("Tamagotchi says", options);
        notifications.push(cureNotify);
        break;
      case "pet":
        options = {
          body: "Play with me!",
          icon: "img/cry.png",
        };
        petNotify = new Notification("Tamagotchi says", options);
        notifications.push(petNotify);
        break;
      default:
        return;
    }
  }

  //set icon when user isn't doing anything
  function runDefaultMood() {
    //icons in default state
    const waitingIcons = ["hello", "cool", "music", "selfie"];

    if (press || dead || sad) return;
    //draw random milliseconds to show random icons
    const milliseconds = Math.floor((Math.random() * (30 - 5) + 5) * 1000);
    changeDefaultIconInterval = setInterval(function () {
      //get random icon index
      const i = Math.floor(Math.random() * (waitingIcons.length - 0));
      const icon = waitingIcons[i];
      animal.src = `img/${icon}.png`;
    }, milliseconds);
    animal.src = "img/hello.png";
  }

  //decrease statistics in time
  function decreaseStats() {
    decreaseStatsInterval = setInterval(() => {
      Object.entries(statistics).forEach(([name, value]) => {
        value--;
        setStat(name, value);
      });
      checkMood();
    }, DECREASE_STATS_INTERVAL);
  }

  // hide Notification
  function hideAllNotifications() {
    notifications.forEach((notify) => notify.close());
  }

  //restart the game after death
  function revive() {
    dead = false;
    sad = false;
    hideAllNotifications();
    //hide revive button
    reviveBtn.style.display = "none";
    //restart event listeners after death
    document.addEventListener("touchend", stopCare);
    buttonsList.addEventListener("touchstart", takeCare);
    //increase stats to default state
    Object.entries(statistics).forEach(([name]) => {
      statistics[name] = DEFAULT_STATISTIC_VALUE;
      document.getElementById(`${name}`).value = statistics[name];
    });
    //run default functions
    decreaseStats();
    runDefaultMood();
  }

  //turn off the game
  function manageDeath() {
    dead = true;
    //turn off event listeners
    document.removeEventListener("touchend", stopCare);
    buttonsList.removeEventListener("touchstart", takeCare);
    clearInterval(decreaseStatsInterval);
    clearInterval(changeDefaultIconInterval);
    clearInterval(pressCareButtonInterval);
    //change icon
    animal.src = "img/dead.png";
    //show revive button
    reviveBtn.style.display = "block";
    reviveBtn.addEventListener("click", revive);
  }

  function manageSadAnimal(name) {
    switch (name) {
      case "eat": {
        animal.src = "img/hungry.png";
        if (!eatNotify) showNotification(name);
        break;
      }
      case "cure": {
        animal.src = "img/sick.png";
        if (!cureNotify) showNotification(name);
        break;
      }
      case "pet": {
        animal.src = "img/cry.png";
        if (!petNotify) showNotification(name);
        break;
      }
      default: {
        return;
      }
    }
  }

  //check if animal is neglected
  function checkMood() {
    if (press) return;
    sad = false;
    //find smallest value of statistics
    const arr = Object.values(statistics);
    const min = Math.min(...arr);
    Object.entries(statistics).forEach(([name, value]) => {
      const valueAsNumber = Number(value);
      if (valueAsNumber === DEATH_STATISTIC_VALUE) {
        manageDeath();
        return;
      }
      if (valueAsNumber < ALERT_STATISTIC_VALUE && valueAsNumber === min) {
        sad = true;
        clearInterval(changeDefaultIconInterval);
        manageSadAnimal(name);
      }
    });
  }

  //reset state when user released button
  function stopCare() {
    press = false;
    document.activeElement.blur();
    clearInterval(changeDefaultIconInterval);
    clearInterval(pressCareButtonInterval);
    hideAllNotifications();
    checkMood();
    if (!sad) runDefaultMood();
  }

  //change icon depending on the stat
  function setNeedIcon(name) {
    switch (name) {
      case "eat":
        animal.src = "img/eat.png";
        eatNotify = false;
        break;
      case "cure":
        animal.src = "img/shower.png";
        cureNotify = false;
        break;
      case "pet":
        animal.src = "img/laughing.png";
        petNotify = false;
        break;
      default:
        runDefaultMood();
    }
  }

  //increase range value when user push button
  function takeCare(e) {
    const needBtn = e.target;
    //prevent from clicking more than one button at once
    if (press) return;

    //turn off default icons
    clearInterval(changeDefaultIconInterval);

    press = true;
    //repeat function as long as user hold the button
    pressCareButtonInterval = setInterval(function () {
      Object.entries(statistics).forEach(([name, value]) => {
        const maxValue = parseFloat(document.querySelector(`#${name}`).max);
        //find stat of pushed button
        if (name === needBtn.dataset.need) {
          //increase value
          value++;
          if (value > maxValue) return;
          setStat(name, value);
          setNeedIcon(name);
        }
      });
    }, 80);
  }

  function initApp() {
    //set initial statistics
    const stats = document.querySelectorAll(".stats input");
    stats.forEach((stat) => {
      const name = stat.id;
      setStat(name, DEFAULT_STATISTIC_VALUE);
    });

    //run initial functions
    decreaseStats();
    runDefaultMood();
    buttonsList.addEventListener("touchstart", takeCare);
    document.addEventListener("touchend", stopCare);

    //request permission for notifications
    Notification.requestPermission();
  }

  window.addEventListener("load", initApp);
})();
