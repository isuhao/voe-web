/**
 * Created by cai on 15-5-6.
 */

window.server_id = jQuery.getUrlParam('server_id');
window.curpage = $.getUrlParam('curpage');
if (window.curpage == null)
{
    window.curpage = 1;
}
window.curpage = window.curpage |0;
window.server_id = window.server_id|0;

var tr_template = '<tr class="success" id="trid{rowid}">\
            <td id="tdid_{rowid}_0">{is_enable_str}</td>\
            <td id="tdid_{rowid}_1">{server_id}</td>\
            <td id="tdid_{rowid}_2">{channel_id}</td>\
            <td id="tdid_{rowid}_3">{source_url_auto}</td>\
            <td id="tdid_{rowid}_4">{bind_address}</td>\
            <td id="tdid_{rowid}_5">{updown_status.heath}</td>\
            <td id="tdid_{rowid}_6">{updown_status.upload_speed_auto}</td>\
            <td id="tdid_{rowid}_7">{updown_status.download_speed_auto}</td>\
        <td id="tdid_{rowid}_8">\
          <!-- Split button -->\
        <div class="btn-group">\
            <button type="button" id="edit_channel_buttion_{rowid}" class="btn btn-info" data-toggle="modal" data-target="#edit_server_channel" onclick="show_edit_channel({rowid}, {server_id},{channel_id});">编辑</button>\
            <a type="button" class="btn btn-info" href="channel_flow.html?channel_id={channel_id}" target="_blank">查看频道流转</a>\
            <button type="button" class="btn btn-info" onclick="dettach_channel({server_id},{channel_id})">删除频道</button>\
        </div>\
        </td>\
        </tr>';

function format_speed(speed)
{
    if ( speed < 1024 )
    {
        return speed + " Byte/s";
    }
    else if ( speed < 1024*1024 )
    {
        return (speed / 1024).toFixed(2) + ' KiB/s';
    }
    else if ( speed < 1024*1024*1024 )
    {
        return (speed / 1024 / 1024).toFixed(2) + ' MiB/s';
    }
}

var table_length = 0;

function prepare_template_data(thisrow)
{
    if (! thisrow.updown_status)
    {
        thisrow.updown_status = { heath : -1,upload_speed_auto:0, download_speed_auto:0 };
    }
    else
    {
        thisrow.updown_status.upload_speed_auto = format_speed(thisrow.updown_status.upload_speed);
        thisrow.updown_status.download_speed_auto= format_speed(thisrow.updown_status.download_speed);
    }

    thisrow.is_enable_str = "禁用";
    if (thisrow.is_enable)
    {
        thisrow.is_enable_str = "启用";
    }

    if (thisrow.is_chain_leader) {
        thisrow.source_url_auto = thisrow.source_url;
    }
    else {
        thisrow.source_url_auto = '用{1}从<a href="detail.html?server_id={0}">服务器{0}</a>拉取'.format(thisrow.upstream_server_id, thisrow.upstream_protocol);
    }

    return thisrow;
}

function full_table_populate(populatedata)
{
    var table_content ='';

    for (var i = 0; i < populatedata.length; i++)
    {
        var this_row = populatedata[i];
        this_row.rowid = i;
        this_row = prepare_template_data(this_row);
        // 循环插入表格.
        var newtr = tr_template.format(this_row);

        table_content += newtr;
    }

    if (table_content != jQuery("#the_table_body").html())
    {
        table_length = populatedata.length;
        jQuery("#the_table_body").html(table_content);
    }
}

function update_or_no_touch_dom_html(dom, content)
{
    if (dom.html() != content)
    {
        dom.html(content);
    }
}


function update_server_list(update_ready)
{
    submit_get_server_list(function (_server_list)
    {
        window.server_list = _server_list;
        var server_list = _server_list;

        var optionlist = '<option value=""></option>';
        optionlist = '';

        for (var i = 0; i < server_list.length; i++)
        {
            optionlist += '<option value="{0}">{0}</option>\n'.format(server_list[i]);
        }
        $("#server_id_select_list").html(optionlist);
//        $("#upstream_server_id").html(optionlist);
        $("#server_id_list").html(optionlist);

        if (window.server_id)
        {
            ;
//                $("#server_id_list").prop('value', window.server_id);
        }
        else
        {
            window.server_id = server_list[0];
        }
        $("#server_id_list").prop('value', window.server_id);

        update_ready();
    });
}


