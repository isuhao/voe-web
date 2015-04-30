/**
 * Created by cai on 15-4-21.
 */
(function($){
    $.getUrlParam = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    }
})(jQuery);

function ajaxpost(_url, jsondata, callback)
{
    $.ajax({
        type : "POST",
        url : _url,
        data : JSON.stringify(jsondata),
        success : function(data)
        {
            var server_return = eval(data);

            callback(server_return);
        }
    });
}

function reload_page(pageurl)
{
    //if (window.history.pushState) {
    //    var state = {
    //        title: document.title
    //        , url: document.location.href
    //    };
    //    var url = pageurl;
    //    window.history.pushState(state, document.title, url);
    //}

    window.location=pageurl;
}
