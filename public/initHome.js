
//FB Graph API explorer: https://developers.facebook.com/tools/explorer
//FB Graph Docs https://developers.facebook.com/docs/graph-api/reference
//FB SDK is a js wrapper for the Graph API see Graph API for functionallity
//FB SDK Docs https://developers.facebook.com/docs/javascript/reference/v3.2

//TODO: REMOVE BEFORE PRODUCTION!
//TOKEN: "EAAEdK7xJQYABAC5EgGqTqw8JnykLbWoS24ajObYc7ihe4Gxss12d2Take6t7N1EusNxn4NMeNMtrK4VUY2HcRR9pcwWN8ZA1ZCr92znUxI8dXYMzvP0pNagDFndFh12TJif22NqbelL1pHtRBHZCYqujuknA87ZCBPwZB734fPL2Q33mc2rDZADzOClUmijGxE7XBxkcUD3AZDZD"
//USER-ID: "3641096389250078"
var name = null;
var uid = null;
var fb_uid = null;
var profile_src = null;

function setupFB()
{
    getFBData();
}
function getFBData()
{
    FB.api('/me', function(response) {
        name = response.name;
        fb_uid = response.id;
        uid = response.id;
        console.log(response.id + " id")
        uid = response.id;
        FB.api("/" + uid +  "/picture?redirect=false", function (response) {
            console.log(response);
            console.log(response.data.url);
            profile_src = response.data.url;
            var header = new Vue({
            el: '#header',
            data: {
              name: name,
              profile_src: profile_src
            }
          });
        });
    });
}