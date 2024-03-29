var current_user = null;
var lobby_id = null;

var lobby = null;
var host_id = null;
var host_name = null;
var settings = null;
var players = null;
var log_list = [];
var logs = null;
var db_ref = null;
var player_list_db_ref = null;
var player_uid_list = [];


var is_connected = false;


var time = null;
var cards = null;
var skips = null;
var expan = null;

let scanner = null;

var game = null;

var reconnect_button = null;


async function setup_lobby_reconnect()
{
    reconnect_button = new Vue({el: '#reconnect',
            data: {
            is_visible : true,
            party_name: "reconnect",
            host_name: "sten"
            }
    });
    console.log(reconnect_button)

    exist = await lobby_exists(lobby_id);
    reconnect_button.is_visible = exist;
}


function init_lobby()
{
  host = new Vue({el: '#host',
        data: {host : "",
        user_is_host: false,
        profile_src:null,
        time:0,
        cards:0,
        skips:0,
        expansion:0
          }
        });
    settings = new Vue({el: '#lobby-items',
        data: {
        time:0,
        cards:0,
        skips:0,
        expansion:0
          }
        });
    players = new Vue({el: '#player-list',
      data: { players:{}}
      });

    game = new Vue({el: '#start-game',
    data: {user_is_host: false}});

    logs = new Vue({el: '#log-list',
      data: { logs:log_list}
      });
    
    
      is_connected = true;
}

function leave_lobby()
{
    if(!is_connected)
        return;
    firebase_player_leave();
    if(scanner != null)
        scanner.stop();
    scanner = null;
    expansion = null;
    settings = null;
    players = null;
    log_list = [];
    logs = null;
    if(db_ref !=  null)
        db_ref.off();

    db_ref = null;
    player_list_db_ref.off();
    player_list_db_ref = null;
    player_uid_list = [];
    loadPage("play.html").then(function(){
            fb_get_user_data(uid);
            setup_profile_component();
            add_home_click_listeners();
    });
}
function clear_lobby()
{
    if(scanner != null)
        scanner.stop();
    scanner = null;
    expansion = null;
    settings = null;
    players = null;
    log_list = [];
    logs = null;
    if(db_ref !=  null)
        db_ref.off();
    db_ref = null;
    player_list_db_ref.off();
    player_list_db_ref = null;
    player_uid_list = [];
}

/*firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //uid = user.uid
    //current_user = user;
  } else {
    console.log("no uid")
  }
}); */

function reconnect(lobby)
{
    reconnect_button.host_name = host_name
    join_lobby(lobby)
}

function firebase_start_game()
{   
    var database = firebase.database();
    var ref = firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby);
    ref.update({status:"started"});
}

function setup_scanner()
{
        scanner = new Instascan.Scanner(
            {
                video: document.getElementById('preview')
            }
        );
        scanner.addListener('scan', function(content) {
            join_lobby(content,true);
        });
        Instascan.Camera.getCameras().then(cameras => 
        {
            if(cameras.length > 0){
                scanner.start(cameras[1]);
            } else {
                console.error("No camera available!");
            }
        });
}

function firebase_add_game(lobby_id)
{
    firebase.database().ref("users/" + uid +  "/current_game/" ).set({
    lobby_id: lobby_id
    });
}

async function lobby_exists(lobby)
{
    if(lobby == null)
        return false;

    host_id = lobby_id.split("&&")[0]
    lobby = lobby_id.split("&&")[1]
    var exists = null;
    db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby);
    await db_ref.once('value', function(snapshot) {
        exists = snapshot.exists();
        console.log("1: " + exists)
    });
    return exists;
    console.log("2: " + exists)
}

async function join_lobby(lobby,created)
{
    lobby_id = lobby;

    exists = await lobby_exists(lobby_id)

    if(created == true && exists == false)
    {
        alert("That party does not exist! :(")
        return false;
    }

    firebase_add_game(lobby);
    loadPage("lobby.html").then(function(){

    init_lobby();
    setup_invite();
    firebase_get_current_game();

    if(is_host()) 
    {
        host.user_is_host = true;
        game.user_is_host = true;
    }
    firebase_get_host_data();
    firebase_add_user_as_player();
    firebase_get_player_list();
    });
    return true;
}

function is_host()
{
  if(host_id == uid)
    return true;
  else
    return false;
}

function setup_invite()
{
  var invite = new Vue({el: '#invite',
      data: { id:lobby_id}
      });
  var qrcode = new QRCode("invite", {
    text: lobby_id,
    width: 130,
    height: 130,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});
}



function firebase_get_current_game()
{
    db_ref = firebase.database().ref('users/' + uid + '/current_game/');
    db_ref.on('value', function(snapshot) {
    console.log(snapshot.child("lobby_id").val());
    lobby_id = snapshot.child("lobby_id").val()
    host_id = lobby_id.split("&&")[0]
    lobby = lobby_id.split("&&")[1]
    });
}

function firebase_add_user_as_player()
{
    console.log(lobby_id);
    var database = firebase.database();
    var ref = firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby + "/players/" + uid);
    ref.set({
          name:name,
          profile_src: profile_src,
          uid: uid,
          status: "joined"
         });
}

async function firebase_get_player_list()
{
    player_list_db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + "/players");
    player_list_db_ref.on('value', function(snapshot) {
        console.log(snapshot.val());
        new_player_list = snapshot.val();
        for (var p in new_player_list)
        {
            if(new_player_list[p].status == "joined")
            {
                //If it´s me then set status to connectet
                if(new_player_list[p].uid == uid)
                {
                    var updates = {};
                    updates["/" + uid + "/status"] = "connected";
                    player_list_db_ref.update(updates);
                }
                //else alert my friends
                else
                {
                    console.log(new_player_list[p].name + " joined the party!");
                }
            }
            else if(new_player_list[p].status == "disconnected" && new_player_list[p].uid != uid)
            {
                console.log(new_player_list[p].name + " disconnected :(");
            }
        }
        players.players = new_player_list;
    });
    var updates = {};
    updates["/" + uid + "/status"] = "disconnected";
    player_list_db_ref.onDisconnect().update(updates);
}

async function firebase_player_leave()
{
    var updates = {};
    updates["/" + uid + "/status"] = "disconnected";
    player_list_db_ref.update(updates);
}

async function firebase_get_host_data()
{
    db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby);
    db_ref.on('value', function(snapshot) {
        console.log("host");
        console.log(snapshot.child("host").val());
        host_name = snapshot.child("host").val();
        var status = snapshot.child("status").val();
        var host_profile_src = snapshot.child("profile_picture").val();
        time = snapshot.child("time").val();
        cards = snapshot.child("cards").val();
        skips = snapshot.child("skips").val();
        expan = snapshot.child("expansion").val();
        host.host = host_name;
        host.profile_src = host_profile_src;
        settings.time = time;
        settings.cards = cards;
        settings.skips = skips;
        settings.expansion = expan;
        if(status == "started")
        {
            loadExpansion(expan,"se");
            loadPage("game.html").then(function(){
            fb_get_user_data(uid);
            start_game();
            clear_lobby();
        });
        }
    });
}