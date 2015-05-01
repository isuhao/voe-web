/**
 * Created by cai on 15-4-22.
 */

function element_clicked(sid)
{
    // redirect to server_detail page
    var url = 'detail.html?server_id=' + sid;

    reload_page(url);
}

function display_channel_flow(flowjson)
{
    for (var i=0; i< flowjson.length; i++)
    {
        var flownode = flowjson[i];
        var sid = flownode['server_id'];
        var pid='';
        var opt_height = 50;

        if (flownode.parent_server_id)
        {
            pid = flownode['parent_server_id'] | 0;
        }

        var href = 'detail.html?server_id=' + sid;

        var textlabel = 'server_id: ' + sid + '\n';
        textlabel += 'channel_id: ' + flownode['channel_id'] + '\n';

        textlabel += 'urls: ' ;

        var stream_urls = flownode['stream_urls'];

        for (var j=0; j < stream_urls.length; j++)
        {
            textlabel += stream_urls[j] + '\n';

            opt_height += 15;
        }


        o.setSize(150, opt_height);
        o.addNode(sid|0, pid, 'u', textlabel, 0, href);

    }

    o.drawChart('channle_flow_canvas');

}

window.real_ready = function()
{
    $("title").text('VOE 管理页面 - 频道流');

    var cid = $.getUrlParam('channel_id');
    ajaxpost("api/get_channel_flow", {"channel_id" : cid|0 }, display_channel_flow);

    jQuery('#channle_flow_canvas').resize(function () {
            o.redrawChart('channle_flow_canvas');
        }
    );
};
