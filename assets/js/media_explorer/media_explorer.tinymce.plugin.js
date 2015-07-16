function meTinyMCECallback()
{
	var id = $("#meWYSIWYGDataMedia").val();
	var url = $("#meWYSIWYGDataMediaUrl").val();
	var type = $("#meWYSIWYGDataType").val();
	var caption = $("#meWYSIWYGDataCaption").val();
	var credit = $("#meWYSIWYGDataCredit").val();

	var html = "[media-explorer-" + type + "-" + id + "]";

    var style = "";
    if ( type == "image" )
    {
        var preInsertPrompt = {
            state0: {
	            title: "Edit the image style, size, caption and credit",
                html: '<label>Style:</label><br>'+
                        '<select name="style">'+
                        '<option value="">'+
                        '<option value="cmpnt-full-article-main-img">Full width'+
                        '<option value="img-inline-float-left">Float left'+
                        '<option value="img-inline-float-right">Float right'+
                        '</select>'+
                        '<br>'+
                        '<label>Size:</label><br>'+
                        '<select name="size">'+
                        '<option value="">'+
                        '<option value="h_1220">Horizontal/square image with 1220px width'+
                        '<option value="h_800">Horizontal/square image with 800px width'+
                        '<option value="h_610">Horizontal/square image with 610px width'+
                        '<option value="h_420">Horizontal/square image with 420px width'+
                        '<option value="h_160">Horizontal/square image with 160px width'+
                        '<option value="v_278">Vertical image with 278px width'+
                        '<option value="v_160">Vertical image with 160px width'+
                        '</select>'+
                        '<br>'+
                        '<label>Caption:</label><br>'+
                        '<textarea style="width:95%" name="caption">'+caption+'</textarea>'+
                        '<br>'+
                        '<label>Credit:</label><br>'+
                        '<textarea style="width:95%" name="credit">'+credit+'</textarea>'+
                        '<br>',
	            buttons: { "Insert image": true, "Cancel": false},
	            submit: function(e,v,m,f){
                    e.preventDefault();
		            if ( !v ){ $.prompt.close(); return; }
                    meTinyMCEImageCallback(f.style,f.size,f.caption,f.credit);
	            }
            },
            state1: {
                title: "Image not found",
                html: "Resized image was not found. Try again.",
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

        return;
	}

	tinyMCE.activeEditor.execCommand('mceInsertContent', false, html);
}

if ( typeof(tinyMCE) != "undefined" )
{
	tinyMCE.PluginManager.add('oafiles', function(editor, url) {
    // Add a button that opens a window
    editor.addButton('oafiles', {
        text: 'Files',
        icon: false,
        onclick: function() {
            // Open window
        		MediaExplorer.type_input_id = "meWYSIWYGDataType";
        		MediaExplorer.div_id = "";
        		MediaExplorer.file_url_id = "meWYSIWYGDataMediaUrl";
        		MediaExplorer.file_input_id = "meWYSIWYGDataMedia";
        		MediaExplorer.caption_input_ids = ["meWYSIWYGDataCaption"];
        		MediaExplorer.credit_input_ids = ["meWYSIWYGDataCredit"];
        		MediaExplorer.callback = "meTinyMCECallback";

            editor.windowManager.open({
                title: 'Media Explorer plugin',
                url: '/media_explorer/',
                width: 1200,
                height: 1000,
            });
        }
    });
	});
}

function meTinyMCEImageCallback(style,size,caption,credit)
{
	var id = $("#meWYSIWYGDataMedia").val();
	var url = $("#meWYSIWYGDataMediaUrl").val();
	var type = $("#meWYSIWYGDataType").val();
	//var caption = $("#meWYSIWYGDataCaption").val();
	//var credit = $("#meWYSIWYGDataCredit").val();

    if ( size )
    {

        var size_array = size.split("_");
        if ( id > 0 && type == "image" )
        {
            var url2 = "/api/media/resizedimages/?element_id=" + id;
            $.ajax({
                url: url2
            }).done(function(data) {
                var url3 = "";
                for (var x=0;x < data.length;x++)
                {
                    var obj = data[x];
                    if (size_array[0] == "h" && obj.image_width >= obj.image_height)
                    {
                        //Horizonta images
                        if ( obj.image_width == size_array[1] )
                        {
                            url3 = obj.image_url;
                        }
                    }
                    else if (size_array[0] == "v" && obj.image_width < obj.image_height)
                    {
                        //Vertical images
                        if ( obj.image_width == size_array[1] )
                        {
                            url3 = obj.image_url;
                        }
                    }
                }
                if ( url3 )
                {
                    return meShowTinyMCEImage(type,url3,style,caption,credit);
                }
                else
                {
                    $.prompt.goToState('state1');
                }
            });
        }


    }
    else
    {
        return meShowTinyMCEImage(type,url,style,caption,credit);
    }
}

function meShowTinyMCEImage(type,url,style,caption,credit)
{
    if ( type == "image" )
    {
        var img = "<img src='";
        img += url
        img += "' ";
        img += ">";

        html = "<figure ";
        if ( style )
        {
            html += " class='" + style + "' ";
        }
        else
        {
            //html += " class='cmpnt-full-article-main-img' ";
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
            html += "</figcaption>";
        }
        html += "</figure>";
	}

	//tinyMCE.activeEditor.execCommand('mceInsertContent', false, html);
	//tinyMCE.get("id").execCommand('mceInsertContent', false, html);
	tinyMCE.editors[0].execCommand('mceInsertContent', false, html);
    $.prompt.close();
}


$(function() {

	var hidden_fields = "<input type='hidden' id='meWYSIWYGDataType' >";
	hidden_fields += "<input type='hidden' id='meWYSIWYGDataMedia' >";
	hidden_fields += "<input type='hidden' id='meWYSIWYGDataMediaUrl' >";
	hidden_fields += "<input type='hidden' id='meWYSIWYGDataCaption' >";
	hidden_fields += "<input type='hidden' id='meWYSIWYGDataCredit' >";
	hidden_fields += "<input type='hidden' id='meWYSIWYGDataText' >";

   //Initialize
   $("#content-main").append("<div id='hidden-data'>" + hidden_fields + "</div>");

});
