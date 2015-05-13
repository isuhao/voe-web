/**
 * Created by cai on 15-5-13.
 */
submit_get_need_setup(function(){});

submit_get_product_id(function(data)
{
    var product_id = data;

    $("#product_id").val(product_id);
});

function submit_cdkey()
{
    var cdkey = $("#cdkey").val();
    var password = $("#password").val();

    submit_do_cdkey(cdkey, password, function(license_ok)
    {
        if(license_ok)
        {
            window.location = 'index.html';
        }else
            $("#error-code").text('序列号不正确证书错误请重新输入的屌丝license error');
    });
    return false;
}
