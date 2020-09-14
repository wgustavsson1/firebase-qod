function invite_friends()
{
     FB.ui({
        app_id:'313548656427392',
        method: 'send',
        name: "mitt namn",
        message: 'A request especially for one person.',
        description:"min description",
        link: "https://www.google.com",
        display:"popup"

});
}