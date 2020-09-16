var database = firebase.database();
var uid = null;
var current_user = null;

var name = null;
var fb_uid = null;
var profile_src = null;
var name = sessionStorage.getItem("name");
var fb_uid = sessionStorage.getItem("fb_uid");
var profile_src = sessionStorage.getItem("profile_src");

var lobby = null;
var lobby_created = null; 

function setUp()
{
        lobby_form = new Vue({el: '#lobby-form', data: {hide : false} });
        lobby = new Vue({
                el: '#lobby',
                data: {
                lobby_ref: null,
                hide : true
                }
        });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    uid = user.uid
    current_user = user;
  } else {
    console.log("no uid")
  }
});


function create_lobby()
{
        console.log("1")
        var lobby_id = Math.random().toString(36).substring(10, 15) + Math.random().toString(36).substring(10, 15);
        var database = firebase.database();
        console.log(uid);
        console.log(lobby_id);
        console.log(name);
        console.log(profile_src);
        console.log(fb_uid);
        firebase.database().ref("users/" + uid +  "/lobbies/" + lobby_id ).set({
        host: name,
        profile_picture : profile_src,
         });
        lobby_form.hide = true;
        lobby.lobby_ref = uid + "&&" + lobby_id; 
        lobby.hide = false;
}
