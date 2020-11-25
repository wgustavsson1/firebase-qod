var achievement_box = null;

var achievement_element = null;
var account_settings = null;
var achievements = [];

var achive_map = {};

//TODO: FIX non hardcoded solution
const EXPANSIONS = ["vanilla","moonshine","dirty"];
const EXPANSIONS_NAME_MAP = {vanilla:'Original', moonshine:'Hembränt',dirty:'Sex & Snusk'}

var index_map = {};


async function setup_profile(is_me)
{
    achievement_box = new Vue({el: '#achievements',
    data: {
        es: EXPANSIONS,
        achievements: null,
        indexes: index_map,
        text: null,
        visible: false
        }
    });

    account_settings = new Vue({el: '#settings-wrapper',
    data: {
        visible: false,
        button_visible:true,
        settings_visible:false,
        text: "Account Settings"
        }
    });
    firebase_get_achievements().then(function(response){
        console.log(5)
        achievement_box.achievements = achive_map;
        achievement_box.visible = true;
        Vue.nextTick(function () {
            handle_achievement_swipes()
        });
    });
}


function show_settings()
{
    account_settings.settings_visible = true;
    achievement_box.visible = false;
    account_settings.button_visible = false;
}
async function firebase_get_achievements()
{
    db_ref_achievements = firebase.database().ref('users/' + uid + 
    "/actions/");

   await db_ref_achievements.once('value', function(snapshot) {
       console.log(1)
        achievements.cards = [];
        for(key in snapshot.val())
        {
            console.log(2)
            var action = snapshot.val()[key];
            if(action.winner_id != uid)
                continue
            console.log(action);
            EXPANSIONS.forEach(function(e){
                console.log(e)
                if(action.card_id.includes(e))
                {
                    console.log(4)
                    if(achive_map[e] == undefined)
                        achive_map[e] = []
                    achive_map[e].push({expansion_name:EXPANSIONS_NAME_MAP[e],id:action.card_id,loser_id:action.loser_id,text:action.card_text});
                    index_map[e] = 0;
                    console.log(achive_map);
                }
            })
        }
    });
}


async function handle_achievement_swipes()
{
    /*achievement_element = document.getElementById('card');
    achievement_element.addEventListener('touchstart', handle_touch_start, true);
    achievement_element.addEventListener('touchmove', handle_touch_move, true);*/

    card_elements = document.querySelectorAll('.card');

    card_elements.forEach(function(e){
        e.addEventListener('touchstart', handle_touch_start, true);
        e.addEventListener('touchmove', handle_touch_move, true);
    });

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


    //TODO: Make sure the touched card element is found not any child elements
    var element = document.elementFromPoint(evt.touches[0].clientX, evt.touches[0].clientY);
    if(element.className != "card")
        return;

    var touched_expansion = element.id;

    var i = index_map[touched_expansion]
    //Right = + Left = -
    if ( xDiff > 0 )
    {
        if(i + 1 <= achive_map[touched_expansion].length - 1)
        {
            console.log("5")
            index_map[touched_expansion] += 1;
            //TODO: A bit ugly approach
            achievement_box.$forceUpdate();
        }
    } 
    else
    {  
        if(i - 1 >= 0)
        {
            index_map[touched_expansion] -= 1;
            //TODO: A bit ugly approach
            achievement_box.$forceUpdate();
        }
    }                                                                                                 
    xDown = null;   
};