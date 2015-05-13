/**
 * Created by cai on 15-5-13.
 */
function submit_add_server(submitdata, success)
{
    ajaxpost('api/add_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function add_server()
{
    console.log(
        'add one server'
    );
    var submitdata = {'server_id':0, 'server_name':"", 'server_tcp_port':0, 'server_ucp_port':0 };

    submitdata['server_id'] = $("#add_server_dialog #server_id").val() |0;
    submitdata['server_tcp_port'] = $('#add_server_dialog #server_tcp_port').val() |0;
    submitdata['server_ucp_port'] = $('#add_server_dialog #server_ucp_port').val() |0;
    submitdata['server_name'] = $('#add_server_dialog #server_name').val();

    submit_add_server(submitdata, function(retcode)
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

function show_add_server()
{
    $("#add_server_dialog #server_id").prop('readonly', false);
    $("#submit_dialog_data").unbind('click');
    $("#submit_dialog_data").click(add_server);
}

function submit_del_del_server(sid, success)
{
    var submitdata = { 'server_id': sid|0 };

    ajaxpost('api/del_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function del_server(sid, num_channels)
{
    if (num_channels == 0) {
        submit_del_del_server(sid, function (retcode) {
            // reload page
            if (retcode) {
                alert('失败');
            }
            window.location = '';
        });
    }else
    {
        alert('先删除频道!');
    }
}

function submit_mod_server(submitdata, success)
{
    ajaxpost('api/mod_server', submitdata, function(data)
    {
        success(data['retcode']);
    });
}

function mod_server(sid)
{
    console.log(
        'mod server'
    );
    var submitdata = {'server_id':sid, 'server_name':"", 'server_tcp_port':0, 'server_ucp_port':0 };

    submitdata['server_name'] = $('#add_server_dialog #server_name').val();
    submitdata['server_tcp_port'] = $('#add_server_dialog #server_tcp_port').val() |0;
    submitdata['server_ucp_port'] = $('#add_server_dialog #server_ucp_port').val() |0;

    submit_mod_server(submitdata, function(retcode)
    {
        if (retcode == 0)
        {
            window.location = '';
        }
        else
        {
            alert('修改失败');
        }
    });
}

function show_mod_server(server_id, rowid, server_tcp_port, server_ucp_port)
{
    var server_name = '';

    server_name = $("#rowid_{0} #server_name".format(rowid)).text();

    $("#add_server_dialog #server_id").val(server_id);
    $("#add_server_dialog #server_id").prop('readonly', true);


    $('#add_server_dialog #server_tcp_port').val(server_tcp_port);
    $('#add_server_dialog #server_ucp_port').val(server_ucp_port);
    $('#add_server_dialog #server_name').val(server_name);

    $("#submit_dialog_data").unbind('click');
    $("#submit_dialog_data").click(function () {
        mod_server(server_id);
    });
}

var tr_template = '<tr class="success" id="rowid_{rowid}">\
                <td></td>\
                <td>{server_id}</td>\
                <td id="server_name">{server_name}</td>\
                <td>{server_ip}</td>\
                <td>{tport}</td>\
        <td>{uport}</td><td>{num_channels}</td>\
        <td>{status_str}</td>\
        <td>\
          <!-- Split button -->\
        <div class="btn-group">\
                <button type="button" class="btn btn-info" onclick="goto_server_detail({server_id})">详情</button>\
                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">\
                <span class="caret"></span>\
                <span class="sr-only">Toggle Dropdown</span>\
        </button>\
        <ul class="dropdown-menu" role="menu">\
            <li><a href="#" data-toggle="modal" data-target="#add_server" onclick="show_mod_server({server_id}, {rowid}, {tport}, {uport})">修改</a></li>\
                <li><a href="#" onclick="del_server({server_id}, {num_channels})">删除服务器</a></li>\
        </ul>\
        </div>\
        </td>\
        </tr>';

$('#prepage').hide();
$('#nextpage').hide();

$('#curPage_indicator').html('当前第{0}页'.format(window.curpage));

window.real_ready = function()	// 在窗口加载的时候，调用登陆，并且请求服务器状态数据。
{
    var page_size = 20;
    if (window.curpage > 1) {
        $('#prepage').prop('href', 'index.html?curpage={0}'.format((window.curpage | 0) - 1));
        $('#prepage').show();
    }

    $.ajax({
        type : "POST",
        url : "api/grid_server_status",
        data : 'pageSize={1}&curPage={0}'.format(window.curpage, page_size),
        success : function(data)	// 获取服务器状态数据.
        {
            var jsonobj = eval(data);

            console.log("success status: " + jsonobj["success"]);
            console.log("length: " + jsonobj["data"].length);

            if (window.curpage < jsonobj["pageCount"]) {
                $('#nextpage').show();
                $('#nextpage').prop('href', 'index.html?curpage={0}'.format((window.curpage | 0) + 1));
            }

            $('#curPage_indicator').html('当前第{curPage}页, 共{pageCount}页'.format(jsonobj));

            for (var i = 0; i < jsonobj["data"].length; i++)
            {
                jsonobj["data"][i].rowid = i;
                if (jsonobj["data"][i]["ip"])
                    jsonobj["data"][i].server_ip = format_ip(jsonobj["data"][i]["ip"]);
                else
                    jsonobj["data"][i].server_ip = '未在线';
                // 循环插入表格.
                var status = (jsonobj["data"][i]["status"]);
                if( status < 0 )
                {
                    jsonobj["data"][i]["status_str"] = "离线";
                }
                else if (status < 100)
                {
                    jsonobj["data"][i]["status_str"] = "在线-健康度 : " + status ;
                }
                else
                {
                    jsonobj["data"][i]["status_str"] = "在线-完美";
                }

                var newtr = tr_template.format(jsonobj["data"][i]);

                $("#the_table_body").append(newtr);
            }
        }
    });
};

function goto_server_detail(server_id)
{
    window.location = 'detail.html?server_id=' + server_id;
}
