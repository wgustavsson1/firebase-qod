var profile_id = null;
var expansions_box = null;
var achievement_box = null;

var achievement_element = null;
var account_settings = null;
var achievements = [];

var achive_map = {};

//TODO: FIX non hardcoded solution
const EXPANSIONS = ["vanilla","moonshine","dirty"];
const EXPANSIONS_NAME_MAP = {vanilla:'Original', moonshine:'Hembränt',dirty:'Sex & Snusk',flirt:'Flört'}

var index_map = {};

async function setup_profile(p_id)
{   
    profile_id = p_id;
    var profile = new Vue({
        el: '#header',
        data: {
        profile_uid: profile_id,
        name: fb_users[profile_id].name,
        profile_src: fb_users[profile_id].profile_pic
        }
        });
    
    achievements = [];
    achive_map = {};

    expansions_box = new Vue ({el: '#expansions-wrapper',
         data: {
            exps: EXPANSIONS_NAME_MAP,
            visible:false
        }
    });
    
    achievement_box = new Vue({el: '#achievements',
    data: {
        es: EXPANSIONS,
        achievements: null,
        indexes: index_map,
        text: null,
        visible: false
        }
    });

    account_settings = null;
    account_settings = new Vue({el: '#settings-wrapper',
    data: {
        visible: false,
        button_visible:false,
        settings_visible:false,
        text: "Account Settings"
        }
    });
    //If the profile is myself
    if(profile_id == uid)
    {
        account_settings.button_visible = true;
    }
    firebase_get_achievements().then(function(response){
        console.log(5)
        expansions_box.visible = true;
        achievement_box.achievements = achive_map;
        achievement_box.visible = true;
        Vue.nextTick(function () {
            handle_achievement_swipes()
        });
    });
}

function profile_clicked(profile_element)
{
   id = profile_element.id
   console.log(id);
   loadPage("profile.html").then(function(){
        setup_profile(id);
    });
}


function show_settings()
{
    account_settings.settings_visible = true;
    expansions_box.visible = false;
    achievement_box.visible = false;
    account_settings.button_visible = false;
}
async function firebase_get_achievements()
{
    db_ref_achievements = firebase.database().ref('users/' + profile_id + 
    "/actions/");

   await db_ref_achievements.once('value', function(snapshot) {
       console.log(1)
        achievements.cards = [];
        for(key in snapshot.val())
        {
            console.log(2)
            var action = snapshot.val()[key];
            if(action.winner_id != profile_id)
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