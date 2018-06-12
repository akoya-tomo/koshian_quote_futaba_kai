
function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions() {
  browser.storage.local.set({
    show_idip:document.getElementById("show_idip").checked,
    show_number:document.getElementById("show_number").checked,
    show_quote:document.getElementById("show_quote").checked,
    show_quotemove:document.getElementById("show_quotemove").checked,
    show_copy:document.getElementById("show_copy").checked,
    show_copymove:document.getElementById("show_copymove").checked,
    res_filename:document.getElementById("res_filename").checked,
    res_number:document.getElementById("res_number").checked,
    quote_only_unquoted:document.getElementById("quote_only_unquoted").checked,
    quickquote_number:document.getElementById("quickquote_number").checked
  });
}

function setCurrentChoice(result) {
  document.getElementById("show_idip").checked = safeGetValue(result.show_idip, false);
  document.getElementById("show_number").checked = safeGetValue(result.show_number, false);
  document.getElementById("show_quote").checked = safeGetValue(result.show_quote, true);
  document.getElementById("show_quotemove").checked = safeGetValue(result.show_quotemove, true);
  document.getElementById("show_copy").checked = safeGetValue(result.show_copy, true);
  document.getElementById("show_copymove").checked = safeGetValue(result.show_copymove, true);
  document.getElementById("res_filename").checked = safeGetValue(result.res_filename, false);
  document.getElementById("res_number").checked = safeGetValue(result.res_number, false);
  document.getElementById("quote_only_unquoted").checked = safeGetValue(result.quote_only_unquoted, false);
  document.getElementById("quickquote_number").checked = safeGetValue(result.quickquote_number, false);

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