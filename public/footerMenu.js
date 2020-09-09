async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

// this is your `load_home() function`
async function loadPage(page) {
    const contentDiv = document.getElementById("page");
    contentDiv.innerHTML = await fetchHtmlAsText(page);
}

document.getElementById("footer_menu_home").onclick = function()
{
    loadPage("home.html").then(function(){
        setupPage();
    });
};

document.getElementById("footer_menu_profile").onclick = function()
{
    loadPage("profile.html").then(function(){
        setupPage();
    });
};

document.getElementById("footer_menu_friends").onclick = function()
{
    loadPage("friends.html").then(function(){
        setupPage();
    });
};

