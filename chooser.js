// CSS IDs of <input> elems to listen for input on
var inputElemIDs = ["colorPalette", "colorValue", "courseName"];

var clearInput = function(e) { e.target.value = ""; };

var getInputElementById = 
    function(id) { return document.querySelector(`input#${id}`); };

var getValueOfInputID = 
    function(id) { return getInputElementById(id).value; };

var setValueOfInputID = 
    function(id, val) { getInputElementById(id).value = val; };

var setColorOfInputs = 
    function(color) {
        getInputElementById(inputElemIDs[0]).style.value = color;
        for (var i = 1; i < inputElemIDs.length; i++) {
            getInputElementById(inputElemIDs[i]).style.backgroundColor = color;
        }
    };

var setCourseToColor =
    function(course, color) {
        chrome.tabs.query(
            {active: true, currentWindow: true}, 
            function(tabs) {
                //console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id, 
                    {"courseName":course, "color":color}
                    //function(response) { console.log(response); }
                );
            }
        );
    };

var parseInput = 
    function(e) {
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

var onDOMLoad = 
    function() {
        for (var i = 0; i < inputElemIDs.length; i++) {
            var inputElem = document.getElementById(inputElemIDs[i]);
            inputElem.addEventListener("input", parseInput);
        }
    }

document.addEventListener('DOMContentLoaded', onDOMLoad);
