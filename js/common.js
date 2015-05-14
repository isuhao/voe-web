/**
 * Created by cai on 15-4-21.
 */
(function($){
    jQuery.getUrlParam = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    }
})(jQuery);

function ajaxpost(_url, jsondata, callback)
{
    jQuery.ajax(_url,{
        type : "POST",
        data : JSON.stringify(jsondata),
        success : function(data)
        {
            var server_return = eval(data);

            callback(server_return);
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });
}

function reload_page(pageurl)
{
    window.location=pageurl;
}

function format_ip(ips)
{
    var r= '';
    for(var i =0; i < ips.length; i++)
    {
        if (r=='')
        {

        }
        else
        {
            r += ', ';
        }
        r += ips[i];
    }

    return r;
}