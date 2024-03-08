class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        this.add.text(100, 100, 'Broken Bonez', { fontSize: '32px', fill: '#FFF' });
        let onePlayerButton = this.add.text(100, 150, '1 Player', { fontSize: '24px', fill: '#FFF' }).setInteractive();
        let twoPlayerButton = this.add.text(100, 200, '2 Player', { fontSize: '24px', fill: '#FFF' }).setInteractive();
    
        onePlayerButton.on('pointerdown', () => {
          this.scene.start('playScene', { playerCount: 1 });
        });
    
        twoPlayerButton.on('pointerdown', () => {
          this.scene.start('playScene', { playerCount: 2 });
        });
      }
}