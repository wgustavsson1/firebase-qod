var achievement_box = null;

var achievement_element = null;
var account_settings = null;
var achievements = [];

var achievement_index = 0;


function setup_profile(is_me)
{
    achievement_box = new Vue({el: '#card-wrapper',
    data: {
        text: null,
        visible: false
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
        console.log(achievements);
        achievement_box.text = achievements[achievement_index];
        achievement_box.visible = true;
        handle_achievement_swipes()
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
    "/achievements/");

    db_ref_achievements.once('value', function(snapshot) {
        achievements.cards = [];
        for(key in snapshot.val())
        {
            console.log(key)
            achievements.push(snapshot.val()[key].text);
        }
    });
}


async function handle_achievement_swipes()
{
    achievement_element = document.getElementById('achievement');
    achievement_element.addEventListener('touchstart', handle_touch_start, true);
    achievement_element.addEventListener('touchmove', handle_touch_move, true);
}

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handle_touch_start(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                                                           
};                                                

async function handle_touch_move(evt) {
    if (!xDown || is_moving) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var xDiff = xDown - xUp;

    //Right = + Left = -
 
    var offsets = achievement_element.getBoundingClientRect();

        if ( xDiff > 0 )
        {
            achievement_index++;
            achievement_box.text = achievements[achievement_index]
        } 
        else
        {  
            achievement_index--; 
            achievement_box.text = achievements[achievement_index]
        }                                                                                                 
        xDown = null;   
};