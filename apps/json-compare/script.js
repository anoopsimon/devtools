function compareJson() {
    var json1 = document.getElementById("json1").value;
    var json2 = document.getElementById("json2").value;
    var results = document.getElementById("results");
    var mismatches = {};

    try {
        var obj1 = JSON.parse(json1);
        var obj2 = JSON.parse(json2);

        compareObjects(obj1, obj2, mismatches, "");

        results.innerHTML = "<h3>Results:</h3>";
        if (Object.keys(mismatches).length === 0) {
            results.innerHTML += "<p>JSON files are matching.</p>";
        } else {
            displayTable("Mismatches", mismatches);
            highlightDifferences(obj1, obj2, mismatches);
        }
    } catch (e) {
        results.innerHTML = "<p>Error parsing JSON. Please check your input.</p>";
    }
}

function compareObjects(obj1, obj2, mismatches, path) {
    for (var key in obj1) {
        if (typeof obj1[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
            compareObjects(obj1[key], obj2[key], mismatches, path + key + ".");
        } else if (!obj2.hasOwnProperty(key)) {
            mismatches[path + key] = "Missing in JSON 2";
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            mismatches[path + key] = "Different values";
        }
    }

    for (var key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            mismatches[path + key] = "Missing in JSON 1";
        }
    }
}

function displayTable(title, data) {
    var results = document.getElementById("results");
    var tableHtml = "<h4>" + title + ":</h4><table><tr><th>Attribute</th><th>Description</th></tr>";
    for (var key in data) {
        tableHtml += "<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>";
    }
    tableHtml += "</table>";
    results.innerHTML += tableHtml;
}

function highlightDifferences(obj1, obj2, mismatches) {
    var jsonDisplay1 = document.getElementById("jsonDisplay1");
    var jsonDisplay2 = document.getElementById("jsonDisplay2");

    jsonDisplay1.innerHTML = syntaxHighlight(JSON.stringify(obj1, null, 2), mismatches, '1');
    jsonDisplay2.innerHTML = syntaxHighlight(JSON.stringify(obj2, null, 2), mismatches, '2');
}

function syntaxHighlight(json, mismatches, jsonNumber) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("[\w]+":\s*"[^"]*"|"[^"]*")|(\d+|\d+\.\d+)/g, function(match) {
        var path = getPathFromMatch(match);
        var style = mismatches.hasOwnProperty(path + jsonNumber) ? ' class="mismatch"' : '';
        return '<span' + style + '>' + match + '</span>';
    });
}

function getPathFromMatch(match) {
    var result = match.match(/"([\w]+)":/);
    return result ? result[1] : '';
}
