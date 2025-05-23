function VSMHLSXBlockStudio(runtime, element) {
    // Save button: submit new settings.
    $(element).find('.save-button').bind('click', function() {
        // Build the URL for the JSON handler "studio_submit"
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
        var data = {
            xblock_display_name: $(element).find('#xblock_display_name').val(),
            hls_url: $(element).find('#hls-url').val(),
            poster_url: $(element).find('#poster-url').val()
        };
        runtime.notify('save', {state: 'start'});
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            runtime.notify('save', {state: 'end'});
        });
    });

    // Cancel button: close the edit view.
    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });
}