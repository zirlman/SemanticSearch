// Make paragraphs available to the popup script
// Using chrome.extension.getBackgroundPage()
window.paragraphs = [];

// Callback for when a message is received
function popup_receiver(request, sender, sendResponse) {
  // console.log("SENDER: " + JSON.stringify(sender));
  // console.log("SENDER RESPONSE: " + JSON.stringify(sendResponse));
  console.log("[background receiver] Message received: " + request.content);
  if (request.content == "paragraphs") {
    paragraphs = request.data;
    console.log("Data loaded");
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

// Add a listener
chrome.runtime.onMessage.addListener(popup_receiver);

// Add a listener for the browser action
// Doens't work if popup exist
chrome.browserAction.onClicked.addListener(buttonClicked);
