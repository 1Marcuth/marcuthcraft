const resources = [
    {
        resourceObject: new Image(),
        source: require("../assets/img/logo-intro.png"),
        key: "logoIntro"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/sprites.png"),
        key: "textureSprites"
    },
    {
        loadEventName: "loadeddata",
        resourceObject: new Audio(),
        source: require("../assets/aud/soundtrack.mp3"),
        key: "music1"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/skins/steve.png"),
        key: "playerSkin"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/logo.png"),
        key: "logo"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/main-menu-background-layers/2.png"),
        key: "backgroundLayerTwo"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/widgets.png"),
        key: "widgets"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/main-menu-background-layers/blur.png"),
        key: "backgroundBlur"
    },
    {
        resourceObject: new Image(),
        source: require("../assets/img/options-background.png"),
        key: "optionsBackground"
    }
]

export default resources