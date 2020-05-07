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
  const KEY = "KEY";
  // From https://boilerpipe-web.appspot.com/
  // Strategy	                Description
  // ArticleExtractor	        A full-text extractor which is tuned towards news articles. In this scenario it achieves higher accuracy than DefaultExtractor.
  // DefaultExtractor	        A quite generic full-text extractor, but usually not as good as ArticleExtractor.
  // LargestContentExtractor	Like DefaultExtractor, but only keeps the largest content block. Good for non-article style texts with only one main content block.
  // KeepEverythingExtractor	Treats everything as "content". Useful to track down SAX parsing errors.
  const EXTRACTOR = "KeepEverythingExtractor";

  // Output Format    Description
  // html	            Output the whole HTML document and highlight the extracted main content
  // htmlFragment	    Output only those HTML fragments that are regarded main content
  // text	            Output the extracted main content as plain text
  // json           	Output the extracted main content as JSON. For details, see this page.
  // debug	          Output debug information to understand how boilerpipe internally represents a document.
  const OUTPUT = "text";

  const req_template = `https://boilerpipe-web.appspot.com/extract?url=${KEY}&extractor=${EXTRACTOR}&output=${OUTPUT}`;
  const encodedUrl = encodeURIComponent(url);
  return req_template.replace(KEY, encodedUrl);
}

// Send paragraphs to background script
function sendParagraphs() {
  let url = urlEncode(document.URL);
  console.log(url);
  let msg = {
    content: "paragraphs",
    url,
  };

  chrome.runtime.sendMessage(msg);
  console.log("[INFO] Message sent to background script");
}

// Callback for when a message is received
function content_receiver(request, sender, sendResponse) {
  console.log(
    "[content_receiver] Message received: " + JSON.stringify(request)
  );
  if (request.content === "clicked") sendParagraphs();
}

// Listen for messages
chrome.runtime.onMessage.addListener(content_receiver);
