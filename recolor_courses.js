// Content script: recolors the <div>s corresponding to courses

var selector = '.event'; // CSS selector corresp. to all course <div>s

/**
 * Gets HTMLCollection of all <div>s which correspond to calendar blocks
 * which represent course times.
 * Notes:   .event              corresponds to *all* courses
 *          .eventEnrolled      corresponds to enrolled courses
 *          .eventWaitlisted    (?) corresponds to waitlisted courses
 *          .eventSaved         corresponds to courses in the cart
 *     (?): this is an unverified guess derived from naming conventions
 * @param {string} s : CSS selector to be appended to 'div'
 * @return {HTMLCollection} all elements matching the selector `div${s}`
 */
function getDivsForCSS(s) {
    return document.querySelectorAll(`div${s}`);
};


/**
 * Gets the list of names of courses shown on the calendar.
 * @return {array} list of unique course names on the calendar
 */
function getArrayOfCourses() {
    return [...new Set(Array.from(getDivsForCSS(selector))
                        .map(function(e) {return e.innerText;})
                      )
           ];
};


/**
 * Gets list of <div>s which match the specified course.
 * @param {string} s : name of course to match
 * @return {array} list of matching <div>s
 */
function getArrayForCourse(s) {
    var matchingCourse = function(elem) { return elem.innerText === s; };
    return [].slice.call(getDivsForCSS(selector)).filter(matchingCourse);
};


/**
 * Sets the background color of the <div>s matching the specified course name
 * to the specified color iff course name corresponds to a course in the 
 * calendar and the specified color is a valid CSS3 color.
 * @param {string} s     : course name to match <div>s to
 * @param {string} color : color to set background color of <div>s to
 */
function setCourseToColor(s, color) {
    color = validateColor(color);
    if (!(getArrayOfCourses().includes(s) || color === '')) { return; }
    // only keep going if s and color correspond to an actual course and color

    var elems = getArrayForCourse(s);
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.backgroundColor = color;
    }

    saveCourseAndColor(s, color);
};


/**
 * Record the color to be used as the background color for <div>s which match
 * the specified course. Uses chrome.storage.local.
 * @param {string} course : course name to be associated with the color
 * @param {string} color  : color to set the course's bg-color to
 */
function saveCourseAndColor(course, color) {
    dict = {};
    dict[course] = color;
    chrome.storage.local.set(dict);
    //console.log('saved course and color: ');
    //console.log(dict);
};


/**
 * Retrieve all course-color associations made in the past from storage and
 * accordingly set the colors of <div>s matching the recorded course. 
 */
function retrieveCourseColors() {
    //console.log('retrieving course colors');
    var courses = getArrayOfCourses();
    //console.log('retrieving: ');
    //console.log(courses);
    function retrieveColorCallback(colors) {
        //console.log('retrieve callback:');
        //console.log(courses);
        //console.log(colors);
        for (var i = 0; i < courses.length; i++) {
            if (colors.hasOwnProperty(courses[i])) {
                setCourseToColor(courses[i], colors[courses[i]]);
            }
        }
    };
    chrome.storage.local.get(getArrayOfCourses(), retrieveColorCallback);
};


// Artifacts from proof-of-concept. Retained because of color choices.
function resetColor(s) { setCourseToColor(s, '#4f8edc'); };
function removeFocus(s) { setCourseToColor(s, '#6faaff'); };
var restoreFocus = resetColor
function strongFocus(s) { setCourseToColor(s, "#4f8e8c"); };


// Listen for commands to set or retrieve colors.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        // require the type property of request
        //console.log(request);
        if (!request.command || !request.origin) { return; }
        if (request.command === "set_color") { 
            setCourseToColor(request.courseName, request.color); 
        }
        else if (request.command === "retrieve_colors") {
            retrieveCourseColors();
        }
    }
);


// When the window is resized, something weird happens. It's not quite clear
// what that exact behavior is, but this much is known: the <div>s present 
// *before* the resize are deleted, and new identical ones are created (easily
// verified by watching the IDs of the <div>s), and it seems that such is done
// by a script which hooks onto window.resize. The result is that hooking 
// retrieveCourseColors() to window.resize does not consistently succeed at
// recoloring the <div>s, presumably due to the inherent async nature; instead,
// a mutationObserver is attached to <body>, the direct parent of these <div>s.
new MutationObserver(retrieveCourseColors)
    .observe(document.querySelector('body'), 
             { childList: true }
             );

window.addEventListener('xhrProcessed', function(e) {
    console.log('xhrProcessed event fired and recognized');
    console.log(e);
});
