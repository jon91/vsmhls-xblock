function VSMHLSXBlock(runtime, element) {
    var domElement = element.jquery ? element[0] : element;
    var playerContainer = domElement.querySelector("#player");
    if (!playerContainer) {
        console.error("Player container not found.");
        return;
    }
    var hls_url = playerContainer.getAttribute("data-hls-url");
    var poster_url = playerContainer.getAttribute("data-poster-url");
    var xblock_display_name = playerContainer.getAttribute("data-xblock-display-name");

    function initPlayer() {
        if (window.Playerjs) {
            new Playerjs({
                id: "player",
                file: hls_url,
                poster: poster_url,
                title: xblock_display_name // Passing the new display name
            });
        } else {
            setTimeout(initPlayer, 50);
        }
    }
    initPlayer();
}