class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' })
    }

    create() {
        // show menu image
        this.add.image(centerX, centerY, 'menu').setOrigin(0.5)

        // show menu text
        this.add.text(centerX, centerY + 64, 'Exit (M)enu').setOrigin(0.5)

        // input
        this.exitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)

        // create rectangles
        this.rect01 = this.add.rectangle(centerX, centerY, 32, 32, 0xDD00BB)
        this.rect02 = this.add.rectangle(centerX, centerY, 32, 32, 0xFFAA11)
    }

    update() {
        // monitor for pause exit
        if(Phaser.Input.Keyboard.JustDown(this.exitKey)) {
            // .sendToBack will position this scene below other scenes
            // .sleep will disable update and rendering but not shutdown this scene
            this.scene.sendToBack().sleep()
        }

        // rotate rectangles
        this.rect01.angle += 0.5
        this.rect02.angle -= 0.9
    }
}