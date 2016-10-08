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
					app.showStatus("Successful file write... : " + filepath);
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
	
	downloadZip: function()
	{
		var filename = "clientpack.zip";
		var xhr = new XMLHttpRequest();
		xhr.open('GET', appContext.clientPackURL, true);
		xhr.responseType = 'blob';

		xhr.onload = function() 
		{
			if (this.status == 200) 
			{
				var blob = new Blob([this.response], { type: 'application/zip' });
				fileUtil.writeFile( appContext.natDataFolder, "hailey", filename, blob, false, function (filename)
				{
					app.showStatus("Download Completed : " + filename + "-->" + appContext.natDataFolder + "hailey/");
					$("#progressbar").show();
					zip.unzip(filename, appContext.natDataFolder + "hailey/", function(result)
					{
						app.showStatus("Unzip Result : " + result);	
						setTimeout(function (){$("#progressbar").hide();}, 2000);
					}, progressCallback);
				});
			}
			else
			{
				app.showStatus("Fail to Download");
			}
		};
		xhr.send();
	},

	downloadTripsConfig: function(cb)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', appContext.tripsConfigURL, true);
		xhr.responseType = 'text/plain';

		xhr.onload = function() 
		{
			if (this.status == 200) 
			{
				var blob = new Blob([this.response], { type: 'text/plain' });
				fileUtil.writeFile( appContext.natDataFolder, "hailey", appContext.tripsConfig, blob, false, function (filename)
				{
					app.showStatus("Download Completed : " +  appContext.tripsConfig);
					cb({value : true});
				});
			}
			else
			{
				app.showStatus("Fail to Download Trip Config");
				cb({value : false});
			}
		};
		xhr.send();
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