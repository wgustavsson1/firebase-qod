
//FB Graph API explorer: https://developers.facebook.com/tools/explorer
//FB Graph Docs https://developers.facebook.com/docs/graph-api/reference
//FB SDK is a js wrapper for the Graph API see Graph API for functionallity
//FB SDK Docs https://developers.facebook.com/docs/javascript/reference/v3.2

//TODO: REMOVE BEFORE PRODUCTION!
//TOKEN: "EAAEdK7xJQYABAC5EgGqTqw8JnykLbWoS24ajObYc7ihe4Gxss12d2Take6t7N1EusNxn4NMeNMtrK4VUY2HcRR9pcwWN8ZA1ZCr92znUxI8dXYMzvP0pNagDFndFh12TJif22NqbelL1pHtRBHZCYqujuknA87ZCBPwZB734fPL2Q33mc2rDZADzOClUmijGxE7XBxkcUD3AZDZD"
//USER-ID: "3641096389250078"

var FBLocalStorage = {  
    get: function (key) {  
        var value = localStorage[key];  
        if (value != null) {  
            var model = JSON.parse(value);  
            if (model.payload != null && model.expiry != null) {  
                var now = new Date();
                if (now > Date.parse(model.expiry)) {  
                    localStorage.removeItem(key);  
                    return null;  
                }  
            }  
            return JSON.parse(value).payload;  
        }  
        return null;  
    },  
    set: function (key, value, expirySeconds) {  
        var expiryDate = new Date();  
        expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds);  
        localStorage[key] = JSON.stringify({  
            payload: value,  
            expiry: expiryDate  
        });  
    }  
};

var fb_friend_count = null;
var fb_friend_count_word = null;
var name = null;
var uid = null;
var profile_src = null;

var fb_friends = [];
var fb_friends_map = {};

var uid = null;
var name = null;
var profile_src = null;

var fb_users = {};


async function fb_get_user_data()
{
    if(FBLocalStorage.get('user') != null)
    {
        var profile = new Vue({
        el: '#header',
        data: {
        name: name,
        profile_src: profile_src
        }
        });
    }
    else
    {
        get_user_data();
        FBLocalStorage.set('user',uid,2);
    }
}
function get_user_data()
{
    FB.api('/me', function(response) {
        name = response.name;
        uid = response.id;
        console.log(uid)
        fb_get_user(uid)
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
    if(FBLocalStorage.get('friends') != null)
        return;

    FBLocalStorage.set('friends',fb_friends_map,60*1);
    fb_friends = [];
    FB.api('/me/friends','GET',{}, function(response) {
        console.log(response['data']);
        response['data'].forEach(function(obj){
            var friend_name = obj['name']
            var friend_uid = obj['id']
            fb_get_user(friend_uid);    
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


async function fb_get_user_picture(user_id)
{
    var pic;
     FB.api('/' + user_id + "/picture?redirect=false",function(response) {
        pic = response.data.url
        fb_users[user_id] = {};
        fb_users[user_id]['profile_pic'] = pic;
    });
    return pic;
}


var pics = [];
function fb_get_user_pictures(users,callback)
{
    for(var i in users)
    {
        FB.api('/' + users[i] + "/picture?redirect=false",function(response) {
            console.log(response.data.url)
            pics.push(response.data.url);
            fb_users[users[i]] = {};
            fb_users[users[i]]['profile_pic'] = response.data.url;
            console.log(fb_users[users[i]]['profile_pic'] + "piiic")
        });
    }
    console.log("list " + pics)
    callback(pics)
}


async function fb_get_user(user_id)
{
    var profile_src = await fb_get_user_picture(user_id);
    FB.api('/' + user_id + '/', function(response) {
        //u = {id:response.id,name:response.name};
        fb_users[user_id]['id'] = response.id;
        fb_users[user_id]['name'] = response.name;
    });
    return fb_users[user_id];
}