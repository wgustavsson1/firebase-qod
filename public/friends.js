var friend_list = null;

async function setup_friends()
{   
    await fb_get_friends();

    friend_list = new Vue({
        el: '#friend-list',
        data: {
        friends:fb_friends,
        friend_count: fb_friends.length,
        friend_count_word: inWords(fb_friends.length)
        }
    });
}
