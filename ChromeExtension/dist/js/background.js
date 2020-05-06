// Make paragraphs available to the popup script
// Using chrome.extension.getBackgroundPage()
window.blocks = [];

// Returns page source
async function makeRequest(method, url) {
  let response = await new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function (e) {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      resolve(undefined);
      console.error("** An error occurred during the XMLHttpRequest");
    };
    xhr.send();
  });
  return response;
}

//Extract main textual content of a web page.
function extractText(url) {
  // Get extracted text
  makeRequest("GET", url).then((text) => {
    // The maximum input size for the model is 512 characters
    // We chunk the data in blocks of 512 characters each
    // Bigger input will lead to better answers because more knowledge can be extracted from the context
    text = text.replace(/\n|\r/g, " ").replace(/\[\d+\]/g, "");
    const BLOCK_SIZE = 512;
    let blockNum = Math.floor(text.length / BLOCK_SIZE);
    let result = [];
    for (let i = 0; i <= 3; i++) {
      let start = i * BLOCK_SIZE;
      let offset = i == blockNum ? text.length - 1 - start : BLOCK_SIZE;
      let block = text.slice(start, start + offset);
      result.push(block);
    }
    blocks = result;
    console.log("[LOADED]");
  });
}

// Callback for when a message is received
function popup_receiver(request, sender, sendResponse) {
  // console.log("SENDER: " + JSON.stringify(sender));
  // console.log("SENDER RESPONSE: " + JSON.stringify(sendResponse));
  console.log(
    "[INFO] [background receiver] Message received: " + request.content
  );
  if (request.content == "paragraphs") {
    let url = request.url;
    extractText(url);
  }
}

function buttonClicked(tab) {
  // 'tab' is an object with information about the current open tab
  var msg = {
    message: "user clicked!",
  };
  chrome.tabs.sendMessage(tab.id, msg);
  console.log("[INFO] Message sent");
}

function extract_text(request, sender, sendResponse) {
  if (request.contentScriptQuery == "queryPrice") {
  }
}

// Add a listeners
chrome.runtime.onMessage.addListener(popup_receiver);
chrome.runtime.onMessage.addListener(extract_text);

// Add a listener for the browser action
// Doens't work if popup exist
chrome.browserAction.onClicked.addListener(buttonClicked);
