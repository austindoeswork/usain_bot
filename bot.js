// bot.js

var login = require("facebook-chat-api");
var image = require("./app/image.js");
var urban = require("./app/urban.js");

//start shit upp
login({email: "stupidthrowaway41234@gmail.com", password: "asdfqwer123"}, function callback (err, api) {
    if(err) return console.error(err);
    console.log("ready");
    // var myID = api.getCurrentUserId();

    // api.getUserInfo(myID,function(err,obj){
    // 	console.log(obj);
    // });
    api.listen(function callback(err, message) {
        if(err) console.log(err);
        if(message.body && message.body[0] === "/"){
            var mes = message.body.split(" ");

            if(mes[0] === "/img"){
                api.sendTypingIndicator(message.thread_id,function(err,end){
                    image.search(mes.slice(1), api, message.thread_id,end);
                });
            }
            if(mes[0] === "/gif"){
                api.sendTypingIndicator(message.thread_id,function(err,end){
                    image.searchgif(mes.slice(1), api, message.thread_id,end);
                });
            }
            if(mes[0] === "/urb"){
                api.sendTypingIndicator(message.thread_id,function(err,end){
                    urban.search(mes.slice(1), api, message.thread_id,end);
                });
            }
            if(mes[0] === "/swag"){
                api.sendMessage({body: "swiggity"+"..."}, message.thread_id, function(){
                return;
            });
            }
            if(mes[0] === "/dev"){
                if(mes[1] === "-peeps"){
                    var peepers = "online:\n";
                    var peeps = message.participant_names;
                    for(var peep in peeps){
                        if(peeps[peep] === "Austins") continue;
                        peepers += peeps[peep] + "\n";
                    }
                    api.sendMessage({body: peepers}, message.thread_id, function(){});
                }
                if(mes[1] === "-name"){
                    var name = "";
                    for(var i = 2; i<mes.length; i++){
                        name += mes[i] + " ";
                    }
                    api.setTitle(name,message.thread_id,function(err){
                        if (err){api.sendMessage({body: "not a groop chat"}, message.thread_id, function(){});}
                    });
                }
                if(mes[1] === "-info"){
                    api.getUserInfo(message.participant_ids,function(err,ret){
                        console.log(ret);
                    });
                }
                if(mes[1] === "-bio"){
                    api.getUserInfo(message.participant_ids,function(err,ret){
                        console.log(ret);
                    });
                }

                    // api.getUserInfo([1, 2, 3, 4], function(err, ret) {
                    //   if(err) return console.error(err);
                 
                    //   for(var prop in ret) {
                    //     if(ret.hasOwnProperty(prop) && ret[prop].is_birthday) {
                    //       api.sendMessage("Happy birthday :)", prop);
                    //     }
                    //   }
                    // });
                // console.log(message);
                // api.sendMessage({body: message}, message.thread_id, function(){});
            }



        }
    	// console.log(message.body);
        // api.sendMessage(message.body, message.thread_id);
    });


});
