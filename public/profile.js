
var profile_id = null;
var expansions_box = null;
var achievement_box = null;

var achievement_element = null;
var account_settings = null;
var achievements = [];

var achive_map = {};

var selected_expansion = null;
var selected_expansion_name = null;

var index_map = {};

function setup_profile_component(p_id)
{
    var profile = new Vue({
        el: '#header',
        data: {
        profile_uid: p_id,
        name: fb_users[p_id].name,
        profile_src: fb_users[p_id].profile_pic
        }
    });
}

async function setup_profile(p_id)
{   
    setup_profile_component(p_id)
    await fb_get_friends();
    
    profile_id = p_id;
    achievements = [];
    achive_map = {};


    expansions_box = new Vue ({el: '#expansions-wrapper',
         data: {
            exps: expansion_map,
            visible:false
        }
    });
    
    achievement_box = new Vue({el: '#achievements-wrapper',
    data: {
        selected_expansion: null,
        users: fb_users,
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
        expansions_box.visible = true; //TODO: Move to after then()
        //achievement_box.achievements = achive_map;
        Vue.nextTick(function () {
            //handle_achievement_swipes()
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


var animation_completed = true;

function expansion_clicked(element)
{
    //If the expansion is already rendered but pressed again
    if(element.id == selected_expansion_name || !animation_completed)
        return;

    if(achive_map[element.id] == undefined)
    {
        selected_expansion_name = null;
        return;
    }

    animation_completed = false;
    //Start expansion animation
    element.classList.add("rotate");
    
    exp_markers = document.querySelectorAll('.expansion-marker');
    exp_markers.forEach(function(e){
        e.classList.remove("selected_expansion")
    });

    console.log(element.id)
    element.classList.add("selected_expansion");
    selected_expansion_name = element.id;
    selected_expansion = achive_map[selected_expansion_name];

    clear_achievements_from_expansion(selected_expansion);

    achievement_box.selected_expansion = selected_expansion

    Vue.nextTick(function () {
        achievement_box.visible = true;
        animate_achievements(element);
     });
}

function clear_achievements_from_expansion(expansion)
{
    if(expansion ==  null || expansion == undefined)
        return;

    expansion.forEach(function(e){
        e.visible = false;
        console.log("hide " + e);
    });
    achievement_box.selected_expansion = null;
}

function animate_achievements(expansion_element)
{
    
    const nr_of_achievements = achievement_box.selected_expansion.length;
    const ANIMATION_SPEED_UP_FACTOR = 10;

    var current_animation_time = 0;
    achievement_box.selected_expansion.forEach(function(a,i) {

        current_animation_time = ((1000 - (nr_of_achievements * ANIMATION_SPEED_UP_FACTOR)) * (i+1));

        console.log("index" + i)
        console.log("achievements" + nr_of_achievements)


        setTimeout(function(){
            a.visible = true;
            console.log(a);
            Vue.nextTick(function () {
                var element = document.getElementById(a.id);
                if(element == null || element == null)
                    return;
                console.log(element)
                if(!element.classList.contains("shake"))
                {
                    element.classList.add("shake")
                }
            });
            if(i == nr_of_achievements - 1)
            {
                finish_animation();
            }
        },current_animation_time);

     });

    function finish_animation()
    {
        setTimeout(function(){
            console.log("finished")
            card_elements = document.querySelectorAll('.shake');
            card_elements.forEach(function(e){
                e.classList.remove("shake")
            });
            expansion_element.classList.remove("rotate");
            animation_completed = true;
        },3000); //TODO: Tweek timeout time to match the animation time
    }
}

async function firebase_get_achievements()
{
    db_ref_achievements = firebase.database().ref('users/' + profile_id + 
    "/actions/");

   await db_ref_achievements.once('value', function(snapshot) {
        achievements.cards = [];
        for(key in snapshot.val())
        {
            console.log(2)
            var action = snapshot.val()[key];
            if(action.winner_id != profile_id)
                continue
            console.log(action);
            expansion_keys_list.forEach(function(e){
                console.log(e)
                if(action.card_id.includes(e))
                {
                    console.log(4)
                    if(achive_map[e] == undefined)
                        achive_map[e] = []
                    achive_map[e].push({expansion_name:expansion_map[e],id:action.card_id,loser_id:action.loser_id,
                        text:action.card_text,visible:false});
                    console.log(achive_map);
                }
            })
        }
    });
}