// popup.html imports lib/colors.js

// CSS IDs of <input> elems to listen for input on
var inputElemIDs = ["colorPalette", "colorValue", "courseName"];


/**
 * Gets the <input> element with specified ID.
 * @param {string} id : ID of desired <input> element
 * @return {Node} <input> element with specified ID.
 */
function getInputElementById(id) { return document.querySelector(`input#${id}`); }


/**
 * Gets the value of the <input> element with specified ID.
 * @param {string} id : ID of desired <input> element
 * @return {Node} value of <input> element with specified ID.
 */
function getValueOfInputID(id) { return getInputElementById(id).value; }


/**
 * Sets the value of the <input> element with specified ID.
 * @param {string} id : ID of desired <input> element
 */
function setValueOfInputID(id, val) { getInputElementById(id).value = val; }


/**
 * Updates the <input> fields to represent a color if it is valid.
 * @param {string} color : string which may or may not represent a CSS3 color.
 */
function setColorOfInputs(color) {
    // if invalid color, done
    if (validateColor(color) === '') { return null; }

    // set values of first and second inputs
    setValueOfInputID(inputElemIDs[0], colorToHex(color));
    if (validateColor(getValueOfInputID(inputElemIDs[1])) 
            !== validateColor(color))
    { setValueOfInputID(inputElemIDs[1], colorToHex(color)); }

    // set background colors of second and third inputs
    getInputElementById(inputElemIDs[1]).style.backgroundColor = color;
    getInputElementById(inputElemIDs[2]).style.backgroundColor = color;
}


/**
 * Sends command to set the color of the <div>s for a specified course.
 * @param {string} course : name of the course whose <div>s are to be recolored
 * @param {string} color  : color to recolor <div>s to
 */
function setCourseToColor(course, color) {
    broadcastCommand("set_color", {"courseName":course, "color":color});
}


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
 * Sends message to the currently active tab.
 * @param {Object} message : contents of the message to be sent.
 */
function broadcastMessage(message) {
    message.origin = "popup.js";
    chrome.tabs.query(
        {active: true, currentWindow: true}, 
        function(tabs) { chrome.tabs.sendMessage(tabs[0].id, message); }
    );
}


/**
 * Callback which updates input fields as entered value changes and sends
 * command to recolor the <div>s corresponding to the specified course when
 * appropriate. Updates <input>s by setting the values of the color <input>s
 * and background colors of the text <input>s; sends command when color is 
 * valid (relies on callee to verify the course name).
 * @param {Event} e : Event corresponding to input update.
 */
function onInput(e) {
    var color = e.target.id === "courseName" ? e.target.style.backgroundColor
                                             : e.target.value;
    if (validateColor(color) === '') { return null; }
        
    setColorOfInputs(color);
    setCourseToColor(getValueOfInputID('courseName'), color);
};


/**
 * Callback to be initiated when the DOM loads; ties the onInput() function
 * to the "input" Events on each <input> element.
 */
function onDOMLoad() {
    for (var i = 0; i < inputElemIDs.length; i++) {
        var inputElem = document.getElementById(inputElemIDs[i]);
        inputElem.addEventListener("input", onInput);
    }
}

document.addEventListener('DOMContentLoaded', onDOMLoad);
