
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

// Prepares the url for AJAX request
function urlEncode(url) {
  const key = "KEY";
  const req_template = `https://boilerpipe-web.appspot.com/extract?url=${key}&extractor=ArticleExtractor&output=text`;
  const encodedUrl = encodeURIComponent(url);
  return req_template.replace(key, encodedUrl);
}

// Send paragraphs to background script
function sendParagraphs() {
  let url = urlEncode(document.URL);
  let msg = {
    content: "paragraphs",
    url,
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
