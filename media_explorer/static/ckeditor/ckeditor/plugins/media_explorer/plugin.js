CKEDITOR.plugins.add( 'media_explorer', {
    init: function( editor ) {
        editor.addCommand( 'media_explorer', new CKEDITOR.dialogCommand( 'mediaExplorerDialog' ) );

        editor.ui.addButton( 'MediaExplorer', {
            label: 'Media Explorer',
            command: 'media_explorer',
            toolbar: 'Custom',
            icon: 'plugins/media_explorer/icons/media_explorer.png',
            click: function(editor){
        		MediaExplorer.type_input_id = "meWYSIWYGDataType";
        		MediaExplorer.div_id = "";
        		MediaExplorer.file_url_id = "meWYSIWYGDataMediaUrl";
        		MediaExplorer.media_input_id = "meWYSIWYGDataMedia";
        		MediaExplorer.caption_input_ids = ["meWYSIWYGDataCaption"];
        		MediaExplorer.credit_input_ids = ["meWYSIWYGDataCredit"];
        		MediaExplorer.callback = "meCKEditorCallback";

                window.open('/media_explorer/','Media Explorer','width=1200,height=1200');
            }
        });

    }
});
