var database = firebase.database();
var current_user = null;
var lobby_id = null;

var lobby = null;
var host_id = null;
var settings = null;
var players = null;
var log_list = [];
var logs = null;

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

    logs = new Vue({el: '#log-list',
      data: { logs:log_list}
      });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //uid = user.uid
    //current_user = user;
  } else {
    console.log("no uid")
  }
});

function firebase_add_game(lobby)
{
    if(lobby == null)
      lobby_id = document.getElementById("input-party-ref").value;
    else
      lobby_id = lobby;
    console.log(lobby_id);
    var database = firebase.database();
    firebase.database().ref("users/" + uid +  "/current_game/" ).set({
        lobby_id: lobby_id
         });
}

function setup_scanner()
{
     let scanner = new Instascan.Scanner(
            {
                video: document.getElementById('preview')
            }
        );
        scanner.addListener('scan', function(content) {
            join_lobby(content);
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
function join_lobby(lobby)
{
  if(lobby)
  {
    loadPage("lobby.html").then(function(){
            setupFB();
            firebase_add_game(lobby);
            init_lobby();
            setup_invite();
            firebase_get_current_game();
            if(is_host()) host.user_is_host = true;
            firebase_get_host_data();
            firebase_add_user_as_player();
            firebase_get_player_list();
            firebase_listen_to_messages();
         });
  }
else
{
    init_lobby();
    setup_invite();
    firebase_get_current_game();
    if(is_host()) host.user_is_host = true;
    firebase_get_host_data();
    firebase_add_user_as_player();
    firebase_get_player_list();
    firebase_listen_to_messages();
}

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
    var db_ref = firebase.database().ref('users/' + uid + '/current_game/');
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
    var ref = firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby + "/players/" + uid).set({
          name:name,
          profile_src: profile_src,
          uid: uid,
         });
}

function firebase_get_player_list()
{
    var db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + "/players");
    db_ref.on('value', function(snapshot) {
    console.log(snapshot.val())
    players.players = snapshot.val();
    });
}

function firebase_listen_to_messages()
{
 
}

function firebase_get_host_data()
{
    var db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby);
    db_ref.on('value', function(snapshot) {
    console.log("host")
    console.log(snapshot.child("host").val());
    var host_name = snapshot.child("host").val();
    var host_profile_src = snapshot.child("profile_picture").val();
    var time = snapshot.child("time").val();
    var cards = snapshot.child("cards").val();
    var skips = snapshot.child("skips").val();
    var expansion = snapshot.child("expansion").val();
    host.host = host_name;
    host.profile_src = host_profile_src;
    settings.time = time;
    settings.cards = cards;
    settings.skips = skips;
    settings.expansion = expansion;
   /* host = new Vue({el: '#host',
      data: {host : host_name,
      profile_src:host_profile_src,
      time:time,
      cards:cards,
      skips:skips,
      expansion:expansion
         }
      });
*/
    });
}