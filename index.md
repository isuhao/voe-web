---
layout: index
title: 服务器管理
---

<h4 class="margin-bottom-15">服务器</h4>

<span style="display: inline" id="curPage_indicator"></span>

<table class="table table-striped table-hover table-bordered">
    <thead>
        <tr>
            <th>#</th>
            <th>服务器ID</th>
            <th>服务器名称</th>
            <th>服务器IP</th>
            <th>TCP端口</th>
            <th>UDP端口</th>
            <th>频道数</th>
            <th>状态</th>
            <th>操作</th>
        </tr>
    </thead>
        <tbody id="the_table_body">
    </tbody>
</table>
<button type="button" class="btn btn-info" data-toggle="modal" data-target="#add_server" onclick="show_add_server()">添加服务器</button>
<a type="button" class="btn btn-info" id="prepage" >上一页</a>
<a type="button" class="btn btn-info" id="nextpage" >下一页</a>

