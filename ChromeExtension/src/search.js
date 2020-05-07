var paragraphs;

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Send message to content script
function sendMsg(tabs) {
  let tab = tabs[0];
  let msg = {
    content: "clicked",
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
  card.className = "card w-100 border-0";
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
    let card = makeCard(`${i + 1}. ${capitalize(answers[i])}`);
    divAnswers.appendChild(card);
  }
}

const axios = require("axios");

function getAnswers(input) {
  const ID = "cb622656";
  // const URL = `http://${ID}.ngrok.io/api/qa`;
  const URL = `http://localhost:5000/api/qa`;
  const data = { input };

  axios
    .post(URL, data)
    .then((response) => {
      updateAnswers(data["question"], response.data.answers);
    })
    .catch((error) => {
      console.error(error);
      updateAnswers(data["question"], []);
    });
}

function prepareQuestion(rawQuestion) {
  let question = capitalize(rawQuestion);
  return question.charAt(question.length - 1) != "?"
    ? question + "?"
    : question;
}

function setContent(event) {
  event.preventDefault();
  const question = prepareQuestion(
    document.querySelector("#searchInput").value
  );
  console.log(question);

  // Remove old answers
  let divAnswers = document.querySelector("#answers");
  removeChildren(divAnswers);

  // Make model input
  const bgpage = chrome.extension.getBackgroundPage();
  let data = {
    question,
    blocks: bgpage.blocks,
  };

  // Get model output
  getAnswers(data);
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
