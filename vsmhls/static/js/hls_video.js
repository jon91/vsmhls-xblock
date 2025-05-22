function VSMHLSXBlock(runtime, element) {
    var videoEl = element.querySelector('video');
    if (!videoEl) {
        console.error("Video element not found.");
        return;
    }
    
    
    const playerConfig = {
        html5: {
            vhs: {
                enableLowInitialPlaylist: true,
                smoothQualityChange: true,
                overrideNative: !videojs.browser.IS_SAFARI, // Use native HLS in Safari
                allowSeeksWithinUnsafeLiveWindow: true,
                handleManifestRedirects: true,
                blacklistDuration: 60
            }
        },
        nativeControlsForTouch: false,
        controls: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        preload: 'auto',
        responsive: true,
        errorDisplay: true,
        loadingSpinner: true,
        controlBar: {
            children: [
                'playToggle',
                'volumePanel',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'liveDisplay',
                'customControlSpacer',
                'playbackRateMenuButton',
                'qualitySelector',
                'chromecastButton',
                'airplayButton',
                'fullscreenToggle'
            ]
        }
    };

    // Initialize player
    var player = videojs(videoEl, playerConfig);
    
    // Handle quality levels after player is ready
    player.ready(function() {
        var qualityLevels = player.qualityLevels();
        
        qualityLevels.on('change', function() {
            var selectedQuality = qualityLevels[qualityLevels.selectedIndex];
            console.log('Quality changed to:', selectedQuality ? selectedQuality.height + 'p' : 'auto');
        });
    });
    
    // Error handling
    player.on('error', function() {
        console.error('Video player error:', player.error());
    });

    // Save player state
    player.on('timeupdate', function() {
        localStorage.setItem('videoTime-' + videoEl.id, player.currentTime());
    });

    // Restore player state
    player.ready(function() {
        const savedTime = localStorage.getItem('videoTime-' + videoEl.id);
        if (savedTime) {
            player.currentTime(parseFloat(savedTime));
        }
        
        if (player.httpSourceSelector) {
            player.httpSourceSelector({ 
                default: 'auto',
                displayMode: 'list'
            });
        }
    });
    
    // Clean up on dispose
    return {
        dispose: function() {
            if (player) {
                player.dispose();
            }
        }
    };
}