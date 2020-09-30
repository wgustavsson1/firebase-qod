async function fb_login()
{
    window.fbAsyncInit = function() {
          FB.init({
            appId            : '313548656427392',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v7.0'
          });

       function login()
        {
            FB.login(function(response) { 
              if (response.status === 'connected') {
                fb_get_user_data();
              } else {
                  alert("Failed to connect to Facebook")
              }
            },{scope:'email,user_friends'});
          }

        function statusChangeCallback(response){ 
            console.log('statusChangeCallback');
            console.log(response);                   
            if (response.status === 'connected')
            {   
               fb_get_user_data();
            } 
            else{                                
              login();
              }
            }

          FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
          });
      };
}


function firebase_login()
{
    var user = firebase.auth().currentUser;

    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    }

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_friends');
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook graph API to read and write data from/to the users FB-account
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        test = "hej hej hej!"
        window.location = "/home"
        
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log("ERROR: " + errorCode)
        // ...
      });
}