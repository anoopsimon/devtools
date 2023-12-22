document.getElementById("generateJSONPaths").addEventListener("click", function() {
    var jsonInput = document.getElementById("jsonInput").value;
    try {
        var jsonData = JSON.parse(jsonInput);
        clearTable(); // Clear previous results
        generatePaths(jsonData, '$');
        document.getElementById("resultTable").style.display = "table"; // Show table
    } catch (e) {
        alert("Invalid JSON");
    }
});

function generatePaths(obj, currentPath) {
    if (typeof obj === 'object' && obj !== null) {
        var type = Array.isArray(obj) ? 'Array' : 'Object';
        addToTable(currentPath, type, ""); // Add path for the object/array itself
        for (var key in obj) {
            var newPath = Array.isArray(obj) ? `${currentPath}[${key}]` : `${currentPath}.${key}`;
            generatePaths(obj[key], newPath);
        }
    } else {
        addToTable(currentPath, 'Value', obj);
    }
}

function addToTable(path, type, value) {
    var table = document.getElementById("resultTable");
    var newRow = table.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    cell1.innerHTML = path;
    cell2.innerHTML = type;
    cell3.innerHTML = (typeof value === 'string' || typeof value === 'number') ? value : JSON.stringify(value);
 // Make path copyable
 cell1.innerHTML = `<span class='copyable' onclick='copyToClipboard("${path}")' title='Click to copy'>${path}</span>`;
 cell2.innerHTML = type;
 cell3.innerHTML = (typeof value === 'string' || typeof value === 'number') ? value : JSON.stringify(value);
}

function clearTable() {
    var table = document.getElementById("resultTable");
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast();
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
}

function showToast() {
    var toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(function() { 
        toast.classList.remove("show"); 
    }, 5000); // Duration set to 5000 milliseconds (5
}

