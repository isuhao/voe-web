/**
 * Created by Jack on 2015/5/8.
 */

function add_channel() {
    console.log(
        'add one server'
    );
    var submitdata = {'channel_id': 0, 'channel_name': "", 'source_url': '', 'is_enable': false, 'cache_size': 0};

    submitdata['channel_id'] = $("#edit_channel_modal_dialog #edit_channel_dialog #channel_id").val() | 0;
    submitdata['channel_name'] = $("#edit_channel_modal_dialog #edit_channel_dialog #channel_name").val();
    submitdata['source_url'] = $('#edit_channel_modal_dialog #edit_channel_dialog #source_url').val();
    submitdata['is_enable'] = $('#edit_channel_modal_dialog #edit_channel_dialog #is_enable').prop('checked');

    if ($('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val() != null && $('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val() != '')
    {
        submitdata['server_id'] = $('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val() | 0;
        submitdata['cache_size'] = 1024 * ($('#edit_channel_modal_dialog #edit_channel_dialog #cache_size').val() | 0);
    }

    submit_add_channel(submitdata, function (retcode)
    {
        if (retcode == 0)
        {
            window.location = '';
        }
        else
        {
            alert('失败');
        }
    });
}

function show_add_channel() {
    $("#edit_channel_modal_dialog #channel_model_dialog_submit_buttion").unbind('click');
    $("#edit_channel_modal_dialog #channel_model_dialog_submit_buttion").click(add_channel);
}

function delete_channel(rowid, channel_id, num_channels) {

    var r = confirm("删除后不可恢复!");

    if (r) {
        if (num_channels < 2) {
            submit_delete_channel(channel_id, function (retcode) {
                // reload page
                if (retcode) {
                    alert('失败');
                }
                window.location = '';
            });
        } else {
            alert('删除前线先');
        }
    }
}

function mod_channel(rowid, channel_id) {
    console.log(
        'mod channel'
    );

    var submitdata = {'channel_id': 0, 'channel_name': "", 'source_url': '', 'is_enable': false, 'cache_size': 0};

    submitdata['channel_id'] = $("#edit_channel_modal_dialog #edit_channel_dialog #channel_id").val() | 0;
    submitdata['channel_name'] = $("#edit_channel_modal_dialog #edit_channel_dialog #channel_name").val();
    submitdata['source_url'] = $('#edit_channel_modal_dialog #edit_channel_dialog #source_url').val();
    submitdata['is_enable'] = $('#edit_channel_modal_dialog #edit_channel_dialog #is_enable').prop('checked');

    if ($('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val() != null && $('#edit_channel_dialog #source_server_id').val() != '') {
        submitdata['server_id'] = $('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val() | 0;

        submitdata['cache_size'] = 1024 * ($('#edit_channel_modal_dialog #edit_channel_dialog #cache_size').val() | 0);
    }

    submit_mod_channel(submitdata, function (retcode) {
        if (retcode == 0) {
            window.location = '';
        }
        else {
            alert('修改失败');
        }
    });
}

function show_edit_channel(rowid, channel_id) {
    $("#edit_channel_modal_dialog #edit_channel_dialog #channel_id").val(channel_id);
    $("#edit_channel_modal_dialog #edit_channel_dialog #channel_name").val(window.current_data[rowid].channel_name);
    jQuery('#edit_channel_modal_dialog #edit_channel_dialog #cache_size').val(window.current_data[rowid].cache_size);

    $('#edit_channel_modal_dialog #edit_channel_dialog #source_url').val(window.current_data[rowid].channel_source_url);
    $('#edit_channel_modal_dialog #edit_channel_dialog #is_enable').prop('checked', window.current_data[rowid].is_enable);

    if (window.current_data[rowid].channel_source_server_id > 0) {
        $('#edit_channel_modal_dialog #edit_channel_dialog #source_server_id').val(window.current_data[rowid].channel_source_server_id);

        $('#edit_channel_modal_dialog #edit_channel_dialog #cache_size').val(window.current_data[rowid].cache_size / 1024);
    }

    $("#edit_channel_modal_dialog #channel_model_dialog_submit_buttion").unbind('click');
    $("#edit_channel_modal_dialog #channel_model_dialog_submit_buttion").click(function () {
        mod_channel(rowid, channel_id);
    });
}


var tr_template = '<tr class="success">\
                <td></td>\
                <td>{channel_id}</td>\
                <td>{channel_name}</td>\
                <td>{channel_source_url}</td>\
                <td><a href="detail.html?server_id={channel_source_server_id}" style="width: 100%">{channel_source_server_id}</a></td>\
                <td>{channel_servers}</td>\
        <td>\
          <!-- Split button -->\
        <div class="btn-group">\
            <a type="button" class="btn btn-info" href="channel_flow.html?channel_id={channel_id}" target="_blank">详情</a>\
            <button type="button" id="edit_channel_buttion_{rowid}" class="btn btn-info" data-toggle="modal" data-target="#edit_channel_modal_dialog" \
                onclick="show_edit_channel({rowid}, {channel_id})">编辑</button>\
            <button type="button" class="btn btn-info" onclick="delete_channel({rowid}, {channel_id}, {channel_servers})">删除</button>\
        </div>\
        </td>\
        </tr>';


window.real_ready = function ()	// 在窗口加载的时候，调用登陆，并且请求服务器状态数据。
{
    $('#prepage').hide();
    $('#nextpage').hide();

    if (window.curpage > 1) {
        $('#prepage').prop('href', 'channels.html?curpage={0}'.format((window.curpage | 0) - 1));
        $('#prepage').show();
    }

    var page_size = 20;

    $.ajax({
        type: "POST",
        url: "api/get_channels",
        data: "pageSize=20&curPage=" + window.curpage,
        success: function (data)	// 获取服务器状态数据.
        {
            var jsonobj = eval(data);

            console.log("success status: " + jsonobj["success"]);
            console.log("length: " + jsonobj["data"].length);

            if (window.curpage < jsonobj["pageCount"]) {
                $('#nextpage').show();
                $('#nextpage').prop('href', 'channels.html?curpage={0}'.format((window.curpage | 0) + 1));
            }

            $('#curPage_indicator').html('当前第{curPage}页, 共{pageCount}页'.format(jsonobj));

            window.current_data = jsonobj["data"];

            for (var i = 0; i < jsonobj["data"].length; i++) {
                var rowdata = jsonobj["data"][i];
                rowdata.rowid = i;

                if (rowdata.channel_name == null) {
                    rowdata.channel_name = "未设定";
                }

                var newtr = tr_template.format(rowdata);

                $("#the_table_body").append(newtr);


            }
        }
    });
};

function format_ip(ips) {
    var r = '';
    for (var i = 0; i < ips.length; i++) {
        if (r == '') {

        }
        else {
            r += ', ';
        }
        r += ips[i];
    }

    return r;
}

function goto_server_detail(server_id) {
    window.location = 'detail.html?server_id=' + server_id;
}