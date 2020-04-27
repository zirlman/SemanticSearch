function getContent() {
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //   chrome.tabs.executeScript(tabs[0].id, {
  //     code: 'document.body.style.backgroundColor = "' + color + '";',
  //   });
  // });
  return "TEST";
}

function onLoad() {
  const input = document.querySelector(".finder__input");
  const finder = document.querySelector(".finder");
  const form = document.querySelector("form");
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
    msg.innerHTML = input.value;
    setTimeout(() => {
      finder.classList.remove("processing");
      input.disabled = false;
      if (input.value.length > 0) {
        finder.classList.add("active");
      }
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", onLoad);
