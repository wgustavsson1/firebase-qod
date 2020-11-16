
function setup_profile(is_me)
{
    achievements = new Vue({el: '#card-wrapper',
    data: {
        cards: [],
        visible:false
        }
    });
    sign_out = new Vue({el: '#sign-out',
    data: {
        visible:is_me
        }
    });
    firebase_get_achievements();
}

function firebase_get_achievements()
{
    db_ref_achievements = firebase.database().ref('users/' + uid + 
    "/achievements/");

    db_ref_achievements.on('value', function(snapshot) {
        achievements.cards = [];
        for(key in snapshot.val())
        {
            achievements.cards.push({id:snapshot.val()[key].id,text:snapshot.val()[key].text});
        }
        achievements.visible = true;
    });
}