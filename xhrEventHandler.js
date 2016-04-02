// When the xhr "event listener" triggers, triggers a recoloring of the course <div>s.

/**
 * Injects the XHR event listener into the webpage.
 */
function injectXHReventListener() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('xhrEventListener.js');
    s.onload = function() { this.parentNode.removeChild(this); };
    (document.head || document.documentElement).appendChild(s);
}
injectXHReventListener();


/**
 * Sends message representing the specified command.
 * @param {string} commandName : name of the command to be sent
 * @param {Object} parameters  : parameters for the named command
 */
function broadcastCommand(commandName, parameters) {
    if (typeof parameters === 'undefined') parameters = {};
    parameters.command = commandName;
    broadcastMessage(parameters); 
}


/** 
 * Sends message to the extension popup.
 * @param {Object} message : contents of the message to be sent.
 */
function broadcastMessage(message) {
    message.origin = "xhrEventHandler.js";
    //console.log("sending message from xhr handler");
    //console.log(message);
    chrome.runtime.sendMessage(message);
}


// Mimic event handler for the mimic'd event listener
window.addEventListener('message', function(event) {
    if (event.source !== window) { return; }
    var message = event.data;
    if (typeof message !== 'object'
        || message === null
        || !message.hasOwnProperty("xhr"))
    { return; }
 
    // xhrState===4 iff course <div>s have already loaded
    if (message.xhrState === 4) { 
        broadcastCommand("retrieve_colors");
        //broadcastMessage({command:"retrieve_colors", origin:"xhrEventHandler.js"});
    }
});


