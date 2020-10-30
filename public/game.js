var exp = null;
var footer_menu = null;
var card_box = null;
var timer_div = null;
var camera = null;
var db_ref_cards = null;

var card_elements = null;
var db_ref_time = null;
var timer = null;
var last_time = null;
var current_time = 0;

async function start_game()
{
    firebase_start_game();
    console.log(expansion);

    footer_menu = new Vue({el: '#footer_menu',
    data:{
        visible: false
        }
    });

    timer_div = new Vue({el: '#timer',
    data:{
        visible: false
        }
    });

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
        cards: [],
        visible:false
        }
    });

    camera = new Vue({el: '#camera',
    data:{
        visible: false
        }
    });
    hand = await firebase_hand_cards(hand_cards());
    firebase_wait_for_ready_status();
    listen_for_swipes();
    firebase_on_cards();
    setup_timer();
}


async function setup_timer()
{
    db_ref_time = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby);
    var res = await db_ref_time.once("value", function(snapshot) {
        current_time = snapshot.val()["time_left"];
    });
    last_time = Date.now();
    timer = document.getElementById("timer").querySelector("h2");
    setInterval(timer_count_down, 50);
    timer_div.visible = true;
}

async function timer_count_down()
{
    if(Date.now() - last_time > 1000)
    {
        current_time = current_time -1;
        timer.innerHTML = create_time_string(current_time);
        last_time = Date.now();
    }
}

function create_time_string(seconds)
{
     var h = Math.floor(seconds / 3600);
     var m = Math.floor(seconds % 3600 / 60);
     var s = Math.floor(seconds % 3600 % 60);
     return h + "." + m + "." + s;
}
function open_camera()
{
        scanner = new Instascan.Scanner(
            {
                video: document.getElementById('preview')
            }
        );
        scanner.addListener('scan', function(card) {
            firebase_swap_card(card);
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

async function listen_for_swipes()
{
    card_elements = document.querySelectorAll('.card');
    card_elements.forEach(function(card){
        card.addEventListener('touchstart', handleTouchStart, false);
        card.addEventListener('touchmove', handleTouchMove, false);
    });
}


var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

async function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    var box =  document.getElementById("card-box");
    var offsets = box.getBoundingClientRect();
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            xDiff = xDiff * 0.2;
            new_left = offsets.left - xDiff;
            box.style.left = new_left + "px";
        } else {
            /* right swipe */
            xDiff = xDiff * 0.2;
            new_left = offsets.left - xDiff;
            if(new_left < 200)
            {
                box.style.left = new_left + "px";
            }
            else
            {
               box.style.left = 200 + "px";  
            }        
        }                                                                 
    }                                         
};

function toggle_camera()
{
    if(!camera.visible)
    {
        open_camera();
        camera.visible = true;
    }
    else
    {
        if(scanner != null) scanner.stop();
        scanner = null;
        camera.visible = false;
    }


}

async function firebase_swap_card(ref)
{
    //TODO: Make this function work
    ref = ref.split("&&");
    card = ref[0];
    enemy_uid = ref[1];

    console.log(card + "card")
    console.log("enemy" + enemy_uid);

    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + enemy_uid + "/cards/" + "/" + card);
    var card_text = null;
    db_ref_cards.on("value", function(snapshot) {
        card_text = snapshot.val();
    });

    //Give the card to me
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards/");
    var new_card = {};
    new_card[card] = card_text
    db_ref_cards.update(new_card);

    //Remove the card from the enemy
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + enemy_uid + "/cards/" + "/" + card);
    db_ref_cards.remove();
}

//TODO: Listen for changes in card-list and apply to vue.js list
async function firebase_on_cards()
{
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards");
        db_ref_cards.on('value', function(snapshot) {
        console.log(snapshot.numChildren() + " num")
        if(snapshot.numChildren() != card_box.cards.length)
        {
            card_box.cards = [];
            map = {};
            for(key in snapshot.val())
            {
                card_box.cards.push({id:key,text:snapshot.val()[key]});
                map[key] = snapshot.val()[key];
            }
            Vue.nextTick(function () {
                add_qr_codes(map);
                listen_for_swipes();
            });
        }
    });
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
            card_box.visible = true;
            approve_disclaimers();
        }
    });
}

async function firebase_hand_cards(task_map)
{
    //TODO:splice the number of cards selected in lobby settings
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid);
    console.log(task_map);
    db_ref_cards.set({cards: task_map});
}
function add_qr_codes(map)
{

    var qrs = document.querySelectorAll(".qr");
    qrs.forEach(function (e) {
        e.innerHTML = "";
    })

    for(var id in map)
    {
        var qrcode = new QRCode(id, {
        text:id+ "&&" + uid,
        width: 120,
        height: 120,
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