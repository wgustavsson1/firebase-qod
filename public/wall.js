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
                const loser_id = snapshot.val()[key].loser_id
                const winner_id = snapshot.val()[key].winner_id
                await fb_get_user(loser_id)
                await fb_get_user(winner_id)

                map['loser_id'] = snapshot.val()[key].loser_id
                map['winner_id'] = snapshot.val()[key].winner_id
                map['card_id'] = snapshot.val()[key].card_id
                map['card_text'] = snapshot.val()[key].card_text

                console.log(winner_id)
                console.log(loser_id)
                console.log(fb_users[winner_id])
                console.log(fb_users[loser_id]) 
                map['winner_pic'] = fb_users[winner_id].profile_src
                map['loser_pic'] = fb_users[loser_id].profile_src
                console.log(map['loser_pic'] + " pic")

                map['winner_name'] = fb_users[winner_id].name
                map['loser_name'] = fb_users[loser_id].name

                console.log(fb_users)

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