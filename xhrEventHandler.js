function injectXHReventListener() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('xhrEventListener.js');
    s.onload = function() { this.parentNode.removeChild(this); };
    (document.head || document.documentElement).appendChild(s);
}

window.addEventListener('message', function(event) {
    if (event.source !== window) { return; }
    var message = event.data;
    if (typeof message !== 'object'
        || message === null
        || !message.hasOwnProperty("xhr"))
    { return; }
    //console.log("xhr event received");
    var xhrCalendarReload = 'https://webapp.mis.vanderbilt.edu/more/' 
                              + 'GetScheduleExecute!createSchedule.action';
    if (message.xhr.startsWith(xhrCalendarReload)) { retrieveCourseColors(); }
});

injectXHReventListener();

