function validateColor(color_string) {
    var d1 = document.createElement('div');
    var d2 = document.createElement('div');
    d1.style.color = '#000000';
    d2.style.color = '#FFFFFF';
    d1.style.color = d2.style.color = color_string;
    return (d1.style.color === d2.style.color) ? d1.style.color : '';
};

var selector = '.event'; // CSS selector corresp. to courses

function getDivsForCSS(s) {
    return document.querySelectorAll('div' + s);
};

function getArrayOfCourses() {
    return [...new Set(Array.from(getDivsForCSS(selector))
                        .map(function(e) {return e.innerHTML;})
                      )
           ];
};

function getArrayForCourse(s) {
    var matchingCourse = function(elem) { return elem.innerHTML === s; };
    return [].slice.call(getDivsForCSS(selector)).filter(matchingCourse);
};

function setCourseToColor(s, color) {
    color = validateColor(color);
    console.log(getArrayOfCourses().indexOf(s) || color === '');
    if (getArrayOfCourses().indexOf(s) == -1 || color === '') return null;

    var elems = getArrayForCourse(s);
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.backgroundColor = color;
    }

    saveCourseAndColor(s, color);
};

function saveCourseAndColor(course, color) {
    dict = {};
    dict[course] = color;
    chrome.storage.sync.set(dict);
    console.log('saved course and color: ');
};

function retrieveCourseColors() {
    console.log('retrieving course colors');
    var courses = getArrayOfCourses();
    console.log('retrieving: ');
    console.log(courses);
    var retrieveColorCallback = 
        function(items) {
            console.log('retrieve callback:');
            console.log(items);
            for (var i = 0; i < courses.length; i++) {
                if (items.hasOwnProperty(courses[i])) {
                    setCourseToColor(courses[i], items[courses[i]]);
                }
            }
        };
    var colors = chrome.storage.sync.get(courses, retrieveColorCallback);
};

function resetColor(s) { setCourseToColor(s, '#4f8edc'); };

function removeFocus(s) { setCourseToColor(s, '#6faaff'); };

var restoreFocus = resetColor

function strongFocus(s) { setCourseToColor(s, "#4f8e8c"); };

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        retrieveCourseColors();
        setCourseToColor(request.courseName, request.color); 
    }
);
