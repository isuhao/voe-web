/**
 * Created by cai on 15-5-12.
 */
window.current_nav_page = 'nav-li-managment';
var pages = {
    "index.html" : "nav-li-managment",
    "channel_flow.html": "nav-li-channel-flow",
    "detail.html": "nav-li-servers",
    "channels.html": "nav-li-channels",
    "license.html": "nav-li-license"
};

(function(){
    var str = window.location.pathname;
    str = str.substring(str.lastIndexOf("/") + 1);
    if (str.length > 0)
    {
        window.current_nav_page = pages[str];
    }
})();

$('#' + window.current_nav_page).addClass("active");

function voe_check_login()
{
    $(document).ready(function(){
        submit_check_login(on_check_login_return);
    });
}
