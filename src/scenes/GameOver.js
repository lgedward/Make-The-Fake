class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            if(level > storedScore) {
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - textSpacer, 'gem', 'New Hi-Score!', 32).setOrigin(0.5);
        }
        this.add.bitmapText(centerX, centerY, 'gem', `Villagers eaten: ${level}`, 48).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer, 'gem', `This browser's best: ${highScore}`, 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'gem', `Press UP ARROW to Restart`, 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*3, 'gem', `Music from Youtube, Dragon Death Sound from LoL`, 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*4, 'gem', `Horn from Youtube, Villager death from WoW`, 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - textSpacer*2, 'gem', `Dragon from OpenGameArt, background from DeviantArt`, 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - textSpacer, 'gem', `Arrow from DeviantArt, Villager from OpenGameArt `, 36).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - textSpacer*3, 'gem', `Done by Liam Edwards`, 36).setOrigin(0.5);
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('playScene');
        }
    }
}