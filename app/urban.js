// urban.js
var urban = require('urban');

function search(strings,api,thread_id,end) {

	// console.log(strings);
	if(!strings.length){
		api.sendMessage({body: "usage:\n /urb <string>"}, thread_id, function(){
			return;
		});
		end();
		return;
	}
	var totalString = "";
	for(var str in strings){
		totalString += " " + strings[str];
	}
	if(totalString.indexOf("#") != -1){
		end();
		api.sendMessage({body: "no hashtags in a command"}, thread_id, function(){});
		return;
	}

	console.log("/urb: " + totalString);

	var urban = require('urban'),
    trollface = urban(totalString);

	trollface.first(function(json) {
		if(!json){
			console.log("/urb failed");
			api.sendMessage({body: "urb failed for:" + totalString }, thread_id, function(){});
			end();
			return;
		}
			api.sendMessage({body: "definition:\n" + json.definition + "\nex:\n" + json.example}, thread_id, function(){
			console.log("/urb sent");
			end();
			return;
		});
		return;
	});
}

module.exports = {
	search : search
}