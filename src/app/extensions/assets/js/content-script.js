console.log('content-script loaded');

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  script.onload = function() {
    this.remove();
  };
  node.appendChild(script);
}
injectScript(chrome.extension.getURL('assets/js/webpage.js'), 'body');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_RESULT') {
    //fire an event to get duck
    let event = new CustomEvent('GET_RESULT');
    window.dispatchEvent(event);
  }
});

window.addEventListener(
  'message',
  event => {
    if (event.data.action === 'GOT_RESULT') {
      // Remove this listener, but you can keep it depend on your case
      // window.removeEventListener('message', receiveDuck, false);
      console.log(event.data);
      chrome.runtime.sendMessage(event.data);
    }
  },
  false
);
