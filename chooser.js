// CSS IDs of <input> elems to listen for input on
var inputElemIDs = ["colorPalette", "colorValue", "courseName"];

function getInputElementById(id) 
    { return document.querySelector(`input#${id}`); }

function getValueOfInputID(id) { return getInputElementById(id).value; }

function setValueOfInputID(id, val) { getInputElementById(id).value = val; }

function setColorOfInputs(color) {
    if (validateColor(color) === '') { return null; }
    setValueOfInputID(inputElemIDs[0], colorToHex(color));
    setValueOfInputID(inputElemIDs[1], colorToHex(color));

    getInputElementById(inputElemIDs[1]).style.backgroundColor = color;
    getInputElementById(inputElemIDs[2]).style.backgroundColor = color;
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
    var color = e.target.id === "courseName" ? e.target.style.backgroundColor
                                             : e.target.value;
    if (validateColor(color) === '') { return null; }
        
    console.log(color);
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
