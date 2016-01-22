function meInsertIntoEditor(html)
{
    //BUG NOTE
    //Currently supporting only 1 RichText field per page
    //If you have multiple RichText fields they will all be updated
    for(var i in CKEDITOR.instances) {
        var instance = CKEDITOR.instances[i];
	    instance.insertHtml(html);
    }
}

function meCKEditorCallback()
{
	var id = $("#meWYSIWYGDataMedia").val();
	var type = $("#meWYSIWYGDataType").val();
	var richtext_field_id = $("#meWYSIWYGDataRichTextFieldId").val();

	var html = "[media-explorer-" + type + "-" + id + "]";

    if ( type == "image" )
    {
        return meCKEditorGetResizedImages(id);
	}

	//CKEDITOR.instances[richtext_field_id].insertHtml(html);
	meInsertIntoEditor(html);
}

function meCKEditorGetResizedImages(image_id)
{
    var url = "/api/media/resizedimages/?element_id=" + image_id;
    $.ajax({
        url: url
    }).done(function(data) {
        return meCKEditorGetResizedImagesCallback(image_id, data);
    });

}

function meCKEditorGetResizedImagesCallback(image_id, data)
{
	var caption = $("#meWYSIWYGDataCaption").val();
	var credit = $("#meWYSIWYGDataCredit").val();
	var url = $("#meWYSIWYGDataMediaUrl").val();

    var imageSelectHtml = '<input type="hidden" name="image_url" '
    imageSelectHtml += 'value="' + url + '" ';
    imageSelectHtml += '>'

    if (data.length == 1)
    {
        imageSelectHtml = '<input type="hidden" name="image_url" '
        imageSelectHtml += 'value="' + data[0]["image_url"] + '" ';
        imageSelectHtml += '>'
    }
    else if (data.length>1)
    {
        imageSelectHtml = '<label>Size:</label><br>';
        imageSelectHtml += '<select name="image_url">';
        imageSelectHtml += '<option value="">Select an image size';

        for (var x=0;x < data.length;x++)
        {
            var obj = data[x];

            imageSelectHtml += '<option value="';
            imageSelectHtml += obj["image_url"];
            imageSelectHtml += '">';
            imageSelectHtml += obj["size"] ;
            imageSelectHtml += ' (';
            imageSelectHtml += obj["image_width"] ;
            imageSelectHtml += 'x' + obj["image_height"] ;
            imageSelectHtml += ' px)';
        }
        imageSelectHtml += '</select><br>';

    }

    imageSelectHtml += '<input type="hidden" name="image_id" '
    imageSelectHtml += 'value="' + image_id + '" ';
    imageSelectHtml += '>'

    var preInsertPrompt = {
        state0: {
            title: "Edit the image style, size, caption and credit",
            html: '<label>Style:</label>'+
                    '<br>'+
                    '<select name="style">'+
                    '<option value="">'+
                    '<option value="img-inline-full-width">Full width'+
                    '<option value="img-inline-float-left">Float left'+
                    '<option value="img-inline-float-right">Float right'+
                    '</select>'+
                    '<br>'+
                    imageSelectHtml +
                    '<label>Caption:</label>'+
                    '<br>'+
                    '<textarea style="width:95%" name="caption">'+caption+'</textarea>'+
                    '<br>'+
                    '<label>Credit:</label>'+
                    '<br>'+
                    '<textarea style="width:95%" name="credit">'+credit+'</textarea>'+
                    '<br>',
            buttons: { "Insert image": true, "Cancel": false},
            submit: function(e,v,m,f){
                e.preventDefault();
                if ( !v ){ $.prompt.close(); return; }
                if (data.length>0)
                {
                    if ( !f.image_url ){ $.prompt.goToState('state1'); return; }
                }
                else
                {
                    f.image_url = url;
                }
                meShowCKEditorImage(f.image_url,f.style,f.caption,f.credit);
            }
        },
        state1: {
            title: "Select an image size",
            html: "You are required to select an image size. Try again.",
            buttons: { "Try again": true, "Cancel": false},
            focus: 0,
            submit: function(e,v,m,f){
                e.preventDefault();
                if ( !v ){ $.prompt.close(); return; }
                $.prompt.goToState('state0');
            }
        }
    };

    $.prompt(preInsertPrompt);

}


function meShowCKEditorImage(url,style,caption,credit)
{
	var richtext_field_id = $("#meWYSIWYGDataRichTextFieldId").val();

    var img = "<img src='";
    img += url
    img += "' ";
    img += ">";

    var html = "<figure ";
    if ( style )
    {
        html += " class='" + style + "' ";
    }
    else
    {
        html += " class='img-inline-float-left' ";
    }
    html += ">";
    html += img;
    if ( caption || credit  )
    {
        html += "<figcaption>";
        html += caption;
        if ( caption ){ html += " " + credit; }
        else { html += credit; }
    }

    html += "</figure>";

	//CKEDITOR.instances[richtext_field_id].insertHtml(html);
	meInsertIntoEditor(html);
    $.prompt.close();
}

$(function() {

	if ( !$("#meWYSIWYGDataType").length ) {
        var hidden_fields = "<input type='hidden' id='meWYSIWYGDataType' >";
        hidden_fields += "<input type='hidden' id='meWYSIWYGDataMedia' >";
        hidden_fields += "<input type='hidden' id='meWYSIWYGDataMediaUrl' >";
        hidden_fields += "<input type='hidden' id='meWYSIWYGDataCaption' >";
        hidden_fields += "<input type='hidden' id='meWYSIWYGDataCredit' >";
        hidden_fields += "<input type='hidden' id='meWYSIWYGDataText' >";

        $("body").append("<div id='hidden-data'>" + hidden_fields + "</div>");
	}

});
