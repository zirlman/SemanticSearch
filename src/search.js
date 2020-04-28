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

  let divAnswers = document.querySelector("#answers");
  // Remove old answers
  while (divAnswers.firstChild) {
    divAnswers.removeChild(divAnswers.firstChild);
  }
  console.log(paragraphs);
  // Add new answers
  for (let i = 0; i < paragraphs.length; i++) {
    let card = makeCard(question + " " + paragraphs[i]);
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

// -================== TENSORFLOW ==================-

import * as tf from "@tensorflow/tfjs";

// Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
model.fit(xs, ys, { epochs: 10 }).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  model.predict(tf.tensor2d([5], [1, 1])).print();
  // Open the browser devtools to see the output
});

// -================================================-
