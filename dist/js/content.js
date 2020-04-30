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

// Send paragraphs to background script
function sendParagraphs() {
  let paragraphs = Array.from(document.querySelectorAll("p")).map((p) =>
    stripHtml(p.innerHTML).trim()
  );

  let msg = {
    content: "paragraphs",
    data: paragraphs,
  };

  chrome.runtime.sendMessage(msg);
  console.log("Message sent to background script");
}

// Callback for when a message is received
function content_receiver(request, sender, sendResponse) {
  console.log(
    "[content_receiver] Message received: " + JSON.stringify(request)
  );
  if (request.content === "user clicked!") sendParagraphs();
}

// Listen for messages
chrome.runtime.onMessage.addListener(content_receiver);
