async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

// this is your `load_home() function`
async function loadPage(page) {
    const contentDiv = document.getElementById("page");
    contentDiv.innerHTML = await fetchHtmlAsText(page);
}

document.getElementById("footer_menu_home").onclick = function()
{       document.location.href = "home.html";
        setupFB();
};

document.getElementById("footer_menu_profile").onclick = function()
{
    loadPage("profile.html").then(function(){
        setupFB();
    });
};

document.getElementById("footer_menu_friends").onclick = function()
{
    loadPage("friends.html").then(function(){
        setupFB();
        get_friends();
    });
};

document.getElementById("button-start").onclick = function()
{
    loadPage("create_lobby.html").then(function(){
        setupFB();
        setUp();
        document.getElementById("button-create-lobby").addEventListener("click",create_lobby);
    });
};

document.getElementById("button-join").onclick = function()
{
    loadPage("join_lobby.html").then(function(){
        setupFB();
        setup_scanner();
        document.getElementById("button-join-party").onclick = function()
        {
            firebase_add_game();
            loadPage("lobby.html").then(function(){
            setupFB();
            join_lobby();
         });
        };
    });
};


