var database = firebase.database();
var uid = null;
var current_user = null;
var name = null;
var fb_uid = null;
var profile_src = null;
var name = sessionStorage.getItem("name");
var fb_uid = sessionStorage.getItem("fb_uid");
var profile_src = sessionStorage.getItem("profile_src");

var lobby_id = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    uid = user.uid
    current_user = user;
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

function firebase_get_current_game()
{
    var db_ref = firebase.database().ref('users/' + uid + '/current_game/');
    db_ref.on('value', function(snapshot) {
    console.log(snapshot.child("lobby_id").val());
    lobby_id = snapshot.child("lobby_id").val()
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
    var host = new Vue({el: '#host', data: {host : host_name} });
    });
}
