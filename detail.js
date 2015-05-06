/**
 * Created by cai on 15-5-6.
 */

window.server_id = jQuery.getUrlParam('server_id');

var tr_template = '<tr class="success" id="trid{rowid}">\
            <td id="tdid_{rowid}_0">{is_enable_str}</td>\
            <td id="tdid_{rowid}_1">{server_id}</td>\
            <td id="tdid_{rowid}_2">{channel_id}</td>\
            <td id="tdid_{rowid}_3">{source_url}</td>\
            <td id="tdid_{rowid}_4">{bind_address}</td>\
            <td id="tdid_{rowid}_5">{updown_status.heath}</td>\
            <td id="tdid_{rowid}_6">{updown_status.upload_speed_auto}</td>\
            <td id="tdid_{rowid}_7">{updown_status.download_speed_auto}</td>\
        <td id="tdid_{rowid}_8">\
          <!-- Split button -->\
        <div class="btn-group">\
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#edit_channel" onclick="edit_channel_detail({server_id},{channel_id},\'{source_url}\', {is_enable}, {url_type});">编辑</button>\
            <a type="button" class="btn btn-info" href="channel_flow.html?channel_id={channel_id}" target="_blank">查看频道流转</a>\
            <button type="button" class="btn btn-info" onclick="del_channel({server_id},{channel_id})">删除频道</button>\
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

function update_data()	// 在窗口加载的时候，调用登陆，并且请求服务器状态数据。
{
    var server_id = $.getUrlParam('server_id');

    $.ajax({
        type: "POST",
        url: "api/grid_server_detail?server_id=" + server_id,
        data: "pageSize=10&curPage=1",
        success: function (data)	// 获取服务器状态数据.
        {
            var jsonobj = eval(data);

            if (table_length != jsonobj['data'].length)
                full_table_populate(jsonobj['data']);

            // 接下来只更新想更新的数据.
            for (var i = 0; i < jsonobj['data'].length; i++) {
                var this_row = jsonobj['data'][i];
                this_row.rowid = i;
                this_row = prepare_template_data(this_row);

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

            setTimeout(update_data, 1300);
        }
    });
}

function update_title()
{
    $.ajax({
        type : "POST",
        url : "api/get_server_config",
        data : JSON.stringify({'server_id': server_id |0}),
        success : function(data)	// 获取服务器状态数据.
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

            $("#table_title").html('SERVER_ID={1} 服务器详细情况({0})'.format(jsonobj.server_ip, server_id));

            setTimeout(update_title, 9900);

        }
    });

};

function submit_mod_channel(submitdata, success)
{
    ajaxpost('api/mod_channel', submitdata, function(data)
    {
        success(data['retcode'], data['error_msg']);
    });
}

function submit_channel_detail_change(server_id, channel_id, source_url, is_enable)
{
    console.log('submit_channel_detail_change sourceurl :');

    var submitdata = {'server_id':window.server_id|0, 'channel_id':0, 'source_url':'', 'cache_size':0, 'is_enable': true};

    submitdata['channel_id'] = jQuery('#edit_channel_dialog #channel_id').val() |0;
    if (jQuery('#edit_channel_dialog #radio_source_url').prop('checked')) {
        submitdata['source_url'] = jQuery('#edit_channel_dialog #source_url').val();
    }else{
        var fmt = {'protocol':'udp', 'server_id': jQuery('#edit_channel_dialog #source_server_id').val()};
        if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked'))
        {
            fmt.protocol = 'http';
        }

        submitdata['source_url'] = '{protocol}://{server_id}'.format(fmt);
    }
    submitdata['cache_size'] = 1024 * (jQuery('#edit_channel_dialog #cache_size').val() |0);
    submitdata['is_enable'] = jQuery('#edit_channel_dialog #is_enable').prop("checked");

    submit_mod_channel(submitdata, function(retcode, msg)
    {
        if (retcode == 0)
        {
            window.location = '';
        }
        else
        {
            alert('添加失败 : ' + msg);
        }
    });
}

