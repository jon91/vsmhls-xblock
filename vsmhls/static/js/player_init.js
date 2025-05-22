function VSMHLSXBlock(runtime, element) {
    var playerContainer = element.querySelector("#player");
    if (!playerContainer) {
        console.error("Player container not found.");
        return;
    }
    var hls_url = playerContainer.getAttribute("data-hls-url");
    var poster_url = playerContainer.getAttribute("data-poster-url");

    function initPlayer() {
        if (window.Playerjs) {
            // Initialize Playerjs when available
            new Playerjs({
                id: "player",
                file: hls_url,
                poster: poster_url
            });
        } else {
            // Check again after a short delay
            setTimeout(initPlayer, 50);
        }
    }
    initPlayer();
}