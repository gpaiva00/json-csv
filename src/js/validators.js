function validateJson(fileContent) {
  try {
    JSON.parse(fileContent);
    return true;
  } catch (error) {
    return false;
  }
  return /^[\],:{}\s]*$/.test(fileContent.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))

  // JSON.parse(fileContent);
}

function validateCsv(fileContent) {
  return true;
}