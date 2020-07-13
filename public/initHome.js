
//FB Graph API explorer: https://developers.facebook.com/tools/explorer
//FB Graph Docs https://developers.facebook.com/docs/graph-api/reference
//FB SDK is a js wrapper for the Graph API see Graph API for functionallity
//FB SDK Docs https://developers.facebook.com/docs/javascript/reference/v3.2

//TODO: REMOVE BEFORE PRODUCTION!
//TOKEN: "EAAEdK7xJQYABAC5EgGqTqw8JnykLbWoS24ajObYc7ihe4Gxss12d2Take6t7N1EusNxn4NMeNMtrK4VUY2HcRR9pcwWN8ZA1ZCr92znUxI8dXYMzvP0pNagDFndFh12TJif22NqbelL1pHtRBHZCYqujuknA87ZCBPwZB734fPL2Q33mc2rDZADzOClUmijGxE7XBxkcUD3AZDZD"
//USER-ID: "3641096389250078"

var name = "";
var uid = "";

function setupPage()
{
    getFBData();
}
function getFBData()
{
    FB.api('/me', function(response) {
        console.log(response)
        name = response.name;
        uid = response.id;
        profile_src =  "https://graph.facebook.com/" + uid + "/picture?type=normal"
        var header = new Vue({
            el: '#header',
            data: {
              name: name,
              profile_src: profile_src
            }
          })
        FB.api('/me/friends','GET',{}, function(response) {
                console.log(response);
                friend_uid = response['data'][0]['id'];
                friend_name = response['data'][0]['name'];
                var friends = [];
                response['data'].forEach(function(obj){
                    profile_src = "https://graph.facebook.com/" + obj['id'] + "/picture?type=normal";
                    name = obj['name']
                    friends.push({profile_src:profile_src,name:name})
                });
                friend_count = response['data'].length;

                var friend_list = new Vue({
                    el: '#friend-list',
                    data: {
                      friends:friends,
                      friend_count: friend_count
                    }
                  })
            }
        );
    });
}