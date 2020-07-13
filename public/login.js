function FBLogin()
{
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_friends');
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook graph API to read and write data from/to the users FB-account
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
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