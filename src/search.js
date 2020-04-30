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

function updateAnswers(question, answers) {
  let divAnswers = document.querySelector("#answers");
  // Remove old answers
  while (divAnswers.firstChild) {
    divAnswers.removeChild(divAnswers.firstChild);
  }

  // Make answers
  for (let i = 0; i < answers.length; i++) {
    let card = makeCard("- " + answers[i]);
    divAnswers.appendChild(card);
  }
}

const axios = require("axios");

function getAnswers(input, question) {
  console.log(input);
  let data = { input };
  let url = "http://6414f116.ngrok.io/api/t5_model";

  axios
    .post(url, data)
    .then((response) => {
      console.log("IN PROMISE " + response);
      updateAnswers(question, response.data.answers);
    })
    .catch((error) => {
      console.log(error);
      updateAnswers(question, []);
    });
}

function setContent(event) {
  event.preventDefault();
  let question = document.querySelector("#searchInput").value;
  document.querySelector("#msg").innerHTML = question;

  let bgpage = chrome.extension.getBackgroundPage();
  paragraphs = bgpage.paragraphs;

  // Make model input
  let input = "question: " + question + " context: ";
  let context = "";
  let maxContextLen = 512 - input.length;
  for (let i = 0; i < paragraphs.length && context.length < maxContextLen; i++)
    context += paragraphs[i];
  input += context;

  // Get model output
  let answers = getAnswers(input, question);
  console.log("RESPONSE: " + answers);
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
