
function FBLogin()
{
    var provider = new firebase.auth.FacebookAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook graph API to read and write data from/to the users FB-account
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        alert("Logged in!");
        console.log(user);
        window.location = "/home?token=" + token
        
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
}
