var menu = null;
var vue_menu = null;

function setup_menu()
{
    if(vue_menu == null)
    {
        vue_menu = new Vue({el: '#footer_menu',
        data: {
        expanded : false
        }
        });
    }
}
function slide_toggle()
{
    menu = document.getElementById("footer_menu")
    if(menu.className == "slide_in" || menu.className == "")
    {
        menu.className = "slide_out"
        vue_menu.expanded = true;
    }
    else
    {
        menu.className = "slide_in"
        vue_menu.expanded = false;
    }
}