function sendMsg(tabs) {
  let tab = tabs[0];
  let msg = {
    content: "user clicked!",
  };

  chrome.tabs.sendMessage(tab.id, msg);
  console.log("Message sent");
}

function keyUp(event) {
  if (event.keyCode == 13) {
    setContent(event);
  }
}

function setContent(event) {
  event.preventDefault();
  document.querySelector("#msg").innerHTML = document.querySelector(
    "#searchInput"
  ).value;
}

function onLoad() {
  document.querySelector("#searchButton").addEventListener("click", setContent);
  document.querySelector("#searchInput").addEventListener("keyup", keyUp);

  // Query active tab
  let params = { active: true, currentWindow: true };
  chrome.tabs.query(params, sendMsg);
}

document.addEventListener("DOMContentLoaded", onLoad);
