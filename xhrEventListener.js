// Mimic an event listener hooked onto the firing of xmlHttpRequests.


/**
 * Modify the XMLHttpRequest prototype to initiate a callback function whenever
 * XMLHttpRequest.send() is called.
 * @param {function} callback : callback to initiate on call to xhr.send()
 */
function setXMLRequestCallback(callback){
    // Code modified from "Add a hook to all AJAX requests on a page" at 
    // http://stackoverflow.com/questions/5202296/

    XMLHttpRequest.callback = callback;

    // store the native send()
    var nativeSend = XMLHttpRequest.prototype.send;

    // override the native send()
    XMLHttpRequest.prototype.send = function(){
        // process the callback queue
        // the xhr instance is passed into each callback but seems pretty useless
        XMLHttpRequest.callback(this);

        // call the native send()
        nativeSend.apply(this, arguments);
    }
}


/** 
 * Callback to be initiated when "readystatechange" Event fires for any xhr.
 * @param {Object} xhr : call window.postMessage() on characteristics of the xhr
 *     whenever its "readystatechange" Event fires; there seem to be security 
 *     limitations that prevent simply posting the xhr Event.
 */
function xhrEventPoster(xhr) {
    //console.log(`response url should be:        [${xhr.responseURL}]`);
    //console.log(`response readystate should be: [${xhr.readyState}]`);
    //window.postMessage({"xhr": xhr.response, "xhrState": xhr.readyState}, "*");
    console.log('dispatching xhrProcessedEvent');

    // xhr has only been fully processed when readyState is 4
    // event triggers <div> recoloring, should only fire when this is possible
    if (xhr.readyState == 4) { window.dispatchEvent(xhrProcessedEvent); }
}


var xhrProcessedEvent = new Event('xhrProcessed');

// Hook onto xhr.onreadystatechange with a callback to a window.postMessage() wrapper
setXMLRequestCallback( function(xhr) {
    xhr.onreadystatechange = function () { xhrEventPoster(xhr); };
});
