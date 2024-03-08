class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.isJumping = false;
        this.finished = false;
    }

    create() {
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

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // Banger theme from Regular Show
        this.bgm = this.sound.add('Theme', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();
        // Animations
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
        // Finish line
        this.finished = true;
    };
    
    handleGroundContact = (player, ground) => {
        // Reset jump state when touching the ground
        if (this.isJumping) {
            player.play('ride'); // Switch back to riding animation
            this.isJumping = false;
        }
    };

    rotateSprite(sprite) {
        // Rotation combo for player
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
            }
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            if(!this.scene.isActive('menuScene')) {
                // .run will run the target scene, but not change the state of the invoking scene
                // (.run also wakes a sleeping scene)
                this.scene.run('menuScene')
            }  
        }
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            // .pause will stop the update step but still render the scene
            // .launch will launch the target scene and run it in parallel with the invoking scene
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
