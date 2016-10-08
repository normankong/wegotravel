/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

	ONLINE  : 1,
	OFFLINE : 2,

	// Application Constructor
    initialize: function() {
        this.bindEvents();
	
	},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("offline", this._onOffline, false);
		document.addEventListener("online" , this._onOnline, false);
	} ,

	// deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		app.initAppContext();
		app.checkConnection();
		app.initPage();
		app.initProgressBar();
		app.initSideMenu();
	},

	// Update DOM on a Received Event
    receivedEvent: function(id) 
	{
        console.log('Received Event: ' + id);
		switch (id)
		{
			case "deviceready":
				break;
			default :
				break;
		}
    },

	takePhoto: function()
	{
		navigator.camera.getPicture(app._onCameraSuccess, app._onCameraFail, {
		  quality: 100,
		  destinationType: Camera.DestinationType.FILE_URI,
		  sourceType     : Camera.PictureSourceType.CAMERA,
		  allowEdit      : false,
		  encodingType   : Camera.EncodingType.JPEG,
		  correctOrientation : true,
		  saveToPhotoAlbum: true
		});
	}, 

	browse:function (url)
	{
		cordova.InAppBrowser.open(url, "_self", 'location=no');
	},
	checkConnection:function ()
	{
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		return states[networkState];
	},
	refreshApp: function()
	{
		window.open(appContext.appURL, "_system");
//		app.browse(appContext.appURL);
	},
	vibrate: function()
	{
		navigator.vibrate([1000, 1000, 1000]);
	},

	_onOffline: function() 
	{
		app._setNetworkStatus(app.OFFLINE);
	},
	_onOnline: function() 
	{
		app._setNetworkStatus(app.ONLINE);
	},

	_onCameraSuccess: function(imageData) 
	{
		var image = document.getElementById('image');
		image.src = imageData;
	},

	_onCameraFail: function (message) 
	{
		if (message != "Camera cancelled.")
		{
			alert('Failed because: ' + message);
		}
	},

	_chkAppAvailability: function (schema)
	{
		appAvailability.check(
			scheme,       // URI Scheme or Package Name
			function() {  // Success callback
				console.log(scheme + ' is available :)');
			},
			function() {  // Error callback
				console.log(scheme + ' is not available :(');
			}
		);
	},

	_setNetworkStatus:function (status)
	{
		appContext.networkStatus = status;
	},

	// Inital Application Context
	initAppContext: function ()
	{
		appContext.natDataFolder = cordova.file.externalRootDirectory;
		if (appContext.natDataFolder !== null)
		{
			window.resolveLocalFileSystemURL(appContext.natDataFolder, function(entry) {appContext.cdvDataFolder = entry.toInternalURL();}, errorHandler.bind(null, appContext.natDataFolder));
		}
		else
		{
			alert("Unable to detect : " + appContext.natDataFolder);
		}
	},

	showStatus: function(text)
	{
		var msg = $("#textarea").val();
		$("#textarea").html(text + "\n" + msg);
	},

	playMp3: function()
	{
		appContext.media = new Media(appContext.appContext.alarmClockURL);
		appContext.media.play();
	},

	refreshTrips: function()
	{
		fileUtil.downloadTripsConfig(function (result)
		{
			if (result.value) // Success
			{
				$.getJSON(appContext.cdvTripsConfigURL)
					.done(function (json)
					{
						if (json !== null) // Success
						{
							tripsConfig = json;
							app.initLeftMenu();
						}
						else
						{
							alert("Unable to load Trip Config : " + appContext.cdvTripsConfigURL);
						}
					})
					.fail(function( jqxhr, textStatus, error ) 
					{
						var err = textStatus + ", " + error;
						alert( "Failed to retrieve : " + appContext.cdvTripsConfigURL + " Error : " + err);
					});
			}
		});
	},

	downloadZip: function()
	{
		fileUtil.downloadZip();
	},

	initPage: function()
	{
		$("#title").html(appContext.splashTitle);
		$("#topic").html(appContext.splashMessage);
		$("#image").attr("src", appContext.splashImage);
	},

	initProgressBar: function()
	{
		$("#progressbar").progressbar =jQMProgressBar('progressbar')
										.setOuterTheme('a')
										.setInnerTheme('b')
										.isMini(true)
										.showCounter(true)
										.build();
	},
	initSideMenu: function()
	{
		$(document).on( "swipeleft swiperight", "#main-page", function( e ) 
		{
			if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) 
			{
				if		( e.type === "swipeleft"  ) $( "#right-panel").panel( "open" );
				else if ( e.type === "swiperight" ) $( "#left-panel" ).panel( "open" );
			}
		});

		// Init Left Menu
		app.initLeftMenu();
		app.initRightMenu();
	},

	initLeftMenu: function()
	{
		var menu     = $("#leftmenu").empty();
		var template = leftMenuTemplate;
		var pageList = leftMenuConfig.pageList;
		var i, page, templateConfig, result;
		for (i=0; i < pageList.length; i++)
		{
			page = pageList[i];
			templateConfig = { data : {href : page.href, name : page.name, rel : page.rel}};
			result = nano(template, templateConfig);
			menu.append(result);
		}

		// Append Trips Config
		var tripList = tripsConfig.tripList;
		for (j=0; j < tripList.length; j++)
		{
			page = tripList[j];
			templateConfig = { data : {id : page.id, name : page.name}, rel : page.rel};
			result = nano(tripMenuTemplate, templateConfig);
			menu.append(result);
		}
	},

	initRightMenu: function()
	{
		var menu     = $("#rightmenu").empty();
		var template = rightMenuTemplate;
		var pageList = rightMenuConfig.pageList;
		for (var i=0; i < pageList.length; i++)
		{
			var page = pageList[i];
			var templateConfig = { data : {href : page.href, name : page.name, rel : page.rel}};
			var result = nano(template, templateConfig);
			menu.append(result);
		}
	},

	initTripMenu: function()
	{
		$("#title").html(tripConfig.title);

		var menu     = $("#tripmenu").empty();
		var template = tripItemTemplate;
		var pageList = tripConfig.pageList;
		for (var i=0; i < pageList.length; i++)
		{
			var page = pageList[i];
			var templateConfig = { data : {id : page.id, name : page.name, rel : ""}};
			var result = nano(template, templateConfig);
			menu.append(result);
		}
	},

	// Load the particular Trip config
	loadTripConfig: function(tripId)
	{
		var isFound = false;
		var page = null;
		for (var i=0; i < tripsConfig.tripList.length; i++)
		{
			page = tripsConfig.tripList[i];
			if (page.id == tripId)
			{
				isFound = true;
				break;
			}
		}

		if (isFound)
		{
			$.getJSON(page.config)
				.done(function (json)
				{
					if (json !== null) // Success
					{
						tripConfig = json;
						app.initTripMenu();
						app.loadPageConfig("1001");
					}
					else
					{
						alert("Unable to load Trip Config : " + page.config);
					}
				})
				.fail(function( jqxhr, textStatus, error ) 
				{
					var err = textStatus + ", " + error;
					alert( "Failed to retrieve : " + page.config + " Error : " + err);
				});
		}
		else
		{
			alert("Unable to lookup trip id : " + tripId);
		}
	},

	loadPageConfig: function(tripId)
	{
		for (var i=0; i < tripConfig.pageList.length; i++)
		{
			var page = tripConfig.pageList[i];
			if (page.id == tripId)
			{
				  $("#title").html(tripConfig.title + " " + page.name);
				  $("#topic").html(page.name);
				  $("#image").attr("src", page.imageUrl);
				  break;
			}  
		}
	},

	showDebug: function()
	{
		var msgHash = [];
			msgHash["appContext.appURL"]        = appContext.appURL;
			msgHash["appContext.cdvDataFolder"] = appContext.cdvDataFolder;
			msgHash["appContext.natDataFolder"] = appContext.natDataFolder;
			msgHash["appContext.networkStatus"] = appContext.networkStatus;

		var msg = "";
		for (var key in msgHash) {
		   msg  += key + "=" + msgHash[key] + "\n";
		}	
		alert(msg);
	}
};

app.initialize();


function nano(template, data) {
  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
    var keys = key.split("."), v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}


// Application Run Time Status
var appContext = {};
	appContext.appURL			= "http://192.168.0.104:5000/build/WeGoTravel.apk";
	appContext.clientPackURL	= "http://192.168.0.104:5000/build/clientpack.zip";
	appContext.tripsConfigURL	= "http://192.168.0.104:5000/build/trip_config.json";
	appContext.tripsConfig		= "trip_config.json";
	appContext.cdvTripsConfigURL= "cdvfile://localhost/sdcard/hailey/trip_config.json";
	appContext.splashTitle      = "We Go Travel !";
	appContext.splashMessage	= "Please select a trip on left menu! ";
	appContext.splashImage  	= "splash/cover.jpg";
	appContext.natDataFolder	= null;
	appContext.cdvDataFolder	= null;
	appContext.networkStatus	= null;
	appContext.alarmClockURL	= "cdvfile://localhost/sdcard/hailey/alarm.mp3";
	appContext.media			= null;



