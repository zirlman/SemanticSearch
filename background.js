function buttonClicked(tab) {
  // The user clicked the button!
  // 'tab' is an object with information about the current open tab
  var msg = {
    message: "user clicked!",
  };
  console.log("TAB: " + tab);
  chrome.tabs.sendMessage(tab.id, msg);
  console.log("Message sent");
}

// Add a listener for the browser action
// Doens't work if popup exist
chrome.browserAction.onClicked.addListener(buttonClicked);
