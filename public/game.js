var exp = null;
var card_box = null;
var db_ref_cards = null;

async function start_game()
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
    card_box = new Vue({el: '#card-box',
    data: {
        cards: []
        }
    });
    firebase_hand_cards(hand_cards());
    firebase_wait_for_ready_status();
}

function hand_cards()
{
    var task_list = expansion.tasks;
    task_list =  shuffle(expansion.tasks).slice(0,4);

    var task_list_map =  [];
    var task_map = {};

    for(var id in expansion.tasks_map)
    {
        if(task_list.includes(expansion.tasks_map[id])) 
        {
            task_list_map.push({id:id,text: expansion.tasks_map[id]});
            task_map[id] = expansion.tasks_map[id];
        }
    }
    console.log(task_list);

    card_box.cards = task_list_map;
    Vue.nextTick(function () {
        add_qr_codes(task_map);
    });
    return task_map;
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

function firebase_hand_cards(task_map)
{
    //TODO:splice the number of cards selected in lobby settings
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards");
    console.log(task_map);
    db_ref_cards.set({cards: task_map});
}
function add_qr_codes(map)
{
    for(var id in map)
    {
        var qrcode = new QRCode(id, {
        text:id,
        width: 130,
        height: 130,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
        });
    }
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

function shuffleMap (myArray) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}