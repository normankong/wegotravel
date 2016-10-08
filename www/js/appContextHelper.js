/*jshint sub:true*/

var appContextHelper =
{
	appContext : null,
	appContextURL  : "js/appContext.json",
	tripsConfigURL : "js/trips_config.json",

	// Initialization
	initialize : function(cb)
	{
		this.loadJSON(this.appContextURL, function(result)
		{
				appContextHelper._setAppContext(result);

				// Initialze the App Native Data Folder after Device is ready
				var path = (cordova.platformId === "browser") ? cordova.file.cacheDirectory:cordova.file.externalRootDirectory ;
				appContextHelper.setNatDataFolder(path);
	      window.resolveLocalFileSystemURL(path, function(entry)
				{
					appContextHelper.setCdvDataFolder(entry.toInternalURL());

					// Check the Trips Config
					fileUtil.checkIfFileExists(appContextHelper.getTripsConfigFileURL(), function(isExist)
					{
						var url = (isExist.value) ? appContextHelper.getTripsConfigFileURL() : this.appContextHelper.tripsConfigURL;
						appContextHelper.loadJSON(url, function(result)
						{
							this.appContextHelper.setTripsConfig(result);
							cb();
						});
					});
				}, errorHandler.bind(null, path));
		});
	},

	setTripConfig : function(config)			{	this.appContext.tripConfig = config;	},
	getTripConfig : function()						{	return this.appContext.tripConfig;		},

	getTripsConfig: function()						{	return this.appContext.tripsConfig;		},
	setTripsConfig: function(config)			{	this.appContext.tripsConfig = config;	},

	setNetworkStatus: function(status)		{	this.networkStatus = status;					},
	getNetworkStatus: function()				  { return this.networkStatus;						},

	setCdvDataFolder : function(path)			{	this.appContext.cdvDataFolder = path;	},
	getCdvDataFolder : function ()				{	return this.appContext.cdvDataFolder;	},

	setNatDataFolder : function (path)		{	this.appContext.natDataFolder = path;	},
	getNatDataFolder : function ()				{	return this.appContext.natDataFolder;	},

  // Private Method
	_setAppContext: function(context)			{	this.appContext = context;	          },

  // Read only Property
	getAppURL				 : function() 				{ return this.appContext.appURL;       	},
	getApplicationFolder : function()     { return this.appContext.applicationFolder;},
	isVerbose: function()                 { return this.isVerbose;},
	getSplashTitle   : function()         { return this.appContext.splashTitle;   },
	getSplashMessage : function()         { return this.appContext.splashMessage; },
	getSplashImage   : function()         { return this.appContext.splashImage;   },

  getTripsConfigURL: function()         { return this.appContext.tripsConfigURL;},
  getTripsConfigFileURL: function()     { return this.appContext.cdvDataFolder + this.appContext.applicationFolder + "/" + this.appContext.tripsConfigFile;},
  getTripsConfigFile: function()        { return this.appContext.tripsConfigFile;},

	getTripsPackURL: function()            { return this.appContext.tripsPackURL;},
  getTripsPackFileURL: function()        { return this.appContext.cdvDataFolder + this.appContext.applicationFolder + "/" + this.appContext.tripsPackFile;},
  getTripsPackFile   : function()        { return this.appContext.tripsPackFile;},

	// Utility Function Below
	toString: function(result)
	{
		if (result === null || result === undefined)	result = "";
		var msgHash = [];
			msgHash["AppURL"]        = this.getAppURL();
			msgHash["CdvDataFolder"] = this.getCdvDataFolder();
			msgHash["NatDataFolder"] = this.getNatDataFolder();
			msgHash["NetworkStatus"] = this.getNetworkStatus();

		for (var key in msgHash) {
		   result  += key + "=" + msgHash[key] + "\n";
		}
		return result;
	},

	loadJSON: function (uri, callback)
	{
			var xobj = new XMLHttpRequest();
				  xobj.overrideMimeType("application/json");
					xobj.open('GET', uri, true); // Replace 'my_data' with the path to your file
					xobj.onreadystatechange = function ()
					{
	  					if (xobj.readyState == 4 && xobj.status == "200")
							{
									// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
									callback(JSON.parse(xobj.responseText));
          		}
					};
    		  xobj.send(null);
  }
};
