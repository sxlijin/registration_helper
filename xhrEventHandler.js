function injectXHReventListener() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('xhrEventListener.js');
    s.onload = function() { this.parentNode.removeChild(this); };
    (document.head || document.documentElement).appendChild(s);
}

function broadcastMessage(message) {
    //console.log("sending message from xhr handler");
    //console.log(message);
    chrome.runtime.sendMessage(message);
}

window.addEventListener('message', function(event) {
    if (event.source !== window) { return; }
    var message = event.data;
    if (typeof message !== 'object'
        || message === null
        || !message.hasOwnProperty("xhr"))
    { return; }
    //console.log("xhr event received");
    //var xhrCalendarReload = 'https://webapp.mis.vanderbilt.edu/more/' 
    //                          + 'GetScheduleExecute!createSchedule.action';
    //if (message.xhr.startsWith(xhrCalendarReload)) { 
    if (message.xhrState === 4) {
    // must hook onto an event that fires after course <div>s have loaded
        //console.log(getArrayOfCourses());
        //retrieveCourseColors(); 
        broadcastMessage({command:"retrieve_colors", origin:"xhrEventHandler.js"});
    }
});

injectXHReventListener();

