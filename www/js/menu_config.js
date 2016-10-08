/*jshint scripturl:true*/
var leftMenuConfig =
{
	pageList:
	[
		{id : "1001"		, href : "javascript:app.refreshTripsConfig()"								 , name : "Refresh Trips", rel : ""}
	]
};

var rightMenuConfig =
{
	pageList:
	[
			{id : "1001"		, href : "javascript:app.takePhoto()"										  , name : "Take Photo    		 ", rel : "close"},
			{id : "1001"		, href : "#"																						  , name : "Shares			       ", rel : "close"},
			{id : "1001"		, href : "javascript:app.browse('http://www.google.com')"	, name : "Google Search 		 ", rel : "close"},
			{id : "1001"		, href : "javascript:app.browse('http://map.google.com')"	, name : "Google Map    		 ", rel : "close"},
			{id : "1001"		, href : "javascript:app.refreshApp()"										, name : "Refresh App        ", rel : "close"},
			{id : "1002"		, href : "javascript:app.refreshTripsPack()"							, name : "Refresh Trips Pack ", rel : "close"},
			{id : "1003"		, href : "javascript:app.showDebug()"											, name : "Show Debug    	   ", rel : "close"}
		]
};
