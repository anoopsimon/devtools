function syntaxHighlight(jsonObj) {
    var json = JSON.stringify(jsonObj, undefined, 4);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function(match) {
        var cls = 'json-value';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    // Split the string into lines and add line breaks
    var lines = json.split('\n');
    return lines.map(function(line) {
        // Replace leading spaces with non-breaking spaces for indentation
        var leadingSpace = line.match(/^(\s+)/);
        if (leadingSpace) {
            line = line.replace(/^\s+/, new Array(leadingSpace[0].length + 1).join('&nbsp;'));
        }
        return line;
    }).join('<br>');
}

document.getElementById('formatBtn').addEventListener('click', function() {
    try {
        var inputJSON = JSON.parse(document.getElementById('jsonInput').value);
        var formattedJSON = syntaxHighlight(inputJSON);
        document.getElementById('jsonOutput').innerHTML = formattedJSON;
    } catch (e) {
        alert('Invalid JSON');
    }
});


function showToast() {
    var toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}



document.getElementById('copyBtn').addEventListener('click', function() {
    var outputText = document.getElementById('jsonOutput').textContent;
    navigator.clipboard.writeText(outputText).then(() => {
        var toast = document.getElementById('toast');
        toast.style.visibility = 'visible';
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 2000);
    });
});
