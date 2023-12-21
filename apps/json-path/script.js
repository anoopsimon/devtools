document.getElementById("generateJSONPaths").addEventListener("click", function() {
    var jsonInput = document.getElementById("jsonInput").value;
    try {
        var jsonData = JSON.parse(jsonInput);
        generatePaths(jsonData, '$'); // Start with the root symbol '$'
    } catch (e) {
        alert("Invalid JSON");
    }
});

function generatePaths(obj, currentPath) {
    if (typeof obj === 'object' && obj !== null) {
        for (var key in obj) {
            // For arrays, use the index in the path; for objects, use the key
            var newPath = Array.isArray(obj) ? `${currentPath}[${key}]` : `${currentPath}.${key}`;
            generatePaths(obj[key], newPath);
        }
    } else {
        addToTable(currentPath, obj);
    }
}

function addToTable(path, node) {
    var table = document.getElementById("resultTable");
    var newRow = table.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.innerHTML = path;
    cell2.innerHTML = JSON.stringify(node);
}