function update_channel_list(update_ready)
{
    submit_get_channel_list(1000, 1, function (jsonobj)
    {
        var _channel_list = [];
        for (var i = 0; i < jsonobj["data"].length; i++) {
            _channel_list[i] = jsonobj["data"][i].channel_id;
        }
        window.channel_list = _channel_list;
        var channel_list = _channel_list;

        var optionlist = '<option value=""></option>';
        optionlist = '';

        for (var i = 0; i < channel_list.length; i++)
        {
            optionlist += '<option value="{0}">{0}</option>\n'.format(channel_list[i]);
        }
        $("#channel_id_select_list").html(optionlist);

        update_ready();
    });
}

function update_data()	// 在窗口加载的时候，调用登陆，并且请求服务器状态数据。
{
    var server_id = window.server_id; $.getUrlParam('server_id');
    var page_size = 20;

    // 获取服务器状态数据.
    submit_grid_server_detail(page_size, window.curpage, server_id, function (data)	// 获取服务器状态数据.
    {
        $('#prepage').hide();
        $('#nextpage').hide();

        var jsonobj = eval(data);

        if (window.curpage > 1) {
            $('#prepage').prop('href', 'detail.html?curpage={0}'.format((window.curpage | 0) - 1));
            $('#prepage').show();
        }

        if (window.curpage < jsonobj["pageCount"]) {
            $('#nextpage').show();
            $('#nextpage').prop('href', 'detail.html?curpage={0}'.format((window.curpage | 0) + 1));
        }

        $('#curPage_indicator').html('当前第{curPage}页, 共{pageCount}页'.format(jsonobj));

        window.current_data = jsonobj['data'];

        if (table_length != jsonobj['data'].length)
            full_table_populate(jsonobj['data']);

        // 接下来只更新想更新的数据.
        for (var i = 0; i < jsonobj['data'].length; i++) {
            var this_row = jsonobj['data'][i];
            this_row.rowid = i;
            this_row = prepare_template_data(this_row);

            if ( $(("#the_table_body #tdid_{rowid}_2".format(this_row))).text() !=  this_row['channel_id'])
                full_table_populate(jsonobj['data']);

            update_or_no_touch_dom_html(
                $(("#the_table_body #tdid_{rowid}_5".format(this_row))),
                '{updown_status.heath}'.format(this_row)
            );

            update_or_no_touch_dom_html(
                $(("#the_table_body #tdid_{rowid}_6".format(this_row))),
                '{updown_status.upload_speed_auto}'.format(this_row)
            );

            update_or_no_touch_dom_html(
                $(("#the_table_body #tdid_{rowid}_7".format(this_row))),
                '{updown_status.download_speed_auto}'.format(this_row)
            );
        }

        // 有的不能在这里编辑is_chain_leader
        for (var i = 0; i < jsonobj['data'].length; i++) {
            var this_row = jsonobj['data'][i];

            if (this_row.is_chain_leader) {
                $("#edit_channel_buttion_{rowid}".format(this_row)).hide();
            }

        }

        setTimeout(update_data, 1300);
    });
}

function update_title()
{
    submit_get_server_config(server_id, function(data)
    {
        var jsonobj = eval(data);

        if (jsonobj['ip'] == null)
        {
            jsonobj.server_ip = '未在线';
        }
        else
        {
            jsonobj.server_ip = format_ip(jsonobj['ip']);
        }

        $("#table_title").html('SERVER_ID={1} 服务器详细情况({0} tcpport : {2} udpport :{3})'.format(jsonobj.server_ip, server_id, jsonobj.tport, jsonobj.uport));

        setTimeout(update_title, 9900);
    });
};

