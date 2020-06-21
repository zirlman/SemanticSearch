// Make paragraphs available to the popup script
// Using chrome.extension.getBackgroundPage()
window.content = [];

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
      // Remove references ([1], [2][13], etc.)
      .replace(/\[\d+\]/g, "")
      // Remove edit reference
      .replace(/\[\s?edit\s?\]/, "")
      // Replace newline before lines which don't start with a capital letter 
      .replace(/[\r\n](?=[^A-Z])/g, " ")
      // Remove multiple whitespaces before full stop character
      .replace(/[\t\f\v ]+(=?\.)/g, "")
      // Remove titles/headings etc.
      .replace(/(^[a-zA-Z]+$)/g, "")
      // Replace multiple whitespaces with a single one
      .replace(/ +/g, " ")
      // Remove multiple newlines
      .replace(/[\r\n]{2,}/, "");

    content = text;
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
