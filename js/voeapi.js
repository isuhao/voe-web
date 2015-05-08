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
