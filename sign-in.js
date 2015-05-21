/**
 * Created by cai on 15-5-13.
 */

if (window.location.hostname == "demo.bd2.tv")
{
    $("#username").val('root');
    $("#password").val('test');
}

function do_login()
{
    var username = $("#username").val();
    var password = $("#password").val();
    submit_login(username, password, on_login_return);
    return false;
}
