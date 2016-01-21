function meSelectOrRemoveMedia(action, name)
{

    MediaExplorer.field_id ='id__' + name;
    MediaExplorer.media_info_id='id__media_info_' + name;
    MediaExplorer.current_image_id='id__current_image_' + name;
    MediaExplorer.type_input_id='id__type_' + name;
    MediaExplorer.media_input_id='id__id_' + name;
    MediaExplorer.image_info_id = 'id__image_info_' + name;
    MediaExplorer.caption_input_id = "id__caption_" + name;
    MediaExplorer.temp_caption_input_id = "id__temp_caption_" + name;
    MediaExplorer.credit_input_id = "id__credit_" + name;
    MediaExplorer.temp_credit_input_id = "id__temp_credit_" + name;
    MediaExplorer.callback = 'meProcessMedia';

    MediaExplorer.caption_input_ids = [MediaExplorer.caption_input_id,MediaExplorer.temp_caption_input_id];
    MediaExplorer.credit_input_ids = [MediaExplorer.credit_input_id,MediaExplorer.temp_credit_input_id];

    if ( action == "select" )
    {
        MediaExplorer.openWindow();
    }
    else if ( action == "remove" )
    {
        MediaExplorer.remove();
    }
}

function meProcessMedia(name)
{

    var media_info_id = MediaExplorer.media_info_id;
    var media_input_id = MediaExplorer.media_input_id;
    var type_input_id = MediaExplorer.type_input_id;
    var image_info_id = MediaExplorer.image_info_id;
    var current_image_id = MediaExplorer.current_image_id;

    if ( typeof(name) !== "undefined" )
    {
        media_info_id='id__media_info_' + name;
        current_image_id='id__current_image_' + name;
        type_input_id='id__type_' + name;
        media_input_id='id__id_' + name;
        image_info_id = 'id__image_info_' + name;
    }
    

    $("#"+media_info_id).html("");
    $("#"+media_info_id).hide();
    $("#"+image_info_id).hide();

    var id = $("#"+media_input_id).val();
    var type = $("#"+type_input_id).val();

    if ( id && type )
    {
        var url = "/api/media/elements/" + id;

        if ( type == "gallery" )
        {
            url = "/api/media/galleries/" + id;
        }
        else if ( type == "image" )
        {
            $("#"+image_info_id).show();
        }

        $.ajax({
            url: url
        }).done(function(data) {

            var html = "";
            html = "<div>";
            html += "<b>Media name:</b> ";
            if ( type == "image" )
            {
                html += "<a target='_blank' href='" + data.image_url + "'>"
                html += data.name;
                html += "</a>";
            }
            else if ( type == "video" )
            {
                html += "<a target='_blank' href='" + data.video_url + "'>"
                html += data.name;
                html += "</a>";
            }
            else if ( type == "gallery" )
            {
                html += data.name;
            }
            html += "</div>";
            html += "<div>";
            html += "<b>Media type:</b> " + type;
            html += "</div>";

            $("#"+media_info_id).html(html);
            $("#"+media_info_id).show();

            var html2 = "<img style='max-width:150px' src='";
            html2 += data.thumbnail_image_url;
            html2 += "' >";
            $("#"+current_image_id).html(html2);

        });
    }

    meBuildField(name);
}

function meBuildField(name)
{

    var field_id = MediaExplorer.field_id;
    var media_input_id = MediaExplorer.media_input_id;
    var type_input_id = MediaExplorer.type_input_id;
    var caption_input_id = MediaExplorer.caption_input_id;
    var credit_input_id = MediaExplorer.credit_input_id;

    if ( typeof(name) !== "undefined" )
    {
        field_id = 'id__' + name;
        type_input_id='id__type_' + name;
        media_input_id='id__id_' + name;
        caption_input_id = "id__caption_" + name;
        credit_input_id = "id__credit_" + name;
    }

    $("#"+field_id).val("");

    var media_id = $("#"+media_input_id).val();
    var media_type = $("#"+type_input_id).val();
    var media_caption = $("#"+caption_input_id).val();
    var media_credit = $("#"+credit_input_id).val();
    var data = {};

    if ( media_id )
    {
        data["id"] = media_id;
        data["type"] = media_type;
        data["caption"] = media_caption;
        data["credit"] = media_credit;
        $("#"+field_id).val(JSON.stringify(data));
    }

}
