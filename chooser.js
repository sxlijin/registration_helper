// CSS IDs of <input> elems to listen for input on
var inputElemIDs = ["colorPalette", "colorValue", "courseName"];

function getInputElementById(id) 
    { return document.querySelector(`input#${id}`); }

function getValueOfInputID(id) { return getInputElementById(id).value; }

function setValueOfInputID(id, val) { getInputElementById(id).value = val; }

function setColorOfInputs(color) {
    getInputElementById(inputElemIDs[0]).style.value = color;
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
    var color = e.target.value;
    if (e.target.id === "colorPalette") {
        setValueOfInputID("colorValue", color);
    }
    else if (e.target.id === "colorValue") {
        setValueOfInputID("colorPalette", color);
    }
    else {
        color = getValueOfInputID("colorPalette");
    }
        
    var course = getValueOfInputID("courseName");
    //console.log(color);
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
