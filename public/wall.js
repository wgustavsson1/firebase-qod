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
        db_ref_actions.once('value', async function(snapshot) {
            var actions = [];
            console.log("2")
            console.log(snapshot.val())
            for(key in snapshot.val())
            {   
                var map = {};
                loser_id = snapshot.val()[key].loser_id
                winner_id = snapshot.val()[key].winner_id
                await fb_get_user(loser_id)
                await fb_get_user(winner_id)

                map['loser_id'] = snapshot.val()[key].loser_id
                map['winner_id'] = snapshot.val()[key].winner_id
                map['card_id'] = snapshot.val()[key].card_id
                map['card_text'] = snapshot.val()[key].card_text

                map['winner_pic'] = fb_friends_map.winner_id
                map['loser_pic'] = fb_friends_map.loser_id

                //If friends or me
                if(fb_friends_map[winner_id] !== undefined || 
                fb_friends_map[loser_id] !== undefined || uid !== loser_id || uid !== winner_id)
                {
                    actions.push(map);
                }
            }
            wall.actions = actions;
            console.log("actions " + actions)
    });
}