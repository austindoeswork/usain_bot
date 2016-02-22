// bot.js

var login = require("facebook-chat-api");
var image = require("./app/image.js");
var urban = require("./app/urban.js");


//playing with connect 4, temporary
var board = new Array(6);
for (var i = 0; i < 6; i++) {
  board[i] = ['  ','  ','  ','  ','  ','  ','  '];
}
var turn1 = true;
//TODO: create multiple tables for multiple chats

function start(){
//start it upp
login({email: "stupidthrowaway41234@gmail.com", password: "asdfqwer123"}, function callback (err, api) {
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

});
}

//TODO: Move this to a seperate file, clean up
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
        if(success == 1){
            displayBoard(api,threadID);
        }
        else if (success == -1){
            api.sendMessage({body:"invalid move."}, threadID);
        }
        else {
            displayBoard(api,threadID);
            api.sendMessage({body:"winnnnnnn."}, threadID);
        }
    });
    console.log("\n");
    
}

function addPiece(col,cb){
    if(col < 0 || col > 6){
        cb(-1);
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
            cb(-1);
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
    checkwin(row,col,piece,function(won){
        if(won){
            cb(0);
        }
        else {
            cb(1);
        }
    });
}

function checkwin(row,col,piece,cb){
    var count = 0;  
    var r = row;
    var c = col;
    var tile = board[row][col];
    //veerticle
    //get to the top
    console.log("checking vertical win for "+piece);
    console.log('count:'+count + ' r:'+r + ' current:' + board[row][col]);
    while(count < 3 && piece == board[r][c] && r < 5){
        count++;
        r++;
        console.log('r='+r);
    }
    if(count == 3){
        cb(true);
    }
    else{
        cb(false);
    }
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
