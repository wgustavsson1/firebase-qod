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


function getSelectedData()
{
  var time_select = document.getElementById("select-time");
  var time = time_select.options[time_select.selectedIndex].value;

  var cards_select = document.getElementById("select-cards");
  var cards = cards_select.options[cards_select.selectedIndex].value;

  var skips_select = document.getElementById("select-skips");
  var skips = skips_select.options[skips_select.selectedIndex].value;

  var expansion_select = document.getElementById("select-expansion");
  var expansion = expansion_select.options[expansion_select.selectedIndex].value;

  console.log({time:time,cards:cards,skips:skips,expansion:expansion});
  return {time:time,cards:cards,skips:skips,expansion:expansion};
}


function create_lobby()
{
        select = getSelectedData();
        var lobby_id = Math.random().toString(36).substring(10, 15) + Math.random().toString(36).substring(10, 15);
        var database = firebase.database();
        firebase.database().ref("users/" + uid +  "/lobbies/" + lobby_id ).set({
        host: name,
        profile_picture : profile_src,
        time:select['time'],
        cards:select['cards'],
        skips:select['skips'],
        expansion:select['expansion'],
         });
        lobby_form.hide = true;
        lobby.lobby_ref = uid + "&&" + lobby_id; 
        lobby.hide = false;
}
