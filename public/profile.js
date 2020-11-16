
function setup_profile()
{
    achievements = new Vue({el: '#card-box',
    data: {
        cards: [],
        visible:false
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