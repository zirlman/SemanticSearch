chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

function onLoad() {
  const input = document.getElementsByClassName("finder__input")[0];
  const finder = document.getElementsByClassName("finder")[0];
  const form = document.forms[0];

  console.log(input);
  console.log(finder);
  console.log(form);

  input.addEventListener("focus", () => {
    finder.classList.add("active");
  });

  input.addEventListener("blur", () => {
    if (input.value.length === 0) {
      finder.classList.remove("active");
    }
  });

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    finder.classList.add("processing");
    finder.classList.remove("active");
    input.disabled = true;
    setTimeout(() => {
      finder.classList.remove("processing");
      input.disabled = false;
      if (input.value.length > 0) {
        finder.classList.add("active");
      }
    }, 1000);
  });

  var message = document.querySelector("#message");

  chrome.tabs.executeScript(
    null,
    {
      file: "getPagesSource.js",
    },
    function () {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText =
          "There was an error injecting script : \n" +
          chrome.runtime.lastError.message;
      }
    }
  );
}

document.onload = onLoad;