function show_edit_channel(rowid, server_id, channel_id)
{

    jQuery("#edit_server_channel #edit_channel_dialog #channel_id").val(channel_id);
    jQuery("#edit_server_channel #edit_channel_dialog #channel_id").prop('readonly', true);

    jQuery('#edit_server_channel #edit_channel_dialog #upstream_server_id').val(window.current_data[rowid].upstream_server_id);
    jQuery('#edit_server_channel #edit_channel_dialog #cache_size').val(window.current_data[rowid].cache_size);

    if (window.current_data[rowid].upstream_protocol == 'udp') {
        jQuery('#edit_server_channel #edit_channel_dialog #source_server_protocol_udp').prop('checked', true)
    } else {
        jQuery('#edit_server_channel #edit_channel_dialog #source_server_protocol_tcp').prop('checked', true)
    }

    jQuery('#edit_server_channel #edit_channel_dialog #is_enable').prop("checked", window.current_data[rowid].is_enable);

    jQuery("#edit_server_channel #channel_model_dialog_submit_buttion").unbind('click');
    jQuery("#edit_server_channel #channel_model_dialog_submit_buttion").click(mod_attached_channel);
}

function  show_add_channel()
{
    jQuery("#edit_server_channel #channel_id").val('');
    jQuery("#edit_server_channel #source_server_id").val('');
    jQuery("#edit_server_channel #bind_address").val('');
    jQuery("#edit_server_channel #source_server_protocol_udp").prop('checked', true);

    jQuery("#edit_server_channel #channel_id").prop('readonly', false);
    jQuery("#edit_server_channel #channel_model_dialog_submit_buttion").unbind('click');
    jQuery("#edit_server_channel #channel_model_dialog_submit_buttion").click(attach_channel);
}

function attach_channel() {
    var submitdata = {
        'server_id': window.server_id | 0,
        'channel_id': 0,
        'upstream_server_id': 0,
        'cache_size': 0,
        'is_enable': true
    };

    submitdata['channel_id'] = jQuery('#edit_channel_dialog #channel_id').val() | 0;
    submitdata['upstream_server_id'] = jQuery('#edit_channel_dialog #upstream_server_id').val() | 0;
    submitdata.upstream_protocol = "udp";

    if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked')) {
        submitdata.upstream_protocol = "http";
    }

    submitdata['cache_size'] = 1024 * ( jQuery('#edit_channel_dialog #cache_size').val() | 0 );
    submitdata['is_enable'] = jQuery('#edit_channel_dialog #is_enable').prop("checked");

    submit_attach_channel(submitdata, function (retcode, msg) {
        if (retcode == 0) {
            window.location = '';
        }
        else {
            alert('添加失败 : ' + msg);
        }
    });
}

function mod_attached_channel() {
    console.log('mod_attached_channel');

    var submitdata = {
        'server_id': window.server_id | 0,
        'channel_id': 0,
        'upstream_server_id': 0,
        'cache_size': 0,
        'is_enable': true
    };

    submitdata['channel_id'] = jQuery('#edit_channel_dialog #channel_id').val() | 0;
    submitdata['upstream_server_id'] = jQuery('#edit_channel_dialog #upstream_server_id').val() | 0;
    submitdata.upstream_protocol = "udp";

    if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked')) {
        submitdata.upstream_protocol = "http";
    }

    submitdata['cache_size'] = 1024 * ( jQuery('#edit_channel_dialog #cache_size').val() | 0 );
    submitdata['is_enable'] = jQuery('#edit_channel_dialog #is_enable').prop("checked");

    submit_mod_attched_channel(submitdata, function (retcode, msg) {
        if (retcode == 0) {
            window.location = '';
        }
        else {
            alert('修改失败 : ' + msg);
        }
    });
}


function dettach_channel(sid, cid)
{
    submit_dettach_channel(sid, cid, function (retcode)
    {
        // reload page
        if (retcode)
        {
            alert('失败');
        }
        window.location = '';
    });
}

$('#curPage_indicator').html('当前第{0}页'.format(window.curpage));

window.real_ready = function()
{
    update_server_list(function ()
    {
        if(window.server_id)
        {
            update_title();
            update_data();
        }else
        {
            window.location = "detail.html?server_id=" + server_list[0];
        }
    });

    update_channel_list(function(){});
};

window.server_list = {};
