// bot.js

var login = require("facebook-chat-api");
var image = require("./app/image.js");
var urban = require("./app/urban.js");

var board = new Array(6);
for (var i = 0; i < 6; i++) {
  board[i] = ['  ','  ','  ','  ','  ','  ','  '];
}

var turn1 = true;

function start(){
//start shit upp
login({email: "", password: ""}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true});

    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);

        
        switch(event.type) {
          case "message":
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });

            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
/////////////////////////////////////////////////////////////////
            var mes = event.body.split(" ");

            if(mes[0] === "/gif"){
            //     // console.log("asdf");
                // api.sendTypingIndicator(event.threadID,function(err,end){
                image.searchgif(mes.slice(1), api, event.threadID);
                // });
            }
            // if(mes[0] === "/img"){
            //     api.sendTypingIndicator(event.threadID,function(err,end){
            //         image.search(mes.slice(1), api, event.threadID,end);
            //     });
            // }
            if(mes[0] === "/urb"){
                urban.search(mes.slice(1), api, event.threadID);
            }
            if(mes[0] === "/c4"){
                connect4(mes.slice(1), api, event.threadID);
            }
/////////////////////////////////////////////////////////////////
            // api.sendMessage({body:"TEST BOT: " + event.body}, event.threadID);
            break;
          case "event":
            console.log(event);
            break;
        }
    });

    // if(err){
    //     console.log(err);
    //     restart();
    //     return;    
    // }
    // console.log("ready");
    // // var myID = api.getCurrentUserId();

    // // api.getUserInfo(myID,function(err,obj){
    // //  console.log(obj);
    // // });
    // api.listen(function callback(err, message) {
    //     if(err) console.log(err);
    //     if(message.body && message.body[0] === "/"){
    //         var mes = message.body.split(" ");


    //         if(mes[0] === "/c4"){
    //             connect4(message);
    //         }
    //         if(mes[0] === "/img"){
    //             api.sendTypingIndicator(message.thread_id,function(err,end){
    //                 image.search(mes.slice(1), api, message.thread_id,end);
    //             });
    //         }
    //         if(mes[0] === "/gif"){
    //                 image.searchgif(mes.slice(1), api, message.thread_id,end);
    //         }
    //         if(mes[0] === "/urb"){
    //                 urban.search(mes.slice(1), api, message.thread_id);
    //         }
    //         if(mes[0] === "/swag"){
    //             api.sendMessage({body: "swiggity"+"..."}, message.thread_id, function(){
    //             return;
    //         });
    //         }
    //         if(mes[0] === "/dev"){
    //             if(mes[1] === "-restart"){
    //                 restart();
    //                 return;
    //             }
    //             if(mes[1] === "-peeps"){
    //                 var peepers = "online:\n";
    //                 var peeps = message.participant_names;
    //                 for(var peep in peeps){
    //                     if(peeps[peep] === "Austins") continue;
    //                     peepers += peeps[peep] + "\n";
    //                 }
    //                 api.sendMessage({body: peepers}, message.thread_id, function(){});
    //             }
    //             if(mes[1] === "-name"){
    //                 var name = "";
    //                 for(var i = 2; i<mes.length; i++){
    //                     name += mes[i] + " ";
    //                 }
    //                 api.setTitle(name,message.thread_id,function(err){
    //                     if (err){api.sendMessage({body: "not a groop chat"}, message.thread_id, function(){});}
    //                 });
    //             }
    //             if(mes[1] === "-info"){
    //                 api.getUserInfo(message.participant_ids,function(err,ret){
    //                     console.log(ret);
    //                 });
    //             }
    //             if(mes[1] === "-bio"){
    //                 api.getUserInfo(message.participant_ids,function(err,ret){
    //                     console.log(ret);
    //                 });
    //             }

    //                 // api.getUserInfo([1, 2, 3, 4], function(err, ret) {
    //                 //   if(err) return console.error(err);
                 
    //                 //   for(var prop in ret) {
    //                 //     if(ret.hasOwnProperty(prop) && ret[prop].is_birthday) {
    //                 //       api.sendMessage("Happy birthday :)", prop);
    //                 //     }
    //                 //   }
    //                 // });
    //             // console.log(message);
    //             // api.sendMessage({body: message}, message.thread_id, function(){});
    //         }
    //     }
    //     // console.log(message.body);
    //     // api.sendMessage(message.body, message.thread_id);
    // });
});
}

// connect4(mes.slice(1), api, event.threadID);
function connect4(mes,api,threadID){
    console.log("/c4:" + mes);
    // var row = board[mes[0]];
    // console.log(row[mes[1]]);
    if(mes.length <= 0 || mes.length > 1){
        api.sendMessage({body:"invalid command."}, threadID);
        return;
    }
    if(mes[0] == "reset"){   
        for (var i = 0; i < 6; i++) {
          board[i] = ['  ','  ','  ','  ','  ','  ','  '];
        }
        turn1 = true;
        displayBoard(api,threadID);
        return;
    }

    addPiece(mes[0],function(success){
        if(success){
            displayBoard(api,threadID);
        }
        else{
            api.sendMessage({body:"invalid move."}, threadID);
        }
    });
    // board[mes[0]][mes[1]] = parseInt(mes[2]);
    // displayBoard(api,threadID);
    // for(var j=0; j<6; j++){
    //         console.log(board[j]);
    // }

    console.log("\n");
    
}

function addPiece(col,cb){
    if(col < 0 || col > 6){
        cb(false);
        return;
    }
    var piece;
    if(turn1){
        piece = '0';
    }
    else {
        piece = '$';
    }

    var empty = false;
    var row = 5;
    while(!empty){
        if (row < 0){
            cb(false);
            return;
        }
        if(board[row][col] == '  '){
            empty = true;
        }
        else{
            row--;
        }
    }
    board[row][col] = piece;
    turn1 = !turn1; 
    cb(true);
}

function displayBoard(api,threadID){
    var string = "";
    for (var i = 0; i < 7; i++) {
        string += "|";
        string += i;
    }
    string += "|\n|-------------|\n";
    for (var i = 0; i < 6; i++) {
        string += "|";
        for(var j=0; j<7; j++){
            string += (board[i][j]);
            string += "|";
        }
        string += "\n";
    };
    string += "|-------------|\n";
    api.sendMessage({body:string}, threadID);
}

function restart(){
    process.nextTick(start);
}

start();
