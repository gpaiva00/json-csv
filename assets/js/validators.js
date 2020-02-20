// main function
function validateContent(fileContent, fileType) {
  if(fileType === JSON_TYPE) return validateJson(fileContent);
  else if(fileType === CSV_TYPE) return validateCsv(fileContent);
}

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

}

// TODO: improve csv validation
function validateCsv(fileContent) {
  fileContent = fileContent.split(',');
  
  if (!fileContent) return false;

  for(var i=0;i<fileContent.length;i++) {
    const item = String(fileContent[i]).trim();
    
    if(!item.length) return false;
  }
  
  return true; 
}