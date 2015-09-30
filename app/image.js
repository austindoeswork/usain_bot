// image.js
// giphy key
// dc6zaTOxFJmzC 

var images 	= require('google-images');
var giphy = require( 'giphy' )( 'dc6zaTOxFJmzC' );

var fs 		= require('fs');	
var path	= require('path');
var request = require('request');

function search(strings,api,thread_id,end) {

	if(!strings.length){
		api.sendMessage({body: "usage:\n /img <string>"}, thread_id, function(){
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

	console.log("/img: " + totalString);
	images.search(totalString,function(err,images){

		if(!images.length){
			console.log("/img failed");
			api.sendMessage({body: "img failed for "+strings[0]+"..."}, thread_id, function(){
				end();
				return;
			});
			return;
		}

		var stream = request(images[0].url);

		api.sendMessage({attachment: stream}, thread_id, function(err){
			if(err){
				console.log("/img failed");
				api.sendMessage({body: "img failed for "+strings[0]+"..."}, thread_id, function(){});
				end();
				return;
			}
			console.log('/img sent');
			end();
		});

	});
}

function searchgif(strings,api,thread_id,end) {

	if(!strings.length){
		api.sendMessage({body: "usage:\n /img <string>"}, thread_id, function(){
			end();
			return;
		});
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
	
	console.log("/gif: " + totalString);

	giphy.search( { q : totalString, rating : 'r', limit : 1}, function(err,gifs,res){
		if(!gifs.data[0]){
			console.log("/gif failed");
			api.sendMessage({body: "gif failed for "+strings[0]+"..."}, thread_id, function(){
				end();
				return;
			});
			return;
		}
		var url = gifs.data[0].images.fixed_height_small.url;
		var stream = request(url);

		api.sendMessage({attachment: stream}, thread_id, function(err){
			if(err){
				console.log("/gif failed");
				api.sendMessage({body: "gif failed for "+strings[0]+"..."}, thread_id, function(){});
				end();
				return;
			}
			console.log("/gif sent");
			end();
			return;
		});
		return;
	});
	
}

module.exports = {
	search : search,
	searchgif : searchgif
}