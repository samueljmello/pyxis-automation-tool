var fs = require('fs');
var path = require('path');
var Client = require('ftp');

process.stdout.write('Connecting ftp... ');

var c = new Client();

c.connect({
  host: process.env.PYXIS_FTP_HOST,
  user: process.env.PYXIS_FTP_USER,
  password: process.env.PYXIS_FTP_PASS
});

c.on('error', function(err) {
  process.stdout.write('Error.\n');
});

var filesToDelete = [];
var filesToUpload = [];
var moveFrom = './dist';
var moveTo = process.env.PYXIS_FTP_DIR;

function uploadNewFiles() {
  fs.readdir(moveFrom, function (err, files) {
    filesToUpload = files.slice();
    if (filesToUpload.length > 0) {
      process.stdout.write('\nUploading files... \n\n');
      recursiveUpload();
    } else {
      process.stdout.write('\nNo files to upload. \n');
      c.end();
    }
  });
}

function recursiveUpload() {
  if (filesToUpload.length <= 0) {
    c.end();
    process.stdout.write('\nUploads complete.\n');
    return;
  }
  var fileToUpload = filesToUpload[0];
  process.stdout.write('Processing ' + fileToUpload + '... ');
  c.put(moveFrom + '/' + fileToUpload, moveTo + '/' + fileToUpload, false, function(error) {
    if (error) {
      process.stdout.write('failed.\n');
      c.end();
    } else {
      process.stdout.write('finished!\n');
      filesToUpload.splice(0,1);
      recursiveUpload();
    }
  })
}

function recursiveDelete() {
  if (filesToDelete.length <= 0) {
    uploadNewFiles();
    return;
  }
  var fileToDelete = filesToDelete[0];
  if (fileToDelete.type === '-' && fileToDelete.name !== undefined) {
    c.delete(moveTo + '/' + fileToDelete.name, function(err) {
      if (err) {
        process.stdout.write('Deleting ' + fileToDelete.name + ' failed. Aborting.\n');
        c.end();
      } else {
        process.stdout.write('Deleting ' + fileToDelete.name + ' succeeded!.\n');
        filesToDelete.splice(0,1);
        recursiveDelete();
      }
    });
  } else {
    process.stdout.write('Deleting file failed. Aborting.\n');
    console.log(fileToDelete);
    c.end();
  }
}

c.on('ready', function () {

  process.stdout.write('connected.\n\n');
  process.stdout.write('Getting FTP directory contents... ');

  // get directory contents
  c.list(process.env.PYXIS_FTP_DIR, false, function(err, list) {
    if (err) {
      process.stdout.write(' failed. Aborting.\n');
      c.end();
    } else {
      process.stdout.write(list.length + ' records found.\n');
    }
    
    filesToDelete = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].type === '-') {
        filesToDelete.push(list[i]);
      }
    }
    
    if (filesToDelete.length > 0) {
      process.stdout.write('\nDeleting old files... \n\n');
      recursiveDelete();
    } else {
      process.stdout.write('\nNo files to delete.\n');
      uploadNewFiles();
    }
  
  });

});
