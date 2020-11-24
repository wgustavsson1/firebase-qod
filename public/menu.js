var menu = null;
function slide_toggle()
{
    menu = document.getElementById("footer_menu")
    if(menu.className == "slide_in" || menu.className == "")
    {
        menu.className = "slide_out"
    }
    else
    {
        menu.className = "slide_in"
    }
}