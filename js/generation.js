// Bonjour et bienvenue dans ce code ma foi dégueulasse mais faisant le boulot [:ocube]

var proxyService = "https://www.shunyweb.info/proxy.php";
var authentificationService = "http://hdfauth.francetv.fr/esi/TA?url=";
var applicationName = "streamlink";
var swfParameter = "pvswf=http://staticftv-a.akamaihd.net/player/bower_components/player_flash/dist/FranceTVNVPVFlashPlayer.akamai-05bcfb8a5a233afa06de66e8c03d6642.swf";
var frenchIpBypass = " --http-header X-Forwarded-For=83.243.20.80";
var courtToStream = {};

courtToStream['DirectFTV'] = 'http://ftvensport04-lh.akamaihd.net/z/SPORT_LV17@323137/manifest.f4m';
courtToStream['PhilippeChatrier'] = 'http://ftvensport01-lh.akamaihd.net/z/SPORT_LV01@323121/manifest.f4m';
courtToStream['SuzanneLenglen'] = 'http://ftvensport01-lh.akamaihd.net/z/SPORT_LV02@323122/manifest.f4m';
courtToStream['Court1'] = 'http://ftvensport01-lh.akamaihd.net/z/SPORT_LV03@323123/manifest.f4m';
courtToStream['Court2'] = 'http://ftvensport01-lh.akamaihd.net/z/SPORT_LV04@323124/manifest.f4m';
courtToStream['Court3'] = 'http://ftvensport01-lh.akamaihd.net/z/SPORT_LV05@323125/manifest.f4m';
courtToStream['Court4'] = 'http://ftvensport02-lh.akamaihd.net/z/SPORT_LV08@323128/manifest.f4m';
courtToStream['Court5'] = 'http://ftvensport02-lh.akamaihd.net/z/SPORT_LV09@323129/manifest.f4m';
courtToStream['Court6'] = 'http://ftvensport02-lh.akamaihd.net/z/SPORT_LV06@323126/manifest.f4m';
courtToStream['Court8'] = 'http://ftvensport02-lh.akamaihd.net/z/SPORT_LV10@323130/manifest.f4m';
courtToStream['Court10'] = 'http://ftvensport03-lh.akamaihd.net/z/SPORT_LV11@323131/manifest.f4m';
courtToStream['Court14'] = 'http://ftvensport02-lh.akamaihd.net/z/SPORT_LV07@323127/manifest.f4m';
courtToStream['Court15'] = 'http://ftvensport03-lh.akamaihd.net/z/SPORT_LV12@323132/manifest.f4m';
courtToStream['Court16'] = 'http://ftvensport03-lh.akamaihd.net/z/SPORT_LV13@323133/manifest.f4m';
courtToStream['Court17'] = 'http://ftvensport03-lh.akamaihd.net/z/SPORT_LV14@323134/manifest.f4m';
courtToStream['Court18'] = 'http://ftvensport03-lh.akamaihd.net/z/SPORT_LV15@323135/manifest.f4m';

function generateNewLink()
{
	$("#link").val('');
	
	var nonFrenchIp = $("#nonfrenchip").is(':checked') ? 1 : 0;
	var chosenCourt = $("#court").val();
	var chosenQuality = $("#quality").val();
	var authentificationUrl = authentificationService + encodeURIComponent(courtToStream[chosenCourt]);
		
	$.post(proxyService, { 'url': authentificationUrl},
		function(streamUrl)
		{
			hdsStreamUrl = streamUrl.replace("http", "hds");
			var cmdLine = applicationName + ' "' + hdsStreamUrl + ' ' + swfParameter + '" ' + chosenQuality;
			if (nonFrenchIp)
			{
				cmdLine += frenchIpBypass;
			}
			console.log(nonFrenchIp);
			$("#link").val(cmdLine);
		}
	);
}

// Mise en place des listeners
$(".list").change(generateNewLink);
$("#nonfrenchip").change(generateNewLink);
$("#link").on("click",
	function()
	{
		$(this).select();
	}
);
$("#court").change(); // Pour que l'URL des valeurs par défaut soit générée quand même
