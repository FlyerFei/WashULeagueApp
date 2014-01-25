//array to hold summoner objects
var summoners = [];

//get summoner names
$(function(){
	$.getJSON('https://spreadsheets.google.com/feeds/cells/0AocJhXg2kCdQdEhoUlBrOUwyMkRaN3d3Nmw0NU1QZkE/od6/public/basic?alt=json-in-script&callback=?', function(response){
		var summonerObjects = response.feed.entry;
		for(var i = 1; i < summonerObjects.length; i++){
			summoner = new Object();
			summoner.name = summonerObjects[i].content.$t;
			summoners.push(summoner);
			getSummonerId(i-1);
			getSummonerInfo(summoners[i-1].id);
			console.log(summoners);
		}
	});
});

//get summoner id
function getSummonerId(index){
	$.getJSON('https://prod.api.pvp.net/api/lol/na/v1.1/summoner/by-name/'+summoners[index].name+'?api_key=11edefd4-07d5-42f4-98c7-60e87e327f0e', function(response){
		summoners[index].id = response.id;
	});
};

//get ranked info - will return 404 if not ranked
function getSummonerInfo(sid){
	var jqxhr = $.getJSON('https://prod.api.pvp.net/api/na/v2.1/league/by-summoner/'+sid+'?api_key=11edefd4-07d5-42f4-98c7-60e87e327f0e', function(response){
		//console.log(response);
		//console.log(response[sid]);
		//console.log(response[sid].queue);
		//console.log(response[sid].entries[0].tier);
		if(response.hasOwnProperty(sid)){
			if(response[sid].queue == "RANKED_SOLO_5x5"){
				for(var i = 0; i < response[sid].entries.length; i++){
					if(response[sid].entries[i].playerOrTeamId == sid){
						for(var j = 0; j < summoners.length; j++){
							if(summoners[j].id == sid){
								summoners[j].tier = response[sid].entries[i].tier;
								summoners[j].division = response[sid].entries[i].rank;
							}
						}
					}
				}
			}
		}
	})
	.error(function(event, jqxhr, exception) {
    	if (jqxhr.status == 404) {
            console.log("404");
            return;
    	}
	});
	jqxhr.complete(function(){
		console.log("complete");
	});
};
