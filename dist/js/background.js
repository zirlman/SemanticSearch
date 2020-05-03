// Make paragraphs available to the popup script
// Using chrome.extension.getBackgroundPage()
window.paragraphs = [];


// Returns page source
async function makeRequest(method, url) {
  let response = await new Promise(resolve => {
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
  })
  return response;
}

//Extract main textual content of a web page.
function extractText(url) {
  // Get extractet
  let text = "";
  makeRequest("GET", url).then(text => {
    console.log("text: " + text);
    // The maximum input size for the model is 512 characters 
    // We chunk the data in blocks of 512 characters each
    // Bigger input will lead to better answers because more knowledge can be extracted from the context
    const BLOCK_SIZE = 512;
    let blockNum = Math.floor(text.length / BLOCK_SIZE);
    let result = []
    console.log(text.length)
    for (let i = 0; i <= blockNum; i++) {
      let start = i * BLOCK_SIZE;
      let offset = i == blockNum ? text.length - 1 - start : BLOCK_SIZE;
      console.log(start + " " + offset + " " + (start + offset));
      let block = text.slice(start, start + offset);
      result.push(block);
    }
    paragraphs = result;
    console.log("[LOADED]");
  }
  );
}


// Callback for when a message is received
function popup_receiver(request, sender, sendResponse) {
  // console.log("SENDER: " + JSON.stringify(sender));
  // console.log("SENDER RESPONSE: " + JSON.stringify(sendResponse));
  console.log("[background receiver] Message received: " + request.content);
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
  console.log("Message sent");
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


