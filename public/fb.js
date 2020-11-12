
//FB Graph API explorer: https://developers.facebook.com/tools/explorer
//FB Graph Docs https://developers.facebook.com/docs/graph-api/reference
//FB SDK is a js wrapper for the Graph API see Graph API for functionallity
//FB SDK Docs https://developers.facebook.com/docs/javascript/reference/v3.2

//TODO: REMOVE BEFORE PRODUCTION!
//TOKEN: "EAAEdK7xJQYABAC5EgGqTqw8JnykLbWoS24ajObYc7ihe4Gxss12d2Take6t7N1EusNxn4NMeNMtrK4VUY2HcRR9pcwWN8ZA1ZCr92znUxI8dXYMzvP0pNagDFndFh12TJif22NqbelL1pHtRBHZCYqujuknA87ZCBPwZB734fPL2Q33mc2rDZADzOClUmijGxE7XBxkcUD3AZDZD"
//USER-ID: "3641096389250078"
var fb_friend_count = null;
var fb_friend_count_word = null;
var name = null;
var uid = null;
var profile_src = null;

var fb_friends = [];
var fb_friends_map = {};

async function fb_get_user_data()
{
    get_user_data();
}
function get_user_data()
{
    FB.api('/me', function(response) {
        name = response.name;
        uid = response.id;
        FB.api("/" + uid +  "/picture?redirect=false", function (response) {
            console.log(response);
            console.log("ID: " + uid);
            profile_src = response.data.url;

            var profile = new Vue({
            el: '#header',
            data: {
              name: name,
              profile_src: profile_src
            }
            });
        });
    });
}

async function fb_get_friends()
{
    FB.api('/me/friends','GET',{}, function(response) {
        console.log(response['data']);
        
        response['data'].forEach(function(obj){
            var friend_name = obj['name']
            var friend_uid = obj['id']
            console.log(obj)
        FB.api("/" + obj.id +  "/picture?redirect=false", function (response) {
            var friend_profile_src = response.data.url;
            fb_friends.push({id:friend_uid,profile_src:friend_profile_src,name:friend_name})
            fb_friends_map[friend_uid] =  {id:friend_uid,profile_src:friend_profile_src,name:friend_name};
            fb_friend_count = fb_friends.length;
            console.log(fb_friends_map + " map")
            });
        });
    });
}

function fb_get_friend_count()
{
    console.log("len2 " + fb_friend_count)
    return fb_friend_count;
}

function fb_get_friend_count_word()
{
    return inWords(fb_get_friend_count());
}