function edit_channel_detail(server_id, channel_id, source_url, is_enable, url_type)
{
    jQuery("#edit_channel_dialog #source_url").val('');
    jQuery("#edit_channel_dialog #channel_id").val(channel_id);
    if (url_type == 0) {
        $('#radio_source_url').prop('checked', true);
        jQuery("#edit_channel_dialog #source_url").val(source_url);
    }else
    {
        $('#radio_source_server_id').prop('checked', true);
        radio2_changed($('#source_url'), $('.source_server_id_class'));

        var ii = source_url.indexOf('://');

        var protocol = source_url.substr(0, ii);

        var sid = source_url.substr(ii + 3);

        jQuery('#edit_channel_dialog #source_server_id').val(sid);

        if (protocol == 'udp')
        {
            jQuery('#edit_channel_dialog #source_server_protocol_udp').prop('checked', true)
        }else
        {
            jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked', true)
        }

        var fmt = {'protocol':'udp', 'server_id': jQuery('#edit_channel_dialog #source_server_id').val()};
        if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked'))
        {
            fmt.protocol = 'http';
        }
    }
    jQuery("#edit_channel_dialog #channel_id").prop('readonly', true);
    jQuery('#edit_channel_dialog #is_enable').prop("checked", is_enable);

    jQuery("#channel_model_dialog_submit_buttion").unbind('click');
    jQuery("#channel_model_dialog_submit_buttion").click(function ()
    {
        var surl = '';
        if (jQuery('#edit_channel_dialog #radio_source_url').prop('checked')) {
            surl = jQuery('#edit_channel_dialog #source_url').val();
        }else{
            var fmt = {'protocol':'udp', 'server_id': jQuery('#edit_channel_dialog #source_server_id').val()};
            if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked'))
            {
                fmt.protocol = 'http';
            }

            surl = '{protocol}://{server_id}'.format(fmt);
        }
        submit_channel_detail_change(server_id,channel_id, surl, jQuery('#edit_channel_dialog #is_enable').prop("checked"));
    });
}

function submit_add_channel(submitdata, success)
{
    ajaxpost('api/add_channel', submitdata, function(data)
    {
        success(data['retcode'], data['error_msg']);
    });
}

function add_channel()
{
    console.log('add_channel sourceurl :');

    var submitdata = {'server_id':window.server_id|0, 'channel_id':0, 'source_url':'', 'cache_size':0, 'is_enable': true};

    submitdata['channel_id'] = jQuery('#edit_channel_dialog #channel_id').val() |0;

    if (jQuery('#edit_channel_dialog #radio_source_url').prop('checked')) {
        submitdata['source_url'] = jQuery('#edit_channel_dialog #source_url').val();
    }else{
        var fmt = {'protocol':'udp', 'server_id': jQuery('#edit_channel_dialog #source_server_id').val()};
        if (jQuery('#edit_channel_dialog #source_server_protocol_tcp').prop('checked'))
        {
            fmt.protocol = 'http';
        }

        submitdata['source_url'] = '{protocol}://{server_id}'.format(fmt);
    }
    submitdata['cache_size'] = 1024* ( jQuery('#edit_channel_dialog #cache_size').val() |0 );
    submitdata['is_enable'] = jQuery('#edit_channel_dialog #is_enable').prop("checked");

    submit_add_channel(submitdata, function(retcode,msg) {
        if (retcode == 0) {
            window.location = '';
        }
        else {
            alert('添加失败 : ' + msg);
        }
    });
}

function  show_add_channel()
{
    jQuery("#edit_channel_dialog #channel_id").val('');
    jQuery("#edit_channel_dialog #source_url").val('');
    jQuery("#edit_channel_dialog #channel_id").prop('readonly', false);
    jQuery("#channel_model_dialog_submit_buttion").unbind('click');
    jQuery("#channel_model_dialog_submit_buttion").click(add_channel);
}

function submit_del_channel(sid, cid, success)
{
    var submitdata = { 'server_id': sid|0, 'channel_id': cid|0 };

    ajaxpost('api/del_channel', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function del_channel(sid, cid)
{
    submit_del_channel(sid, cid, function (retcode)
    {
        // reload page
        if (retcode)
        {
            alert('失败');
        }
        window.location = '';
    });
}


window.real_ready = function()
{
    update_title();
    update_data();
}

function radio2_changed(t1, t2)
{
    t1.prop('disabled', 'disabled');
    t2.prop('disabled', '');
}
