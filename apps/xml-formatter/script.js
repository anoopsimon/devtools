document.getElementById('formatBtn').addEventListener('click', function() {
    try {
        var inputXML = document.getElementById('xmlInput').value;
        var formattedXML = formatXML(inputXML);
        document.getElementById('xmlOutput').textContent = formattedXML;
    } catch (e) {
        alert('Invalid XML');
    }
});

document.getElementById('copyBtn').addEventListener('click', function() {
    var outputText = document.getElementById('xmlOutput').textContent;
    navigator.clipboard.writeText(outputText).then(() => {
        var toast = document.getElementById('toast');
        toast.style.visibility = 'visible';
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 2000);
    });
});

function formatXML(inputXML) {
    var xmlString = inputXML.replace(/\n/g, '').replace(/>\s*</g, '><'); // Remove newlines and spaces between tags
    var formattedXML = '';

    // Add newline after each closing or self-closing tag (except the last tag)
    xmlString = xmlString.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
    
    // Add indentation
    var pad = 0;
    jQuery.each(xmlString.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match(/^<\/\w/)) {
            pad -= 1; // Decrease indentation
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1; // Increase indentation
        } else if (node.match(/^<\w[^>]*\/>.*$/)) {
            // No change in indentation for self-closing elements
        }

        var padding = new Array(pad + 1).join('  ');
        formattedXML += padding + node + '\r\n';
        pad += indent;
    });

    return formattedXML;
}

document.getElementById('formatBtn').addEventListener('click', function() {
    var inputXML = document.getElementById('xmlInput').value;
    var formattedXML = formatXML(inputXML);
    document.getElementById('xmlOutput').textContent = formattedXML;
});
