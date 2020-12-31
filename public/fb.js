
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

const CACHE_TIME_SHORT = 60;
const CACHE_TIME_MEDIUM = 180;
const CACHE_TIME_LONG = 3600;

var name = null;
var uid = null;
var profile_src = null;

var fb_friends = [];
var fb_friends_map = {};

var uid = null;
var name = null;
var profile_src = null;

var fb_users = {};



//Used only at login before the localStorage exist
async function get_my_user_data()
{
    FB.api('/me', function(response) {
        name = response.name;
        uid = response.id;
        FB.api("/" + uid +  "/picture?redirect=false", function (response) {
            console.log(response);
            console.log("ID: " + uid);
            profile_src = response.data.url;
            fb_users[uid] = {};
            fb_users[uid]['profile_pic'] = profile_src
            fb_users[uid].name = name
            setup_profile_component(uid);
            FBLocalStorage.set(uid,fb_users[uid],CACHE_TIME_MEDIUM);
        });
    });
}
async function fb_get_user_data(user_id)
{
    if(FBLocalStorage.get(user_id) != null)
    {
        let u = FBLocalStorage.get(user_id)
        fb_users[user_id].name = u.name
        fb_users[user_id].profile_src = u.profile_src
    }
    else
    {
        await fb_get_user(user_id);
        FBLocalStorage.set(user_id,fb_users[user_id],CACHE_TIME_MEDIUM);
    }
}
async function fb_get_friends()
{
    if(FBLocalStorage.get('fb_friends') != null)
    {
        let f_list = FBLocalStorage.get('fb_friends')
        let f_map = FBLocalStorage.get('fb_friends_map')
        let f_users = FBLocalStorage.get('fb_users')
        fb_friends= f_list;
        fb_friends_map = f_map;
        fb_users = f_users;
        return;
    }

    fb_friends = [];
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

            fb_users[friend_uid] = {}
            fb_users[friend_uid]['id'] = friend_uid 
            fb_users[friend_uid]['name'] = friend_name
            fb_users[friend_uid]['profile_pic'] = friend_profile_src

            console.log()
            FBLocalStorage.set('fb_friends',fb_friends,CACHE_TIME_MEDIUM);
            FBLocalStorage.set('fb_friends_map',fb_friends_map,CACHE_TIME_MEDIUM);
            FBLocalStorage.set('fb_users',fb_users,CACHE_TIME_MEDIUM);
            });
        });
    });
}

async function fb_get_user(user_id)
{
    var profile_src = await fb_get_user_picture(user_id);
    FB.api('/' + user_id + '/', function(response) {
        //u = {id:response.id,name:response.name};
        console.log(user_id)
        fb_users[user_id]['id'] = response.id;
        fb_users[user_id]['name'] = response.name;
        fb_users[user_id]['profile_pic'] = profile_src;
    });
}


function fb_get_user_picture(user_id)
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