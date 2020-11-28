var exp = null;
var footer_menu = null;
var card_box = null;
var timer_div = null;
var camera = null;
var db_ref_cards = null;
var db_ref_actions = null;

var card_elements = null;
var db_ref_time = null;
var timer = null;
var last_time = null;
var current_time = 0;

var box = null;

var card_velocity = 0;

var card_width = 0;
var selected_card = null;

var first_card_selected = false;
var last_card_selected = false;

var db_ref_achievements = null;

async function start_game()
{
    firebase_start_game();
    console.log(expansion);

    footer_menu = new Vue({el: '#footer_menu',
    data:{
        visible: false
        }
    });


    approval = new Vue({el: '#approval-wrapper',
    data: {
        name : expansion.name,
        description: expansion.description,
        disclaimers: expansion.disclaimers,
        tasks: expansion.tasks,
        pre_approve_visible:true,
        post_approve_visible: false
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

    timer_div = new Vue({el: '#timer-wrapper',
    data:{
        visible: false
        }
    });
    hand = await firebase_hand_cards(hand_cards());
    firebase_wait_for_ready_status();
    box =  document.getElementById("card-box");
    firebase_on_swap();
    setup_timer();
    listen_for_swipes();
}


async function setup_timer()
{
    db_ref_time = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby);
    var res = await db_ref_time.once("value", function(snapshot) {
        current_time = snapshot.val()["time_left"];
    });
    last_time = Date.now();
    timer = document.getElementById("timer-wrapper").querySelector("h2");
    setInterval(timer_count_down, 50);
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
            vibrate(500);
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
        card.addEventListener('touchstart', handleTouchStart, true);
        card.addEventListener('touchmove', handleTouchMove, true);
    });
}


var myInterval = null;
var move_pixels = card_width;
var step = 0;
var is_moving = false;

async function move_card()
{
     step = card_velocity * 0.5;
     is_moving = true;
     myInterval = setInterval(move_card_one_step, 15/Math.abs(step));
}

async function move_card_one_step()
{
    if((move_pixels - Math.abs(step) <= 0) )
    {
        move_pixels = card_width;
        step = 0;
        card_velocity = 0;
        is_moving = false;
        clearInterval(myInterval);
        findSelectedCard();
    }
    var offsets = box.getBoundingClientRect();
    new_left = offsets.left - step;
    move_pixels = move_pixels - Math.abs(step);
    box.style.left = new_left + "px";
}

function findSelectedCard() {
    card_elements = document.querySelectorAll('.card');
    card_elements.forEach(function(card){
        var rect = card.getBoundingClientRect();
        var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
        if(!(rect.left < 0 || rect.right - viewWidth >= 0))
        {
            card.style.borderColor = "blue";
            selected_card = card;
            check_for_edge_card(card.querySelector(".card-text").innerHTML);
        }
        else
        {
            card.style.borderColor = "white";
        }
    });
}

function check_for_edge_card(text)
{
    first_card = card_box.cards[0].text;
    last_card = card_box.cards[card_box.cards.length - 1].text;

    if(text == first_card)
    {
        first_card_selected = true;
    }
    else if(text == last_card)
    {
        last_card_selected = true;
    }
    else
    {
        first_card_selected = false;
        last_card_selected = false;
    }
}

var xDown = null;                                                        
function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                                                           
};                                                

async function handleTouchMove(evt) {
    if (!xDown || is_moving) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var xDiff = xDown - xUp;

    //Right = + Left = -
    if(first_card_selected && xDiff < 0 || last_card_selected && xDiff > 0)
    {
        return;
    }

    var offsets = box.getBoundingClientRect();

        if ( xDiff > 0 )
        {
            xDiff = xDiff * 0.25;
            new_left = offsets.left - xDiff;
            card_velocity = xDiff;
            box.style.left = new_left + "px";
        } 
        else
        {
            xDiff = xDiff * 0.25;
            card_velocity = xDiff;
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
        move_card();                                                                                           
        xDown = null;   
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

var card_text = null;
async function firebase_swap_card(ref)
{
    ref = ref.split("&&");
    card = ref[0];
    enemy_uid = ref[1];

    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + enemy_uid + "/cards/" + "/" + card);

    db_ref_cards.once("value", function(snapshot) {
        card_text = snapshot.val();
        console.log(card_text + " text1")
    });

    //Give the card to me
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards/");
    var new_card = {};
    new_card[card] = card_text
    db_ref_cards.update(new_card);

    //Give achievement to me
    db_ref_achievements = firebase.database().ref('users/' + uid + 
    "/achievements/");
    var new_card = {};
    new_card['id'] = card;
    new_card['text'] = card_text;
    db_ref_achievements.push(new_card);

    //Remove the card from the enemy
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + enemy_uid + "/cards/" + "/" + card);
    db_ref_cards.remove();

    firebase_add_action(enemy_uid,uid,card,card_text);
}

//TODO: Listen for changes in card-list and apply to vue.js list
async function firebase_on_swap()
{
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid + "/cards");
        db_ref_cards.on('value', function(snapshot) {
        //If the hand has changed
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

async function firebase_add_action(loser_id, winner_id,card_id,text)
{
    db_ref_actions = firebase.database().ref('users/' + uid + 
    "/actions/");
    console.log(text + " text")
    db_ref_actions.push({loser_id:loser_id,winner_id:winner_id,card_id:card_id,card_text:text});
}


function hand_cards()
{
    var task_list = expansion.tasks;
    task_list =  shuffle(expansion.tasks).slice(0,cards);

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

    card_box.cards = task_list_map;
    Vue.nextTick(function () {
        add_qr_codes(task_map);
    });
    return task_map;
}

function approve_disclaimers()
{
    approval.post_approve_visible = true;
    approval.pre_approve_visible = false;
    var ref = firebase.database().ref("users/" + host_id +  "/lobbies/" + lobby + "/players/" + uid);
    ref.update({status: "ready"});
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
                ready = false;
            }
        }
        if(ready)
        {   
            approval.pre_approve_visible = false;
            approval.post_approve_visible = false;
            card_box.visible = true;
            timer_div.visible = true;
            Vue.nextTick(function () {
            c = document.getElementById("card-box").querySelector(".card");
            card_width = c.offsetWidth;
            });
        }
    });
}

async function firebase_hand_cards(task_map)
{
    //TODO:splice the number of cards selected in lobby settings
    db_ref_cards = firebase.database().ref('users/' + host_id + '/lobbies/' + lobby + 
    "/players/" + uid);
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
        width: 90,
        height: 90,
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

function vibrate(ms)
{
    window.navigator.vibrate(ms);
}