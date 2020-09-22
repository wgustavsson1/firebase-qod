function get_friends()
{
    FB.api('/me/friends','GET',{}, function(response) {
                    console.log(response);
                    friend_uid = response['data'][0]['id'];
                    friend_name = response['data'][0]['name'];
                    var friends = [];
                    response['data'].forEach(function(obj){
                        FB.api("/" + obj.id +  "/picture?redirect=false", function (response) {
                            console.log(response);
                            console.log(response.data.url);
                            friend_profile_src = response.data.url;
                            friend_name = obj['name']
                            friends.push({profile_src:friend_profile_src,name:friend_name})
                        });
                    });
                    friend_count = response['data'].length;
                    friend_count_word = inWords(friend_count);

                    var friend_list = new Vue({
                        el: '#friend-list',
                        data: {
                        friends:friends,
                        friend_count: friend_count,
                        friend_count_word
                        }
                    })
                }
            );
}