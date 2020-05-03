var paragraphs;

// Send message to content script
function sendMsg(tabs) {
  let tab = tabs[0];
  let msg = {
    content: "user clicked!",
  };

  chrome.tabs.sendMessage(tab.id, msg);
  console.log("[INFO] Message sent to content script");
}

function keyUp(event) {
  if (event.key == "Enter") {
    setContent(event);
  }
}

function removeChildren(root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
}

function makeCard(text) {
  let card = document.createElement("div");
  card.className = "card w-100";
  let cardBody = document.createElement("div");
  cardBody.className = "card-body ";

  let p = document.createElement("p");
  p.innerText = text;
  cardBody.appendChild(p);
  card.appendChild(cardBody);
  return card;
}

function updateAnswers(question, answers) {
  let divAnswers = document.querySelector("#answers");
  // Make answers
  for (let i = 0; i < answers.length; i++) {
    let card = makeCard("- " + answers[i]);
    divAnswers.appendChild(card);
  }
}

const axios = require("axios");

function getAnswers(input, question) {
  const ID = "619202c5";
  const URL = `http://${ID}.ngrok.io/api/t5_model`;
  const data = { input };

  axios
    .post(URL, data)
    .then((response) => {
      updateAnswers(question, response.data.answers);
    })
    .catch((error) => {
      console.error(error);
      updateAnswers(question, []);
    });
}

function setContent(event) {
  event.preventDefault();
  const question = document.querySelector("#searchInput").value;
  // document.querySelector("#msg").innerHTML = question;

  const bgpage = chrome.extension.getBackgroundPage();
  paragraphs = bgpage.paragraphs;

  // Remove old answers
  let divAnswers = document.querySelector("#answers");
  removeChildren(divAnswers);

  // Make model input
  let input = "question: " + question + " context: ";
  let context = "";
  for (let i = 0; i < paragraphs.length; i++) {
    context = paragraphs[i];
    // Get model output
    let answers = getAnswers(input + context, question);
    console.log("[INFO] RESPONSE " + i + " : " + answers);
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

// import * as tf from "@tensorflow/tfjs";
// const tokenizer_path =
//   "https://s3.amazonaws.com/models.huggingface.co/bert/t5-spiece.model";
// // const model_path = "../libraries/models/t5_base_model_js/model.json";
// const model_path = "../libraries/models/t5-small-tf_model/model.json";
// // const model_path = "https://cdn.huggingface.co/t5-small-tf_model.h5";

// document.querySelector("#msg").innerText = "[LOADING TF MODEL]";
// var model;
// tf.loadLayersModel(model_path).then((loadedModel) => {
//   model = loadedModel;
//   document.querySelector("#msg").innerText = "[MODEL LOADED]";
// });
// console.log("After promise");

// -================================================-
