// js_clipboard by liledix4 – https://github.com/liledix4/js_clipboard
// v0.1.1
// Modified from: https://stackoverflow.com/a/30810322


export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text);
}


async function fallbackCopyToClipboard(text) {
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


export async function copyFromSpecificSelectedElement(copyFullTextFrom, expectedSelectedElement, callbackFull, callbackSelection) {
  if (expectedSelectedElement.constructor.name !== 'String') {
    const eseClassesSrc = expectedSelectedElement.classList.value;
    const eseID = expectedSelectedElement.getAttribute('id');
    const eseTag = expectedSelectedElement.tagName;
    let eseClasses;
    if (eseClassesSrc !== '')
      eseClasses = '.' + eseClassesSrc.replace(/\s+/g, '.');
    if (eseID)
      expectedSelectedElement = '#' + eseID;
    else if (eseClasses)
      expectedSelectedElement = eseClasses;
    else
      expectedSelectedElement = eseTag;
  }

  const selection = getSelection();
  const selectionType = selection.type;
  const node = selection.anchorNode;
  let parentElement;

  if (node) {
    const nodeType = node.constructor.name;
    if (nodeType === 'Text') {
      parentElement = node.parentElement.closest(expectedSelectedElement);
    }
    else if (nodeType.match(/^HTML.*Element$/)) {
      parentElement = node.closest(expectedSelectedElement);
    }
  }

  const selectionCondition = selectionType === 'Range' && parentElement !== undefined && parentElement !== null;

  if (selectionCondition) {
    copyToClipboard( getSelection().toString() );
    callbackSelection();
  }
  else {
    copyToClipboard(copyFullTextFrom);
    callbackFull();
  }
}