class Play extends Phaser.Scene {
    constructor() {
        super({key:'playScene'});
        this.isJumping = false;
        this.finished = true;
        this.player = null;
    }

    init(data) {
        this.playerCount = data.playerCount;
    }

    create() {
        this.player = this.physics.add.sprite(32, game.config.height / 2, 'sprite', 'sprite1').setOrigin(0.5);
        
        let textPositionX = game.config.width / 13;
        let textPositionY = game.config.height / 3;
        
        this.time.delayedCall(1000, () => {
            let levelText = this.add.text(textPositionX, textPositionY, `Level ${player2Level}`, {
                fontSize: '48px',
                fill: '#FFF'
            }).setOrigin(0.0);
            this.time.delayedCall(1000, () => {
                levelText.destroy();
                let startText = this.add.text(textPositionX, textPositionY, 'Start', {
                    fontSize: '48px',
                    fill: '#FFF'
                }).setOrigin(0.0);
                this.time.delayedCall(1000, () => {
                
                    startText.destroy(); // Remove 'Start' text
                    this.finished = false;
                });
            });

        });

        // Get tilemap for level
        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('tileset', 'tilesetImage');
        const bglayer = map.createLayer('Background', tileset, 0, 0);
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        const hillLayer = map.createLayer('Hills', tileset, 0, 0);
        const floorLayer = map.createLayer('Floor', tileset, 0, 0);
        const finishLayer = map.createLayer('Finish', tileset, 0, 0);

        // Collision for level
        terrainLayer.setCollisionByProperty({ collides: true });
        hillLayer.setCollisionByProperty({ collides: true });
        floorLayer.setCollisionByProperty({ collides: true });
        finishLayer.setCollisionByProperty({ collides: true });
        this.setupPlayer();
        this.updateScoreDisplay();
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // Banger theme from Regular Show
        this.bgm = this.sound.add('Theme', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        player = this.physics.add.sprite(32, centerY, 'sprite', 'sprite1').setOrigin(0.5);
        this.anims.create({
            key: 'ride',
            frames: this.anims.generateFrameNames('sprite', {
                start: 1,
                end: 4,
                zeroPad: 0,
                prefix: 'sprite',
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNames('sprite', {
                start: 20,
                end: 22,
                zeroPad: 0,
                prefix: 'sprite',
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'victory',
            frames: this.anims.generateFrameNames('sprite', {
                frames: ['sprite32', 'sprite33']
            }),
            frameRate: 10,
            repeat: -1
        });    
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNames('explosion', {
                frames: ['sprite49', 'sprite48', 'sprite17', 'sprite12', 'sprite7']
            }),
            frameRate: 4,
            repeat: 0
        });  
        
        player.on('animationcomplete', this.handleAnimationComplete, this);

        
        // Player values
        player.play('ride');
        player.setCollideWorldBounds(true);
        player.setDepth(1);
        player.destroyed = false;
        player.setScale(-1, 1);
        player.body.offset.x = 65;
        player.body.setGravityY(150);
        player.setVelocityX(50);

        // Collision checks
        this.physics.add.collider(player, hillLayer, this.handleHillCollisionStart, null, this);
        this.physics.add.collider(player, terrainLayer, this.handleGroundContact, null, this);
        this.physics.add.collider(player, floorLayer);
        this.physics.add.collider(player, finishLayer, this.handleFinishContact, null, this);        
        
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(player, true, 0.25, 0.25);

        // Pause and menu logic
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)

        // Combo key
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    setupPlayer() {
        let textPositionX = this.player.x; // Player's current x position
        let textPositionY = this.player.y - 50; // Above the player

        this.playerLabel = this.add.text(textPositionX, textPositionY, `Player ${currentPlayer}`, {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(0.5);
    }

    handleAnimationComplete(animation, frame, sprite) {
        if (animation.key === 'explosion') {
            this.fadeSprite(sprite);
        }
    }

    fadeSprite(sprite) {
        this.tweens.add({
            targets: sprite,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: 'Linear',
        });
    }
    

    handleHillCollisionStart = (player, hill) => {
        // Only initiate jump if not already jumping over a hill
        if (!this.isJumping) {
            player.setVelocityY(-150);
            player.play('fly');
            this.time.delayedCall(1000, () => {
                this.isJumping = true;
            }, [], this);
        }
    };

    handleFinishContact = (player, finish) => {
        if (this.playerCount == 2 && currentPlayer == 1) {
            player1Level++; // Increment player 1's level
            this.finished = true;
            currentPlayer = 2; // Set current player to 2
            this.time.delayedCall(2000, () => { this.scene.restart({ playerCount: 2 }); });
            this.time.delayedCall(2000, () => { this.bgm.stop(); });
            player.play('victory');
            this.end = this.sound.add('Finish Line Sound', { 
                mute: false,
                volume: 1,
                rate: 1,
                loop: false 
            });
            this.end.play();

        } else if (this.playerCount == 2 && currentPlayer == 2) {
            player2Level = player1Level;
            this.finished = true;
            currentPlayer = 1; // Set current player to 1
            this.time.delayedCall(2000, () => { this.scene.restart({ playerCount: 2 }); });
            this.time.delayedCall(2000, () => { this.bgm.stop(); });
            player.play('victory');
            this.end = this.sound.add('Finish Line Sound', { 
                mute: false,
                volume: 1,
                rate: 1,
                loop: false 
            });
            this.end.play();
        } else {
            player1Level++; // Single player mode, just increment player 1's level
            // Handle game over or level transition for single player
            this.finished = true;
            this.time.delayedCall(2000, () => { this.scene.restart({ playerCount: 1 }); });
            this.time.delayedCall(2000, () => { this.bgm.stop(); });
            player.play('victory');
            this.end = this.sound.add('Finish Line Sound', { 
                mute: false,
                volume: 1,
                rate: 1,
                loop: false 
            });
            this.end.play();
        }

    };

    updateScoreDisplay() {
        let textPositionX = this.player.x; // Player's current x position
        let textPositionY = this.player.y - 40; // Above the player
        const score = currentPlayer == 1 ? player1Score : player2Score;
        this.scoreText = this.add.text(textPositionX, textPositionY, `Score: ${score}`, {
            fontSize: '24px',
            fill: '#FFF'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: this.scoreText,
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Linear',
        });

    }
    
    handleGroundContact = (player, ground) => {
        // Reset jump state when touching the ground
        if (this.isJumping) {
            // Check if the sprite's rotation is not close to 0 (allowing some tolerance for what counts as 'flat')
            const tolerance = 10; // Degrees within which the landing is considered flat
            const playerAngle = Phaser.Math.RadToDeg(player.rotation) % 360; // Convert player rotation to degrees and mod by 360 for comparison
            if (playerAngle > tolerance && playerAngle < (360 - tolerance)) {
                // Not landing flat
                if (player.rotationTween) { // Check if a rotation tween exists and stop it
                    player.rotationTween.stop();
                }
                player.angle = 0;
                player.play('explosion');
                this.time.delayedCall(3000, () => { this.bgm.stop(); });
                this.end = this.sound.add('Explosion Sound', { 
                    mute: false,
                    volume: 1,
                    rate: 1,
                    loop: false 
                });
                this.end.play();
                player.setVelocityX(0); // Stop horizontal movement
                player.setVelocityY(0); // Stop vertical movement (falling/jumping)
                this.finished = true;
                this.time.delayedCall(3000, () => {this.scene.start('gameOverScene', {
                    playerCount: this.playerCount,
                    player1Level: player1Level,
                    player2Level: player2Level,
                    player1Score: player1Score,
                    player2Score: player2Score
                });});
            } else {
                // Landing is flat, continue as normal
                player.play('ride'); // Switch back to riding animation
            }
            this.isJumping = false;
        }
    };

    rotateSprite(sprite) {
        if (sprite.rotationTween) {
            sprite.rotationTween.stop();
        }

        sprite.rotationTween = this.tweens.add({
            targets: sprite,
            angle: sprite.angle + 360,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                sprite.angle = 0;
                // Update the score based on the current player
                if (currentPlayer == 1) {
                    player1Score += 10;
                } else {
                    player2Score += 10;
                }
                // Refresh the score display to show the updated score
                this.updateScoreDisplay();
            }
        });
    }

    update() {
        if (this.playerLabel) {
            this.playerLabel.x = player.x;
            this.playerLabel.y = player.y - 50;
        }
        if (this.scoreText) {
            this.scoreText.x = player.x;
            this.scoreText.y = player.y - 80;
        }
        if(Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            if(!this.scene.isActive('menuScene')) {
                this.scene.run('menuScene')
            }  
        }
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.scene.pause().launch('pauseScene')
        }

        if (Phaser.Input.Keyboard.JustDown(this.upKey) && (this.isJumping == true)) {
            this.rotateSprite(player);
        }

        if (!this.finished){
            player.setVelocityX(100);
        }
        else {
            player.setVelocity(0);

        }
        player.x = Phaser.Math.Clamp(player.x, player.width / 2, game.config.width - player.width / 2);
        player.y = Phaser.Math.Clamp(player.y, player.height / 2, game.config.height - player.height / 2);
    }
}
