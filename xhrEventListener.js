// code taken from http://stackoverflow.com/questions/5202296/
//                          add-a-hook-to-all-ajax-requests-on-a-page

function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.hasOwnProperty("callbacks")
        && Array.isArray(XMLHttpRequest.callbacks)) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}

addXMLRequestCallback( function(xhr) {
    xhr.onreadystatechange = function () { xhrEventPoster(xhr); };
});

function xhrEventPoster(xhr) {
    //console.log('response url should be:        [' + xhr.responseURL+ ']');
    //console.log('response readystate should be: [' + xhr.readyState + ']');
    window.postMessage({"xhr": xhr.response, "xhrState": xhr.readyState}, "*");
}
