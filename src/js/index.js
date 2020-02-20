const fileInput = document.getElementById('fileInput');
const inputFileLabel = document.getElementById('inputFileLabel');
const inputText = document.getElementById('inputText');
const convertOption1 = document.getElementById('convertOption1');
const convertOption2 = document.getElementById('convertOption2');
const outputText = document.getElementById('outputText');
const emptyOutputIcon = document.getElementById('emptyOutputIcon');

var fileContent = '';

fileInput.addEventListener('change', handleInputFileChange);

function handleUploadButton() {
  fileInput.click();
}

async function handleInputFileChange(evt) {
  const file = evt.target.files[0];
  const { name, type } = file;
  
  // show file name
  inputFileLabel.innerHTML = String(name).toUpperCase();
  
  await readFileAndStoreContent(file);

  if (!validateContent(fileContent, type)) {
    clearFields();
    return console.error('Arquivo inválido!');
  }
  
  // shows up the file content
  inputText.innerHTML = fileContent;

  const outputResult = convertFileContent(fileContent, type);
  
  // shows up result
  outputText.innerHTML = outputResult;
  toggleHighlightFromType(type)

  if (outputText.classList.contains('d-none'))
    toggleView([emptyOutputIcon, outputText]);
}

function convertFileContent(fileContent, fileType) {
  if (fileType === 'application/json') return convertToCsv(fileContent);
  else if (fileType === 'text/csv') return convertToJson(fileContent);
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

function validateContent(fileContent, fileType) {
  // must return if its true and file type to convert automatically
  if(fileType === 'application/json') return validateJson(fileContent);
  else if(fileType === 'text/csv') return validateCsv(fileContent);
}

function toggleView(element) {
  const toggleElement = Array.isArray(element) ? element : [element];

  toggleElement.forEach(element => element.classList.toggle('d-none'));
}

function clearFields() {
  inputFileLabel.innerHTML = 'OU SUBA UM ARQUIVO';
  inputText.innerHTML = '';
  outputText.innerHTML = '';
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');

  toggleView([outputText, emptyOutputIcon]);
}

function toggleHighlightFromType(fileType) {
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');

  if (fileType === 'application/json')
    return convertOption1.classList.add('highlight');
  else if (fileType === 'text/csv')
    return convertOption2.classList.add('highlight');
}