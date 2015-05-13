/**
 * Created by Jack on 2015/5/8.
 */

function submit_check_login(on_check_login_return)
{
    ajaxpost("api/check_login",{"check_login":true}, on_check_login_return);
}

function submit_login(username, password, callback)
{
    ajaxpost("api/do_login", {"username":username, "password": password}, on_login_return);
}

function submit_add_channel(submitdata, success)
{
    ajaxpost('api/add_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}

function submit_mod_channel(submitdata, success)
{
    ajaxpost('api/mod_channel', submitdata, function (data) {
        success(data['retcode']);
    });
}

function submit_delete_channel(cid, success)
{
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

//

function submit_grid_server_status(page_size, curpage, callback) {
    $.ajax({
        type: "POST",
        url: "api/grid_server_status",
        data: 'pageSize={0}&curPage={1}'.format(page_size, curpage),
        success: function (data)	// 获取服务器状态数据.
        {
            var jsonobj = eval(data);
            callback(jsonobj);
        }
    });
}

function submit_get_server_list(callback) {
    var server_list = [];
    submit_grid_server_status(10000, 1, function (jsonobj)
    {
        for (var i = 0; i < jsonobj["data"].length; i++) {
            server_list[i] = jsonobj["data"][i].server_id;
        }

        callback(server_list);
    });
}

function submit_get_channel_list(pagesize, curpage, callback)
{
    $.ajax({
        type: "POST",
        url: "api/get_channels",
        data: "pageSize={0}&curPage={1}".format(pagesize, curpage),
        success: callback // 获取服务器状态数据.
    });
}

function submit_get_channel_flow(cid, display_channel_flow)
{
    ajaxpost("api/get_channel_flow", {"channel_id": cid | 0}, display_channel_flow);
}

// 获取服务器状态数据.
function submit_get_server_config(server_id, callback)
{
    $.ajax({
        type : "POST",
        url : "api/get_server_config",
        data : JSON.stringify({'server_id': server_id |0}),
        success : callback
    });
}

function submit_grid_server_detail(page_size, curpage, server_id, callback)
{
    $.ajax({type: "POST",
        url: "api/grid_server_detail?server_id={0}".format(server_id),
        data: "pageSize={0}&curPage={1}".format(page_size, curpage),
        success: callback	// 获取服务器状态数据.
    });
}

function submit_add_server(submitdata, success)
{
    ajaxpost('api/add_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function submit_mod_server(submitdata, success)
{
    ajaxpost('api/mod_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function submit_delete_server(sid, success)
{
    var submitdata = { 'server_id': sid|0 };

    ajaxpost('api/del_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function submit_get_product_id(callback)
{
    jQuery.ajax({
        type : "GET",
        url : "api/product_id",
        data: "",
        success : callback
    });
}

function submit_get_need_setup(callback)
{
    jQuery.ajax({
        type : "GET",
        url : "api/need_setup",
        data: "",
        success : function(data)
        {
            var server_return = data;

            if (server_return == 0)
            {
                window.location = "index.html";
            }else
            {
                callback();
            }
        }
    });
}

function submit_do_cdkey(cdkey, password, submited_callback)
{
    ajaxpost("api/do_cdkey", {"cdkey":cdkey, "password": password}, function(data)
    {
        var res = eval(data);
        // 处理是否接受 CD-key
        // 不接受就刷新.
        submited_callback(res.license_ok)
    });
    return false;
}