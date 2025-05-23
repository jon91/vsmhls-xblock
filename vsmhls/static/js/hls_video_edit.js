function VSMHLSXBlockStudio(runtime, element) {
    // Bind the "Save" button click
    $(element).find('.save-button').bind('click', function() {
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
    // Bind cancel event
    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });
}