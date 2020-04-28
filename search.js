var paragraphs;

// Send message to content script
function sendMsg(tabs) {
  let tab = tabs[0];
  let msg = {
    content: "user clicked!",
  };

  chrome.tabs.sendMessage(tab.id, msg);
  console.log("Message sent to content script");
}

function keyUp(event) {
  if (event.keyCode == 13) {
    setContent(event);
  }
}

function makeCard(text) {
  let card = document.createElement("div");
  card.className = "card";
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";

  let p = document.createElement("p");
  p.innerText = text;
  cardBody.appendChild(p);
  card.appendChild(cardBody);
  return card;
}

function setContent(event) {
  event.preventDefault();
  let question = document.querySelector("#searchInput").value;
  document.querySelector("#msg").innerHTML = question;

  // TODO: Get paragraphs from content.js
  // TODO: Format model input to "question: quest context: ...."
  // TODO: Return generated answers to this array
  let bgpage = chrome.extension.getBackgroundPage();
  paragraphs = bgpage.paragraphs;
  let answers = paragraphs;

  let divAnswers = document.querySelector("#answers");
  // Remove old answers
  while (divAnswers.firstChild) {
    divAnswers.removeChild(divAnswers.firstChild);
  }
  // Add new answers
  for (answer of answers) {
    let card = makeCard(question + " " + answer);
    divAnswers.appendChild(card);
  }
}

function onLoad() {
  document.querySelector("#searchButton").addEventListener("click", setContent);
  document.querySelector("#searchInput").addEventListener("keyup", keyUp);

  // Query active tab
  let params = { active: true, currentWindow: true };
  chrome.tabs.query(params, sendMsg);
}

document.addEventListener("DOMContentLoaded", onLoad);
