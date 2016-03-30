var selector = '.event'; // CSS selector corresp. to courses

var getDivsForCSS = 
    function(s) {
        return document.querySelectorAll('div' + s);
    };

var getArrayOfCourses = 
    function(course_name) {
        return [...new Set(getDivsForCSS(selector).map())]
    };

var getArrayForCourse = 
    function(s) { 
        var matchingCourse = function(elem) { return elem.innerHTML === s; };
        return [].slice.call(getDivsForCSS(selector)).filter(matchingCourse);
    };

var setCourseToColor = 
    function(s, color) {
        var elems = getArrayForCourse(s);
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.backgroundColor = color;
        }
    };

var resetColor = function(s) { setCourseToColor(s, '#4f8edc') };

var removeFocus = function(s) { setCourseToColor(s, '#6faaff') };

var restoreFocus = resetColor

var strongFocus = function(s) { setCourseToColor(s, "#4f8e8c") };

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        //console.log('received request:');
        //console.log(request);
        setCourseToColor(request.courseName, request.color); 
    }
);
