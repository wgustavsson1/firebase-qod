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
    console.log(uid)
    db_ref_actions = firebase.database().ref('users/' + uid + 
    "/actions/");
            db_ref_actions.on('value', function(snapshot) {
                var actions = [];
                console.log("2")
                console.log(snapshot.val())
                for(key in snapshot.val())
                {   
                    //TODO: check if node key id is in frind_ids
                        var map = {};
                        map['loser_id'] = snapshot.val()[key].loser_id
                        map['winner_id'] = snapshot.val()[key].winner_id
                        map['card_id'] = snapshot.val()[key].card_id
                        map['card_text'] = snapshot.val()[key].card_text

                        loser_id = snapshot.val()[key].loser_id
                        winner_id = snapshot.val()[key].winner_id
                        if(friend_ids[winner_id] != undefined || 
                        friend_ids[loser_id] != undefined)
                        {
                            actions.push(map);
                        }
                }
                wall.actions = actions;
        });
}