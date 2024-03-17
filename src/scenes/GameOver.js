class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    init(data) {
        this.playerCount = data.playerCount;
        this.player1Level = data.player1Level;
        this.player2Level = data.player2Level;
        this.player1Score = data.player1Score;
        this.player2Score = data.player2Score;
    }

    create() {
        
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            if(player1Level > storedScore) {
                localStorage.setItem('hiscore', player1Level.toString());
                highScore = player1Level;
                newHighScore = true;
            } else {
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            let highScore = player1Level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        if (this.playerCount === 2) {
            // Display player 1's stats
            this.add.bitmapText(centerX, centerY - textSpacer, 'gem', `Player 1 Level: ${this.player1Level}`, 32).setOrigin(0.5);
            this.add.bitmapText(centerX, centerY, 'gem', `Player 1 Score: ${this.player1Score}`, 32).setOrigin(0.5);
            // Display player 2's stats
            this.add.bitmapText(centerX, centerY + textSpacer, 'gem', `Player 2 Level: ${this.player2Level}`, 32).setOrigin(0.5);
            this.add.bitmapText(centerX, centerY + 2 * textSpacer, 'gem', `Player 2 Score: ${this.player2Score}`, 32).setOrigin(0.5);
        } else {
            // Display only player 1's stats for single-player mode
            this.add.bitmapText(centerX, centerY - textSpacer, 'gem', `Level: ${this.player1Level}`, 32).setOrigin(0.5);
            this.add.bitmapText(centerX, centerY, 'gem', `Score: ${this.player1Score}`, 32).setOrigin(0.5);
        }

        let baseY = centerY + textSpacer;

        // Credits and acknowledgments
        let credits = [
            "Motorbike/Explosion spritesheet from OpenGameArt",
            "Theme and sound effects from Youtube",
            "Tileset made by me",
            "Portions of Button, Menu, Pause, Load, GameOver, \nand Title inspired from in-class examples"
        ];

        credits.forEach((line, index) => {
            this.add.bitmapText(centerX, baseY + (index * textSpacer), 'gem', line, 24).setOrigin(0.5);
        });

        this.add.bitmapText(centerX, game.config.height - 100, 'gem', 'Press UP ARROW to Restart', 24).setOrigin(0.5);

        cursors = this.input.keyboard.createCursorKeys();
        player1Level = 1;
        player2Level = 1;
        player1Score = 0;
        player2Score = 0;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('playScene', { playerCount: this.playerCount });
        }
    }
}