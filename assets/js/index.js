const fileInput = document.getElementById('fileInput'),
      inputFileLabel = document.getElementById('inputFileLabel'),
      inputText = document.getElementById('inputText'),
      convertOption1 = document.getElementById('convertOption1'),
      convertOption2 = document.getElementById('convertOption2'),
      outputText = document.getElementById('outputText'),
      emptyOutputIcon = document.getElementById('emptyOutputIcon'),
      alertElement = document.getElementById('alertElement'),
      alertIcon = document.getElementById('alertIcon'),
      alertContent = document.getElementById('alertContent'),
      JSON_TYPE = 'application/json',
      CSV_TYPE = 'text/csv',
      MSG_INVALID_CONTENT = 'Invalid content!',
      MSG_DOWNLOAD_SUCCESS = 'Dowload completed!',
      MSG_INVALID_FILE = 'Invalid file format!',
      UPLOAD_FILE_LABEL = 'OR UPLOAD FILE';

var fileContent = '',
    fileFinalType = '';

fileInput.addEventListener('change', handleInputFileChange);

function handleUploadButton() {
  fileInput.click();
}

function showUpConvertResult({ outputResult, type }) {
  // shows up result
  outputText.innerHTML = outputResult;
  toggleHighlightFromType(type);

  if (outputText.classList.contains('d-none'))
    toggleView([ emptyOutputIcon, outputText ]);
}

function handleConvert(target) {
  const fileContent = String(inputText.value).trim();
  const type = target === 'csv' ? JSON_TYPE : CSV_TYPE;
  fileFinalType = type;

  if (!fileContent.length) return;
  
  if (!validateContent(fileContent, type)) {
    clearFields();
    return toggleAlert({ text: MSG_INVALID_CONTENT });
  }

  const outputResult = convertFileContent(fileContent, type);
  
  showUpConvertResult({ outputResult, type });
}

function handleSaveFile() {
  const outputValue = String(outputText.value).trim();

  if (!outputValue.length) return;
  
  // download file type
  fileFinalType = fileFinalType === CSV_TYPE ? JSON_TYPE : CSV_TYPE;

  const type = `${fileFinalType};charset=utf-8`,
        fileExtension = fileFinalType.split('/')[1],
        fileName = `JSVConverter.${fileExtension}`,
        blob = new Blob([outputValue], { type }),
        a = document.createElement('a'),
        url = URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  toggleAlert({ text: MSG_DOWNLOAD_SUCCESS, type: 'success' });
  // clearFields();

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
  // set target type to download file
  fileFinalType = type;
  
  inputFileLabel.innerHTML = String(name).toUpperCase();
  
  await readFileAndStoreContent(file);

  if (!validateContent(fileContent, type)) {
    clearFields();
    return toggleAlert({ text: MSG_INVALID_FILE })
  }
  
  // shows up the file content
  inputText.value = fileContent;

  const outputResult = convertFileContent(fileContent, type);
  
  showUpConvertResult({ outputResult, type });
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

function toggleView(element) {
  const toggleElement = Array.isArray(element) ? element : [element];

  toggleElement.forEach(element => element.classList.toggle('d-none'));
}

function clearFields({ clearInputText } = false) {
  if (clearInputText) inputText.value = '';
  inputFileLabel.innerHTML = UPLOAD_FILE_LABEL;
  outputText.innerHTML = '';
  outputText.classList.add('d-none');
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');
  emptyOutputIcon.classList.remove('d-none');
  fileInput.value = null;
}

function toggleHighlightFromType(fileType) {
  convertOption1.classList.remove('highlight');
  convertOption2.classList.remove('highlight');

  if (fileType === JSON_TYPE)
    return convertOption1.classList.add('highlight');
  else if (fileType === CSV_TYPE)
    return convertOption2.classList.add('highlight');
}

function toggleAlert({ text, icon = 'fas fa-exclamation-circle', type = 'warning' }) {
  alertElement.classList.remove('alert_success');
  alertElement.classList.remove('alert_warning');

  alertContent.innerText = text;
  alertElement.classList.add(`alert_${type}`);
  alertElement.classList.toggle('alert_none');
}