// Remove all HTML tags inside the passed tag
function stripHtml(tag) {
  let tmp = document.createElement("div");
  tmp.innerHTML = tag;
  let txt = tmp.textContent || tmp.innerText || "";
  // Remove references
  return txt.replace(/\[\d+\]/g, "");
}

function printParagraphs() {
  let paragraphs = document.querySelectorAll("p");
  for (p of paragraphs) {
    console.log(stripHtml(p.innerHTML));
  }
}

// Callback for when a message is received
function receiver(request, sender, sendResponse) {
  console.log("Message received: " + JSON.stringify(request));
  if (request.content === "user clicked!") {
    printParagraphs();
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener(receiver);
