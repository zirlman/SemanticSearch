function stripHtml(html) {
  let tmp = document.createElement("div");
  tmp.innerHTML = html;
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
  console.log("Message received");
  if (request.message === "user clicked!") {
    printParagraphs();
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener(receiver);
