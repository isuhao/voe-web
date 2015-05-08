/**
 * Created by Jack on 2015/5/8.
 */
function submit_add_channel(submitdata, success) {
    ajaxpost('api/add_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}


function submit_mod_channel(submitdata, success) {
    ajaxpost('api/mod_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}


function submit_delete_channel(cid, success) {
    var submitdata = {'channel_id': cid | 0};

    ajaxpost('api/del_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}

function submit_attach_channel(submitdata, success) {
    ajaxpost('api/attach_channel', submitdata, function (data) {
        success(data['retcode'], data['error_msg']);
    });
}

function submit_mod_attched_channel(submitdata, success) {
    ajaxpost('api/mod_attached_channel', submitdata, function (data) {
        success(data['retcode'], data['error_msg']);
    });
}

function submit_dettach_channel(sid, cid, success) {
    var submitdata = {'server_id': sid | 0, 'channel_id': cid | 0};

    ajaxpost('api/dettach_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}