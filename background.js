function broadcastMessage(message) {
    message.origin = "background.js";
    chrome.tabs.query(
        {active: true, currentWindow: true}, 
        function(tabs) { chrome.tabs.sendMessage(tabs[0].id, message); }
    );
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(request);
        if (!request.origin) return;
        if (request.origin === "xhrEventHandler.js") broadcastMessage(request);
    }
);
