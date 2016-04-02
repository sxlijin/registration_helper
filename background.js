// Implements the mediator design pattern.

/** 
 * Sends message to the currently active tab.
 * @param {Object} message : contents of the message to be sent.
 */
function broadcastMessage(message) {
    message.origin = "background.js";
    chrome.tabs.query(
        {active: true, currentWindow: true}, 
        function(tabs) { chrome.tabs.sendMessage(tabs[0].id, message); }
    );
}


// Re-broadcast messages sent by the xmlHttpRequest event handler.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(request);
        if (!request.origin) return;
        if (request.origin === "xhrEventHandler.js") broadcastMessage(request);
    }
);
