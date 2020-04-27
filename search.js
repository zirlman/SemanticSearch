// The user clicked the button!
function sendMsg(tabs) {
  // 'tab' is an object with information about the current open tab
  let tab = tabs[0];
  let msg = {
    message: "user clicked!",
  };

  chrome.tabs.sendMessage(tab.id, msg);
  console.log("Message sent");
}

function onLoad() {
  const input = document.querySelector(".finder__input");
  const finder = document.querySelector(".finder");
  const form = document.querySelector("form");

  input.addEventListener("focus", () => {
    finder.classList.add("active");
  });

  input.addEventListener("blur", () => {
    if (input.value.length === 0) {
      finder.classList.remove("active");
    }
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    finder.classList.add("processing");
    finder.classList.remove("active");
    input.disabled = true;
    msg.innerHTML = input.value;
    setTimeout(() => {
      finder.classList.remove("processing");
      input.disabled = false;
      if (input.value.length > 0) {
        finder.classList.add("active");
      }
    }, 1000);
  });

  let params = { active: true, currentWindow: true };
  chrome.tabs.query(params, sendMsg);
}

document.addEventListener("DOMContentLoaded", onLoad);
