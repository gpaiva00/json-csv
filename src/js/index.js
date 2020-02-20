const fileInput = document.getElementById('fileInput');
const inputFileLabel = document.getElementById('inputFileLabel');
const inputText = document.getElementById('inputText');
const convertOption1 = document.getElementById('convertOption1');
const convertOption2 = document.getElementById('convertOption2');
const outputText = document.getElementById('outputText');
const emptyOutputIcon = document.getElementById('emptyOutputIcon');

var fileContent = '';
var fileFinalType = '';

fileInput.addEventListener('change', handleInputFileChange);

function handleUploadButton() {
  fileInput.click();
}

function handleConvert(target) {
  const fileContent = String(inputText.value).trim();
  const type = target === 'csv' ? 'application/json' : 'text/csv';
  fileFinalType = type;

  if (!fileContent.length) return;
  
  if (!validateContent(fileContent, type)) {
    clearFields();
    return console.error('Conteúdo inválido!');
  }

  const outputResult = convertFileContent(fileContent, type);
  
  // shows up result
  outputText.innerHTML = outputResult;
  toggleHighlightFromType(type);

  if (outputText.classList.contains('d-none'))
    toggleView([emptyOutputIcon, outputText]);
}

function handleSaveFile() {
  const outputValue = String(outputText.value).trim();

  if (!outputValue.length) return;

  fileFinalType = fileFinalType === 'text/csv' ? 'application/json' : 'text/csv';

  const type = `${fileFinalType};charset=utf-8`;
  const fileExtension = fileFinalType.split('/')[1];
  const fileName = `JSVConverter.${fileExtension}`;
  
  const blob = new Blob([outputValue], { type });
  // saveAs(blob, fileName);

  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0)
}

function handleCopyToClipboard() {
  const textarea = document.createElement('textarea');
  textarea.value = String(outputText.value).trim();
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);  
}

async function handleInputFileChange(evt) {
  const file = evt.target.files[0];

  if (!file) return;

  const { name, type } = file;

  fileFinalType = type;
  
  // show file name
  inputFileLabel.innerHTML = String(name).toUpperCase();
  
  await readFileAndStoreContent(file);

  if (!validateContent(fileContent, type)) {
    clearFields();
    return console.error('Arquivo inválido!');
  }
  
  // shows up the file content
  inputText.value = fileContent;

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
      fileContent = String(e.target.result).trim();
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
  inputText.value = '';
  // inputText.innerHTML = '';
  outputText.innerHTML = '';
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');
  outputText.classList.add('d-none');
  emptyOutputIcon.classList.remove('d-none');

  // toggleView([outputText, emptyOutputIcon]);
}

function toggleHighlightFromType(fileType) {
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');

  if (fileType === 'application/json')
    return convertOption1.classList.add('highlight');
  else if (fileType === 'text/csv')
    return convertOption2.classList.add('highlight');
}