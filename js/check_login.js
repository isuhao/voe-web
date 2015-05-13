
function on_check_login_return(data)
{
    var result = eval(data);

    window.login_ok = result.is_login;


    if (result.no_license)
    {
        window.location = 'setup.html';
    }
    else if (!result.is_login)
    {
        window.location = 'sign-in.html';
    }else
    {
        if (window.real_ready)
            window.real_ready();
    }
}

function on_login_return(data)
{
    var result = eval(data);
    window.login_ok = result.is_login;

    if (!result.is_login)
    {
        alert('login failed!');
    }
    else
    {
        window.location = 'index.html';
        if (window.real_ready)
            window.real_ready();
    }
}
