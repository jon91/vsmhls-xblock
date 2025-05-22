(function() {
    'use strict';

    function VSMHLSXBlock(runtime, element) {
        function saveSettings() {
            var subtitleUrls = [];
            $('.subtitle-entry', element).each(function() {
                var $entry = $(this);
                subtitleUrls.push({
                    url: $entry.find('.subtitle-url').val(),
                    lang: $entry.find('.subtitle-lang').val(),
                    label: $entry.find('.subtitle-label').val()
                });
            });

            runtime.notify('save', {
                state: {
                    hls_url: $('#hls-url', element).val(),
                    poster_url: $('#poster-url', element).val(),
                    subtitle_urls: subtitleUrls
                }
            });

            $.ajax({
                type: 'POST',
                url: runtime.handlerUrl(element, 'save_settings'),
                data: JSON.stringify({
                    hls_url: $('#hls-url', element).val(),
                    poster_url: $('#poster-url', element).val(),
                    subtitle_urls: subtitleUrls
                }),
                contentType: 'application/json',
                success: function() {
                    runtime.notify('save', { state: 'success' });
                },
                error: function() {
                    runtime.notify('error', { msg: 'Failed to save settings' });
                }
            });
        }

        $('#add-subtitle', element).click(function() {
            var $entry = $('<div class="subtitle-entry">' +
                '<input type="text" class="subtitle-url" placeholder="Subtitle URL" />' +
                '<input type="text" class="subtitle-lang" placeholder="Language Code (e.g., en)" />' +
                '<input type="text" class="subtitle-label" placeholder="Label (e.g., English)" />' +
                '<button class="remove-subtitle">Remove</button>' +
                '</div>');
            $('#subtitle-list', element).append($entry);
        });

        $(element).on('click', '.remove-subtitle', function() {
            $(this).closest('.subtitle-entry').remove();
        });

        $('.save-button', element).click(function() {
            saveSettings();
        });

        $('.cancel-button', element).click(function() {
            runtime.notify('cancel', {});
        });
    }

    window.VSMHLSXBlock = VSMHLSXBlock;
})();