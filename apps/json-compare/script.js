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

function highlightDifferences(obj1, obj2, mismatches) {
    var jsonDisplay1 = document.getElementById("jsonDisplay1");
    var jsonDisplay2 = document.getElementById("jsonDisplay2");

    jsonDisplay1.innerHTML = syntaxHighlight(JSON.stringify(obj1, null, 2));
    jsonDisplay2.innerHTML = syntaxHighlight(JSON.stringify(obj2, null, 2));
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/"__mismatch":\s*"([^"]+)"/g, function(match, p1) {
        return `<span class="mismatch">"${p1}"</span>`;
    });
}

function compareObjects(obj1, obj2, mismatches, path) {
    for (var key in obj1) {
        if (!obj2.hasOwnProperty(key)) {
            mismatches[path + key] = "Attribute missing in JSON 2";
            obj1[key] = { __mismatch: obj1[key] };
        } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            if (typeof obj2[key] === 'object' && obj2[key] !== null) {
                compareObjects(obj1[key], obj2[key], mismatches, path + key + ".");
            } else {
                mismatches[path + key] = "Different types";
                obj1[key] = { __mismatch: obj1[key] };
            }
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            mismatches[path + key] = "Different values";
            obj1[key] = { __mismatch: obj1[key] };
        }
    }

    for (var key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            mismatches[path + key] = "Attribute missing in JSON 1";
            obj2[key] = { __mismatch: obj2[key] };
        }
    }
}

function displayTable(title, data) {
    var results = document.getElementById("results");
    var tableHtml = "<h4>" + title + ":</h4><table><tr><th>Attribute</th><th>Comments</th></tr>";
    for (var key in data) {
        tableHtml += "<tr><td>" + key + "</td><td style=\" color:red\">" + data[key] + "</td></tr>";
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
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/"__mismatch":\s*({\s*")([^"]+)("}|")/g, function(match, p1, p2, p3) {
        return `"__mismatch": ${p1}<span class="mismatch">${p2}</span>${p3}`;
    });
}


function getPath(key, jsonNumber, offset, json) {
    var path = '';
    var inString = false;
    var stack = [];

    for (var i = offset - 1; i >= 0; i--) {
        if (json[i] === '"') inString = !inString;

        if (!inString) {
            if (json[i] === '{') {
                if (stack.length === 0) break;
                stack.pop();
            } else if (json[i] === '}') {
                stack.push('}');
            }
        }
    }

    if (i > 0) {
        var partialJson = json.substring(0, i);
        var regex = /"(\w+)":\s*{/g;
        var match;
        while ((match = regex.exec(partialJson)) !== null) {
            stack.push(match[1]);
        }
    }

    while (stack.length) {
        path = stack.pop() + (path ? '.' + path : '');
    }

    return path ? path + '.' + key : key;
}


function getPathFromMatch(match) {
    var result = match.match(/"([\w]+)":/);
    return result ? result[1] : '';
}
