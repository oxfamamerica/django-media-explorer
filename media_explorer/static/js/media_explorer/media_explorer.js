var MediaExplorer = {

  field_id: "",
  type_input_id: "",
  file_url_id: "",
  media_input_id: "",
  caption_input_ids: [],
  credit_input_ids: [],
  style_input_id: "",
  current_image_id: "",
  callback: "",
  insert: function(obj){

    $("#" + this.media_input_id).val(obj.id);

    var html = "<img style='max-width:150px' src='";
    html += obj.thumbnail_image_url;
    html += "' >";
    $("#" + this.current_image_id).html(html);

    try
    {

        if ( obj.type )
        {
            $("#" + this.type_input_id).val(obj.type);
        }
        else
        {
            $("#" + this.type_input_id).val("gallery");
        }

        if ( obj.type == "image" )
        {
            $("#" + this.file_url_id).val(obj.image_url);

            for (var x=0;x < this.credit_input_ids.length;x++)
            {
                $("#" + this.credit_input_ids[x]).val(obj.credit);
            }
            for (var x=0;x < this.caption_input_ids.length;x++)
            {
                $("#" + this.caption_input_ids[x]).val(obj.description);
            }

        }

    }
    catch(err)
    {
        $("#" + this.type_input_id).val("gallery");
    }

    if ( this.callback )
    {
        return window.parent[this.callback].apply(this);
    }

  },
  remove: function(){
   	$("#" + this.current_image_id).html("");
    $("#" + this.type_input_id).val("");
    $("#" + this.file_url_id).val("");
    $("#" + this.media_input_id).val("");
    for (var x=0;x < this.credit_input_ids.length;x++)
    {
        $("#" + this.credit_input_ids[x]).val("");
    }
    for (var x=0;x < this.caption_input_ids.length;x++)
    {
    $("#" + this.caption_input_ids[x]).val("");
    }
   	$("#" + this.style_input_id).val("");
   	//$("#" + this.callback).val("");

    this.url_input_id = "";
    this.current_image_id = "";
    this.media_input_id = "";
    this.caption_input_ids = [];
    this.credit_input_ids = [];
    this.style_input_id = "";
    //this.callback = "";

    if ( this.callback )
    {
        return window.parent[this.callback].apply(this);
    }

  },

  openWindow: function(type,size){
    var win = window.open("/media_explorer/",'mediaExplorer','width=1200,height=1000,scrollbars=1');
    win.focus();
  },
};


