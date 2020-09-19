var database = firebase.database();
var current_user = null;
var lobby_id = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //uid = user.uid
    //current_user = user;
  } else {
    console.log("no uid")
  }
});

function firebase_add_game()
{
    lobby_id = document.getElementById("input-party-ref").value;
    console.log(lobby_id);
    var database = firebase.database();
    firebase.database().ref("users/" + uid +  "/current_game/" ).set({
        lobby_id: lobby_id
         });
}

function join_lobby()
{
  firebase_get_current_game();
  firebase_get_host_data();
  firebase_add_user_as_player();
  firebase_get_player_list();
}



function firebase_get_current_game()
{
    var db_ref = firebase.database().ref('users/' + uid + '/current_game/');
    db_ref.on('value', function(snapshot) {
    console.log(snapshot.child("lobby_id").val());
    lobby_id = snapshot.child("lobby_id").val()
    });
}

function firebase_add_user_as_player()
{
    host_id = lobby_id.split("&&")[0]
    lobby = lobby_id.split("&&")[1]
    console.log(lobby_id);
    var database = firebase.database();
    firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby + "/players/" + uid).set({
          name:name,
          profile_src: profile_src,
          uid: uid,
         });
}

function firebase_get_player_list()
{
    host_id = lobby_id.split("&&")[0]
    lobby = lobby_id.split("&&")[1]
    var db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + "/players");
    db_ref.on('value', function(snapshot) {
    console.log(snapshot.val())
    var players = new Vue({el: '#player-list',
     data: {
          players:snapshot.val()
         }
      });
    });
}

function firebase_get_host_data()
{
    host_id = lobby_id.split("&&")[0]
    lobby = lobby_id.split("&&")[1]
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
    var host = new Vue({el: '#host',
     data: {host : host_name,
      profile_src:host_profile_src,
      time:time,
      cards:cards,
      skips:skips,
      expansion:expansion
         }
      });
    });
}
