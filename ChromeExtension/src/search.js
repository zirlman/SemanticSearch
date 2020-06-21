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
  const IP = "35.214.46.90";
  // const URL = `http://${ID}.ngrok.io/api/qa`;
  // const URL = `http://localhost:5000/api/qa`;
  const URL = `http://${IP}:5000/api/qa`;

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

// import * as qna from '@tensorflow-models/qna';
// const context = "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware. It is considered one of the Big Four technology companies, alongside Amazon, Apple, and Facebook. Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14 percent of its shares and control 56 percent of the stockholder voting power through supervoting stock. They incorporated Google as a California privately held company on September 4, 1998, in California. Google was then reincorporated in Delaware on October 22, 2002. An initial public offering (IPO) took place on August 19, 2004, and Google moved to its headquarters in Mountain View, California, nicknamed the Googleplex. In August 2015, Google announced plans to reorganize its various interests as a conglomerate called Alphabet Inc. Google is Alphabet's leading subsidiary and will continue to be the umbrella company for Alphabet's Internet interests. Sundar Pichai was appointed CEO of Google, replacing Larry Page who became the CEO of Alphabet."
// const question = "Who is the CEO of Google?"

// async function test() {
//   // Load the model.
//   const model = await qna.load();
//   return await model.findAnswers(question, context);
// }

// const answers = test();
// console.log(answers);
// /**
// [{
//   text: "Sundar Pichai",
//   startIndex: 1143,
//   endIndex: 1156,
//   score: 0.8380282521247864
// }]
// **/

// -================================================-
