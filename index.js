const fileInput = document.getElementById('fileInput');
const inputFileLabel = document.getElementById('inputFileLabel');
const inputText = document.getElementById('inputText');
const convertOption1 = document.getElementById('convertOption1');
const convertOption2 = document.getElementById('convertOption2');
const outputText = document.getElementById('outputText');

var fileContent = '';

fileInput.addEventListener('change', handleInputFileChange);

function handleUploadButton() {
  fileInput.click();
}

async function handleInputFileChange(evt) {
  const file = evt.target.files[0];
  const { name, type } = file;
  
  inputFileLabel.innerHTML = String(name).toUpperCase();
  
  await readFileAndStoreContent(file);

  if (!validateFileContent(fileContent, type))
   return console.error('Arquivo inválido!');
  
   // shows up the file content
  inputText.innerHTML = fileContent;

  const outputText = convertFileContent(fileContent, type);

  outputText.innerHTML = outputText;

}

function convertFileContent(fileContent, fileType) {
  if (fileType === 'application/json') return convertToCsv(fileContent);
  else if (fileType === 'application/csv') return convertToJson(fileContent);
}

function readFileAndStoreContent(file) {
  const fileReader = new FileReader();
  return new Promise(function(resolve, reject) {
    fileReader.addEventListener('load', function(e) {
      fileContent = e.target.result;
      resolve();
    });
  
    fileReader.readAsText(file);
  });
}

function validateFileContent(fileContent, fileType) {
  // console.log('fileType', fileType);
  
  // must return if its true and file type to convert automatically
  if(fileType === 'application/json') return validateJson(fileContent);
  else if(fileType === 'application/csv') return validateCsv(fileContent);
}

function validateJson(fileContent) {
  return /^[\],:{}\s]*$/.test(fileContent.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))

  // JSON.parse(fileContent);
}

function convertToCsv(fileContent) {
  const jsonParse = typeof fileContent != 'object' ? JSON.parse(fileContent) : fileContent;
  var array = Array.isArray(jsonParse) ? jsonParse : [jsonParse];
  
  // labels on fist line
  var head = array[0];
  var str = '';
  var line = '';
    
  /**
   * if to wrap values with quotes
   * for (var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
    }
  */

  for (var index in array[0]) {
    line += index + ',';
  }

  line = line.slice(0, -1);
  str += line + '\r\n';

  for (var i = 0; i < array.length; i++) {
      var line = '';

      /** 
       * if to wrap values with quotes
          for (var index in array[i]) {
              var value = array[i][index] + "";
              line += '"' + value.replace(/"/g, '""') + '",';
          }
      } */

      for (var index in array[i]) {
        line += array[i][index] + ',';
      }

      line = line.slice(0, -1);
      str += line + '\r\n';
  }
  
  console.log(str);
    
  return str;
}