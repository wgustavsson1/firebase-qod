
//FB Graph API explorer: https://developers.facebook.com/tools/explorer
//FB Graph Docs https://developers.facebook.com/docs/graph-api/reference
//FB SDK is a js wrapper for the Graph API see Graph API for functionallity
//FB SDK Docs https://developers.facebook.com/docs/javascript/reference/v3.2

//TODO: REMOVE BEFORE PRODUCTION!
//TOKEN: "EAAEdK7xJQYABAC5EgGqTqw8JnykLbWoS24ajObYc7ihe4Gxss12d2Take6t7N1EusNxn4NMeNMtrK4VUY2HcRR9pcwWN8ZA1ZCr92znUxI8dXYMzvP0pNagDFndFh12TJif22NqbelL1pHtRBHZCYqujuknA87ZCBPwZB734fPL2Q33mc2rDZADzOClUmijGxE7XBxkcUD3AZDZD"
//USER-ID: "3641096389250078"


profilePic = document.getElementById("profile-picture");
profilePic.setAttribute("src", "");
var name = "";
var uid = "";

function setupPage()
{
    FB.api('/me', function(response) {
        console.log(response)
        name = response.name;
        uid = response.id;
        document.getElementById("name").innerHTML = "Inloggad som " + name;
        profilePic.setAttribute("src", "http://graph.facebook.com/" + uid + "/picture?type=normal");
        FB.api('/me/friends','GET',{}, function(response) {
                console.log(response);
                friend_uid = response['data'][0]['id'];
                friend_name = response['data'][0]['name'];
                document.getElementById("friend-name").innerHTML = "QOD-kompis " + friend_name;
                document.getElementById("friend-picture").setAttribute("src", "http://graph.facebook.com/" + friend_uid + "/picture?type=normal");
            }
        );
    });

}