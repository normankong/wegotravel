var fileUtil = {

	// Create the File witout Writting any content
	touchFile : function(rootDir, subDir, file, cb)
	{
		if (typeof rootDir === "string")
		{
			window.resolveLocalFileSystemURL(rootDir, function (dirEntry)
			{
				dirEntry.getDirectory(subDir, { create: true, exclusive: false }, function (subDirEntry)
				{
					fileUtil.createFile(subDirEntry, file, cb);
				});
			},
			errorHandler.bind(null, rootDir)
			);
		}
		else
		{
			rootDirEntry.getDirectory(subDir, function (dirEntry)
			{
				dirEntry.getDirectory(subDir, { create: true, exclusive: false }, function (subDirEntry)
				{
					fileUtil.createFile(subDirEntry, file, cb);
				});
			});
		}
	},

	// Create the File
	createFile: function (dirEntry, fileName, cb)
	{
		dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry)
		{
			cb(fileEntry);
		});
	},

  writeFile: function(folder, subDir, filename, dataObj, isAppend, cb)
	{
		fileUtil.touchFile(folder, subDir, filename, function (fileEntry)
		{
			fileEntry.createWriter(function (fileWriter)
			{
				fileWriter.onwriteend = function()
				{
					var filepath = folder+"/"+subDir+"/"+filename;
					app.showStatus("Successful file write... : \n" + filepath);
					cb(filepath);
				};

				fileWriter.onerror = function (e)
				{
					app.showStatus("Failed file read: " + e.toString());
				};

				// If we are appending data to file, go to the end of the file.
				if (isAppend)
				{
					try
					{
						fileWriter.seek(fileWriter.length);
					}
					catch (e)
					{
						app.showStatus("file doesn't exist!");
					}
				}
				fileWriter.write(dataObj);
			});
		});
	},

	refreshTripsPack: function()
	{
		var filename = appContextHelper.getTripsPackFile();
		var tripsPackURL =  appContextHelper.getTripsPackURL();
		var cdvDataFolder = appContextHelper.getCdvDataFolder();
		var applicationFolder =  appContextHelper.getApplicationFolder();

		var xhr = new XMLHttpRequest();
		xhr.open('GET',tripsPackURL , true);
		xhr.responseType = 'blob';
		xhr.onload = function()
		{
			if (this.status == 200)
			{
				var blob = new Blob([this.response], { type: 'application/zip' });
				fileUtil.writeFile( cdvDataFolder, applicationFolder, filename, blob, false, function (filename)
				{
					app.showStatus("Download Completed : " + filename + "-->" + cdvDataFolder + applicationFolder + "/" + filename);
					$("#progressbar").show();
					zip.unzip(filename, cdvDataFolder + applicationFolder + "/", function(result)
					{
						app.showStatus("Unzip Result : " + result);
						alert("Trips Pack Refresh completed");
						setTimeout(function (){$("#progressbar").hide();}, 2000);
					}, progressCallback);
				});
			}
			else
			{
				app.showStatus("Fail to Download" + tripsPackURL);
			}
		};
		xhr.send();
	},

	refreshTripsConfig: function(uri, fileURL, cb)
	{
		(new FileTransfer()).download(uri,fileURL,
			function(entry)
			{
				console.log("download complete: " + entry.toURL());
				cb({value : true,  entry : entry});
			},
			function(error)
			{
				cb({value : false, error : error});
			}
		);
	},

	// Check File Exist or nto
	checkIfFileExists: function(path, cb)
	{
			window.resolveLocalFileSystemURL(path, function (){cb({value : true});},  function () {cb({value : false});});
	}
};

var progressCallback = function(progressEvent)
{
    $("#progressbar" ).progressbar({"value" : Math.round(progressEvent.loaded / progressEvent.total * 100)});
};

var errorHandler = function (fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    }

    alert('Error (' + fileName + '): ' + msg);
};
