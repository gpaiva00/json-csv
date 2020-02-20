function validateJson(fileContent) {
  return /^[\],:{}\s]*$/.test(fileContent.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))

  // JSON.parse(fileContent);
}

function validateCsv(fileContent) {
  return true;
}