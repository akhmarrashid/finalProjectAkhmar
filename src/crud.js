const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

var makeupinput = document.getElementById('makeupinput');

// Directory for storing files
var pathName = path.join(__dirname, 'Files')

function getFileName(makeup) {
  return makeup + '.txt';
}

document.getElementById('btnCreate').addEventListener('click', function () {
  var makeup = makeupinput.value.trim();
  if (makeup) {
    var fileName = getFileName(makeup);
    var file = path.join(pathName, fileName);
    fs.writeFile(file, makeup, function (err) {
      if (err) {
        alert('An error occurred: ' + err.message);
        return console.log(err);
      }
      alert(`"${makeup}" was added to favorite`);
      makeupinput.value = '';
      displayMakeup(); // Call the function to display
    });
  }
});

// Function to display
function displayMakeup() {
    var makeuplist = document.getElementById('makeuplist');
    makeuplist.innerHTML = ''; // Clear the existing list
  
    // Read all files in the directory
    fs.readdir(pathName, function (err, files) {
      if (err) {
        return console.log(err);
      }
  
      // Loop through the files and add them to the list
      files.slice(0, 5).forEach(function (file) {
        var makeup = file.slice(0, -4); // Convert filename back
        var listItem = document.createElement('li');
  
        // Create a separate span element for the text content
        var textContent = document.createElement('span');
        textContent.textContent = makeup;
  
        // Make the list item editable
        listItem.contentEditable = true;
  
        // Create a container for buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
  
        var updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', function () {
          updateMakeup(makeup, listItem.textContent);
        });
  
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteMakeup(makeup);
        });
  
        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(deleteButton);
  
        listItem.appendChild(textContent); // Append the text content to the list item
        makeuplist.appendChild(listItem);
        
        // Append the button container outside the list item
        makeuplist.appendChild(buttonContainer);
      });
    });
}
  
function updateMakeup(oldMakeup, newMakeup) {
    var oldFileName = getFileName(oldMakeup);
    var newFileName = getFileName(newMakeup);
  
    var oldFilePath = path.join(pathName, oldFileName);
    var newFilePath = path.join(pathName, newFileName);
  
    fs.stat(newFilePath, function (err, stat) {
      if (!err) {
        alert(`"${newMakeup}" already exists. Please choose a different name.`);
        displayMakeup();
        return;
      }
  
      fs.rename(oldFilePath, newFilePath, function (renameErr) {
        if (renameErr) {
          alert('An error occurred while updating the file: ' + renameErr.message);
          return console.log(renameErr);
        }
  
        alert(`"${oldMakeup}" was updated to "${newMakeup}"`);
        displayMakeup(); // Refresh list after updating
      });
    });
}

function deleteMakeup(makeup) {
  var fileName = getFileName(makeup)
  var file = path.join(pathName, fileName)
  fs.unlink(file, function (err) {
    if (err) {
      alert('An error occurred: ' + err.message)
      return console.log(err)
    }
    alert(`"${makeup}" was deleted`)
    displayMakeup() // Refresh list after deleting
  })
}


displayMakeup()