/**
 * Created by Jack on 2015/5/8.
 */

function add_channel() {
    console.log(
        'add one server'
    );
    var submitdata = {'channel_id': 0, 'channel_name': "", 'source_url': '', 'is_enable': false, 'cache_size': 0};

    submitdata['channel_id'] = $("#edit_channel_dialog #channel_id").val() | 0;
    submitdata['channel_name'] = $("#edit_channel_dialog #channel_name").val();
    submitdata['source_url'] = $('#edit_channel_dialog #source_url').val();
    submitdata['is_enable'] = $('#edit_channel_dialog #is_enable').prop('checked');

    if ($('#edit_channel_dialog #source_server_id').val() != null && $('#edit_channel_dialog #source_server_id').val() != '') {
        submitdata['server_id'] = $('#edit_channel_dialog #source_server_id').val() | 0;

        submitdata['cache_size'] = 1024 * ($('#edit_channel_dialog #cache_size').val() | 0);
    }

    submit_add_channel(submitdata, function (retcode) {
        if (retcode == 0) {
            window.location = '';
        }
        else {
            alert('失败');
        }
    });
}

function show_add_channel() {
    $("#channel_model_dialog_submit_buttion").unbind('click');
    $("#channel_model_dialog_submit_buttion").click(add_channel);
}

function submit_del_del_server(sid, success) {
    var submitdata = {'server_id': sid | 0};

    ajaxpost('api/del_server', submitdata, function (data) {
        success(data['retcode']);
    });
}

function del_server(sid, num_channels) {
    if (num_channels == 0) {
        submit_del_del_server(sid, function (retcode) {
            // reload page
            if (retcode) {
                alert('失败');
            }
            window.location = '';
        });
    } else {
        alert('先删除频道!');
    }
}

function mod_channel(rowid, channel_id) {
    console.log(
        'mod channel'
    );

    var submitdata = {'channel_id': 0, 'channel_name': "", 'source_url': '', 'is_enable': false, 'cache_size': 0};

    submitdata['channel_id'] = $("#edit_channel_dialog #channel_id").val() | 0;
    submitdata['channel_name'] = $("#edit_channel_dialog #channel_name").val();
    submitdata['source_url'] = $('#edit_channel_dialog #source_url').val();
    submitdata['is_enable'] = $('#edit_channel_dialog #is_enable').prop('checked');

    if ($('#edit_channel_dialog #source_server_id').val() != null && $('#edit_channel_dialog #source_server_id').val() != '') {
        submitdata['server_id'] = $('#edit_channel_dialog #source_server_id').val() | 0;

        submitdata['cache_size'] = 1024 * ($('#edit_channel_dialog #cache_size').val() | 0);
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
    $("#edit_channel_dialog #channel_id").val(channel_id);
    $("#edit_channel_dialog #channel_name").val(window.current_data[rowid].channel_name);

    $('#edit_channel_dialog #source_url').val(window.current_data[rowid].channel_source_url);
    $('#edit_channel_dialog #is_enable').prop('checked', window.current_data[rowid].is_enable);

    if (window.current_data[rowid].channel_source_server_id > 0) {
        $('#edit_channel_dialog #source_server_id').val(window.current_data[rowid].channel_source_server_id);

        $('#edit_channel_dialog #cache_size').val(window.current_data[rowid].cache_size / 1024);
    }

    $("#channel_model_dialog_submit_buttion").unbind('click');
    $("#channel_model_dialog_submit_buttion").click(function () {
        mod_channel(rowid, channel_id);
    });
}