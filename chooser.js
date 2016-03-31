// CSS IDs of <input> elems to listen for input on
var inputElemIDs = ["colorPalette", "colorValue", "courseName"];

function getInputElementById(id) 
    { return document.querySelector(`input#${id}`); }

function getValueOfInputID(id) { return getInputElementById(id).value; }

function setValueOfInputID(id, val) { getInputElementById(id).value = val; }

function setColorOfInputs(color) {
    if (validateColor(color) === '') { return null; }
    setValueOfInputID(inputElemIDs[0], colorToHex(color));
    for (var i = 1; i < inputElemIDs.length; i++) {
        getInputElementById(inputElemIDs[i]).style.backgroundColor = color;
    }
}

function setCourseToColor(course, color) {
    chrome.tabs.query(
        {active: true, currentWindow: true}, 
        function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id, 
                {"courseName":course, "color":color}
            );
        }
    );
}

function parseInput(e) {
    var color = e.target.id === "courseName" ? e.target.backgroundColor
                                             : e.target.value;
    if (validateColor(color) === '') { return null; }
        
    var course = getValueOfInputID("courseName");
    setColorOfInputs(color);
    setCourseToColor(course, color);
};

function onDOMLoad() {
    for (var i = 0; i < inputElemIDs.length; i++) {
        var inputElem = document.getElementById(inputElemIDs[i]);
        inputElem.addEventListener("input", parseInput);
    }
}

document.addEventListener('DOMContentLoaded', onDOMLoad);
