// https://stackoverflow.com/a/30810322


export function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
}


function fallbackCopyToClipboard(text) {
    var textArea = document.createElement('textarea');
    var consolePrepend = 'Fallback method is used to copy to clipboard.\nResult: ';
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'success.' : 'function is executed without errors, but it returned bad result.';
        console.log(consolePrepend + msg);
    }
    catch (err) {
        console.error(consolePrepend + 'failed.', err);
    }

    document.body.removeChild(textArea);
}