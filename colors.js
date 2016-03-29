var getArrayOf = 
    function(s) { 
        return [].slice.call(document.getElementsByClassName('eventSaved')).
            filter(function(elem) { 
                return elem.tagName === "DIV" && elem.innerHTML === s 
                }) 
    }

var setColor = 
    function(s, color) {
        elems = getArrayOf(s);
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.backgroundColor = color;
        }
    }

var resetColor = function(s) { setColor(s, '#4f8edc') }

var removeFocus = function(s) { setColor(s, '#6faaff') }

var restoreFocus = resetColor

var strongFocus = function(s) { setColor(s, "#4f8e8c") }
