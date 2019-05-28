// Bonjour et bienvenue dans ce code ma foi dégueulasse mais faisant le boulot [:ocube]

const livesURL = "https://api-sport-events.webservices.francetelevisions.fr/directs"
const proxyService = "https://www.shunyweb.info/proxy.php";
const applicationName = "streamlink";
const streamInfoURLTemplate = "https://player.webservices.francetelevisions.fr/v1/videos/__ID__?country_code=FR&w=453&h=255&version=5.10.7&domain=sport.francetvinfo.fr&device_type=desktop&browser=chrome&browser_version=74&os=windows&os_version=10.0&gmt=%2B1"
const frenchIpBypass = " --http-header X-Forwarded-For=83.243.20.80";

const qualityList = [
    {
        "label":"Meilleure qualité (720p)",
        "value": "best"
    }, {
        "label":"540p",
        "value": "540p"
    }, {
        "label":"432p",
        "value": "432p"
    }, {
        "label":"360p",
        "value": "360p"
    }, {
        "label":"Qualité dégueulasse (216p)",
        "value": "worst"
    }];
   
var qualitySelection = $("#quality");
qualityList.forEach(function(quality) {
    var qualityOption = $("<option>");
    qualityOption.val(quality["value"]);
    qualityOption.text(quality["label"]);
    
    qualitySelection.append(qualityOption);
});

var streamInfos = []

function refreshStreamList() {
    
    streamInfos = $.post(proxyService, {'url': livesURL},
    function(serviceResponse) {
        // Any decent developer would make a check there. I'm too lazy.        
        streamInfos = JSON.parse(serviceResponse)["page"]["lives"].filter(live => !("status" in live));
        var courtSelection = $("#court");
        streamInfos.forEach(function(streamInfo) {
            var streamOption = $("<option>");
            streamOption.val(streamInfo["sivideo-id"]);
            streamOption.text(streamInfo["title"] + " (" + streamInfo["canal"] + ")");
            
            courtSelection.append(streamOption);
        });
    });
}


function generateNewLink()
{
	$("#link").val('');
	
	var nonFrenchIp = $("#nonfrenchip").is(':checked') ? 1 : 0;
	var chosenCourt = $("#court").val();
	var chosenQuality = $("#quality").val();
	var streamInfoURL = streamInfoURLTemplate.replace("__ID__", chosenCourt)
	
    if (!chosenCourt)
    {
        return;
    }
    authenticationURL = null;
	$.post(proxyService, { 'url': streamInfoURL},
		function(streamInfo)
		{   
            authenticationURL = JSON.parse(streamInfo)["video"]["token"];
            if (authenticationURL)
            {
                $.post(proxyService, { 'url': authenticationURL},
                    function(authenticatedStreamInfo)
                    {   
                        cmdLine = applicationName + " " + JSON.parse(authenticatedStreamInfo)["url"] + " " + chosenQuality;
                        if (nonFrenchIp)
                        {
                            cmdLine += frenchIpBypass;
                        }
                        $("#link").val(cmdLine);
                    }
                );
            }
		}
	);   
}

$(document).ready(function() {
    refreshStreamList();
});

// Listeners
$(".list").change(generateNewLink);
$("#nonfrenchip").change(generateNewLink);
$("#link").on("click",
	function()
	{
		$(this).select();
	}
);