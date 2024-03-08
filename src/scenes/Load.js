class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        this.load.path = './assets/';
        this.load.atlas('sprite', 'img/spritesheet.png', 'MotorSprite.json');

        this.load.image('tilesetImage', 'tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'LevelLayout.json')

        // load graphics assets

        // load audio assets
        this.load.audio('Theme', ['audio/Broken Bonez Theme.mp3']);

        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');
    }

    create() {
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }
        this.scene.start('titleScene');
    }
}