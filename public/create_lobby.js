var uid = null;
var current_user = null;

var lobby = null;
var lobby_created = null; 

function setUp()
{
        lobby_form = new Vue({el: '#lobby-form', data: {hide : false} });
}

/*firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
   // uid = user.uid
  //  current_user = user;
    console.log("user:" + uid)
  } else {
    console.log("no uid")
  }
});*/


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
        join_lobby(uid + "&&" + lobby_id);
}
