var uid = null;
var current_user = null;

var lobby = null;
var lobby_created = null; 

async function setup_create_lobby()
{
    lobby_form = new Vue({el: '#lobby-form', data: {hide : false} });

    //Fetch expansion names from xml to select list
    var expansion_select = document.getElementById("select-expansion");
    console.log(expansion_select)
    var i = 0;
    for (const [id, name] of Object.entries(expansion_map))
    {
      var option = null;
      if(expansion_select.options[i] == undefined)
      {
        option = document.createElement("option");
        option.value = id;
        expansion_select.add(option)
      }
      console.log(expansion_select.options[i].value)
      expansion_select.options[i].innerHTML = name;
      i++;
    }
}

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
        status: "init",
        profile_picture : profile_src,
        time:select['time'],
        time_left:select['time'] * 60,
        cards:select['cards'],
        skips:select['skips'],
        expansion:select['expansion'],
         });
        lobby_form.hide = true;
        join_lobby(uid + "&&" + lobby_id);
}
