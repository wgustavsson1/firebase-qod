var exp = null;
var db_ref_cards = null;

function start_game()
{
    firebase_start_game();
    console.log(expansion);
    exp = new Vue({el: '#expansion',
    data: {
        name : expansion.name,
        description: expansion.description,
        disclaimers: expansion.disclaimers,
        tasks: expansion.tasks,
        i_have_approved: false,
        not_approved:true
        }
    });
    firebase_wait_for_ready_status();
    firebase_hand_cards();
}

function approve_disclaimers()
{
    var ref = firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby + "/players/" + uid);
    ref.update({status: "ready"});
    exp.i_have_approved = true;
}

function firebase_wait_for_ready_status()
{
    player_list_db_ref = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + "/players");
    player_list_db_ref.on('value', function(snapshot) {
        var ready = true;
        for(player in snapshot.val())
        {
            if(snapshot.val()[player].status !== "ready")
            {
                console.log("ready")
                ready = false;
            }
        }
        if(ready)
        {
            console.log("ready 2")
            exp.not_approved = false;
            approve_disclaimers();
        }
    });
}

function firebase_hand_cards()
{
    //TODO:splice the number of cards selected in lobby settings
    expansion.tasks = shuffle(expansion.tasks).slice(0,2);
    console.log(expansion.tasks);
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards" );
    db_ref_cards.set({cards: expansion.tasks_map});
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}