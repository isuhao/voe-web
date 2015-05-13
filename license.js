/**
 * Created by cai on 15-5-13.
 */
jQuery.ajax({
    type : "GET",
    url : "api/product_id",
    data: "",
    success : function(data)
    {
        var product_id = data;

        $("#product_id").text(product_id);
    }
});

