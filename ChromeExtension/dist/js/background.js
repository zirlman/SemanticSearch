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
    text = text
      .replace(/(\r|\n)+(?=[A-Z])/g, ". ")
      .replace(/(\r|\n)+/g, " ")
      .replace(/\[\d+\]/g, "")
      .replace("[ edit ]", "")
      .replace(/\s+/g, " ");
    // The maximum input size for the model is 512 characters
    // We chunk the data in blocks of 512 characters each
    // Bigger input will lead to better answers because more knowledge can be extracted from the context
    const BLOCK_SIZE = 512;
    const NUM_BLOCKS = Math.floor(text.length / BLOCK_SIZE);
    let result = [];
    for (let i = 0; i <= NUM_BLOCKS; i++) {
      let start = i * BLOCK_SIZE;
      let offset = i == NUM_BLOCKS ? text.length - 1 - start : BLOCK_SIZE;
      let block = text.slice(start, start + offset);
      result.push(block);
    }
    blocks = result;
    console.log("[LOADED]");
  });
}

// Callback for when a message is received
function popup_receiver(request, sender, sendResponse) {
  console.log("[INFO - popup receiver] Message received: " + request.content);
  if (request.content == "paragraphs") {
    extractText(request.url);
  }
}

function buttonClicked(tab) {
  // 'tab' is an object with information about the current open tab
  var msg = {
    message: "clicked",
  };
  chrome.tabs.sendMessage(tab.id, msg);
  console.log("[INFO] Message sent");
}

// Add a listeners
chrome.runtime.onMessage.addListener(popup_receiver);

// Add a listener for the browser action
// Doens't work if popup exist
chrome.browserAction.onClicked.addListener(buttonClicked);
