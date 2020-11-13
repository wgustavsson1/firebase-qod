var friend_list = null;

function setup_friends()
{
    friend_list = new Vue({
        el: '#friend-list',
        data: {
        friends:fb_friends,
        friend_count: fb_get_friend_count(),
        friend_count_word: fb_get_friend_count_word(fb_get_friend_count())
        }
    });
}