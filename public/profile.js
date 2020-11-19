var achievement_box = null;

var achievement_element = null;
var account_settings = null;
var achievements = [];

var achive_map = {};

//TODO: FIX non hardcoded solution
const EXPANSIONS = ["vanilla","inte vanilla", "inte alls vanilla"]


function setup_profile(is_me)
{

    //achive_map["snusk"] = [];
    //achive_map["supa"] = [];

    achievement_box = new Vue({el: '#achievements',
    data: {
        es: EXPANSIONS,
        achievements: null,
        text: null,
        visible: false,
        index: 0
        }
    });

    account_settings = new Vue({el: '#account-settings',
    data: {
        visible: false,
        button_visible:true,
        settings_visible:false
        }
    });
    firebase_get_achievements().then(function(response){
        achievement_box.visible = true;
        achievement_box.achievements = achive_map;
        console.log(Object.values(achive_map));
        Vue.nextTick(function () {
            //handle_achievement_swipes()
        });
    });
}


function show_settings()
{
    account_settings.settings_visible = true;
    account_settings.button_visible = false;
}
async function firebase_get_achievements()
{
    db_ref_achievements = firebase.database().ref('users/' + uid + 
    "/actions/");

   await db_ref_achievements.once('value', function(snapshot) {
        achievements.cards = [];
        for(key in snapshot.val())
        {
            var action = snapshot.val()[key];
            if(action.winner_id != uid)
                continue
            console.log(action);
            EXPANSIONS.forEach(function(e){
                if(action.card_id.includes(e))
                {
                    if(achive_map[e] == undefined)
                        achive_map[e] = []
                    achive_map[e].push({id:action.card_id,loser_id:action.loser_id,text:action.card_text});
                    console.log(achive_map);
                }
            })
        }
    });
}


async function handle_achievement_swipes()
{
    achievement_element = document.getElementById('card');
    achievement_element.addEventListener('touchstart', handle_touch_start, true);
    achievement_element.addEventListener('touchmove', handle_touch_move, true);
}

function getTouches(evt) {
    console.log("2")
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handle_touch_start(evt) {
    console.log("3")
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                                                           
};                                                

async function handle_touch_move(evt) {
    if (!xDown || is_moving) {
        return;
    }
console.log("4")
    var xUp = evt.touches[0].clientX;                                    
    var xDiff = xDown - xUp;

    //Right = + Left = -
 
    var offsets = achievement_element.getBoundingClientRect();
    console.log(xDiff)

        var i = achievement_box.index;
        if ( xDiff > 0 )
        {
            if(i + 1 <= achive_map['vanilla'].length - 1)
            {
                console.log("5")
                achievement_box.index++;
                //achievement_box.text = achive_map['vanilla'][achievement_index].text
            }
        } 
        else
        {  
            if(i - 1 >= 0)
            {
                console.log("6")
                achievement_box.index--;
                //achievement_box.text = achive_map['vanilla'][achievement_index].text
            }
        }                                                                                                 
        xDown = null;   
};