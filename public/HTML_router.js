async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

// this is your `load_home() function`
async function loadPage(page) {
    const contentDiv = document.getElementById("page");
    contentDiv.innerHTML = await fetchHtmlAsText(page);
}


function add_home_click_listeners()
{
    add_footer_menu_listeners();
    add_buttons_listeners();
}

function add_buttons_listeners()
{
    document.getElementById("button-start").onclick = function()
        {
            loadPage("create_lobby.html").then(function(){
                setUp();
                document.getElementById("button-create-lobby").addEventListener("click",create_lobby);
            });
        };

        document.getElementById("button-join").onclick = function()
        {
            loadPage("join_lobby.html").then(function(){
                setup_scanner();
                document.getElementById("button-join-party").onclick = function()
                {
                    firebase_add_game(null);
                    loadPage("lobby.html").then(function(){
                    join_lobby();
                });
                };
            });
        };
}

function add_footer_menu_listeners()
{
    document.getElementById("footer_menu_home").onclick = function()
    {       loadPage("play.html").then(function(){
            fb_get_user_data();
            add_home_click_listeners();
            leave_lobby();
        });
    };

    document.getElementById("footer_menu_profile").onclick = function()
    {
        loadPage("profile.html").then(function(){
             fb_get_user_data();
             setup_profile(true);
             leave_lobby();
        });
    };

    document.getElementById("footer_menu_wall").onclick = function()
    {
        loadPage("wall.html").then(function(){
             fb_get_friends()
             setupWall();
             leave_lobby();
        });
    };

    document.getElementById("footer_menu_friends").onclick = function()
    {
        loadPage("friends.html").then(function(){
            fb_get_friends()
            setup_friends();
            leave_lobby();
        });
    };
}


