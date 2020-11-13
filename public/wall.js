var db_ref_actions = null;
var wall = null;

function setupWall()
{
     wall = new Vue({el: '#feed',
        data: {actions:[]
          }
        });

    console.log("1")
    firebase_get_actions();
}

async function firebase_get_actions()
{
    db_ref_actions = firebase.database().ref('users/' + uid + 
    "/actions/");
        db_ref_actions.once('value', function(snapshot) {
            var actions = [];
            console.log("2")
            console.log(snapshot.val())
            for(key in snapshot.val())
            {   
                var map = {};
                map['loser_id'] = snapshot.val()[key].loser_id
                map['winner_id'] = snapshot.val()[key].winner_id
                map['card_id'] = snapshot.val()[key].card_id
                map['card_text'] = snapshot.val()[key].card_text
                map['loser_pic'] = fb_get_user_picture(map['loser_id'])
                map['winner_pic'] = fb_get_user_picture(map['winner_id'])
            
                loser_id = snapshot.val()[key].loser_id
                winner_id = snapshot.val()[key].winner_id
                //If friends or me
                if(fb_friends_map[winner_id] !== undefined || 
                fb_friends_map[loser_id] !== undefined || fb_friends_map[uid] !== undefined)
                {
                    actions.push(map);
                }
            }
            wall.actions = actions;
            console.log("actions " + actions)
    });
}