/**
 * Created by cai on 15-5-13.
*/

var template = '<thead>\
    <tr>\
    <td>软件名称: </td><td> VOE 商用直播平台 (内测版)</td>\
</tr>\
<tr>\
<td>授权方式: </td><td>序列号</td>\
</tr>\
<tr>\
<td>授权到期时间: </td><td>{expir_date}</td>\
</tr>\
<tr>\
<td>网络节点授权 token: </td><td id="product_id">{product_id}</td>\
</tr>\
<tr>\
<td>是否授权p2p功能: </td><td>{has_p2p}</td>\
</tr>\
</thead>';

submit_get_license_info(function (data)
{
    $("#licenseinfo").html(template.format(data));
});