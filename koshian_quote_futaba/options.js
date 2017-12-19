
function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions() {
  browser.storage.local.set({
    show_quote:document.getElementById("show_quote").checked,
    show_quotemove:document.getElementById("show_quotemove").checked,
    show_copy:document.getElementById("show_copy").checked,
    show_copymove:document.getElementById("show_copymove").checked,
  });
}

function setCurrentChoice(result) {
  document.getElementById("show_quote").checked = safeGetValue(result.show_quote, true);
  document.getElementById("show_quotemove").checked = safeGetValue(result.show_quotemove, true);
  document.getElementById("show_copy").checked = safeGetValue(result.show_copy, true);
  document.getElementById("show_copymove").checked = safeGetValue(result.show_copymove, true);

  for(let i = 0,inputs = document.getElementsByTagName("input"); i < inputs.length; ++i){
    inputs[i].onclick = saveOptions;
  }
}

function onError(error) {
  //  console.log(`Error: ${error}`);
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get().then(setCurrentChoice, onError);
});