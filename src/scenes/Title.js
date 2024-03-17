class Title extends Phaser.Scene {
  constructor() {
      super('titleScene');
  }

  create() {
      // Create a single graphics object for highlighting
      this.highlightGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
      this.highlightGraphics.setVisible(false); // Initially hidden

      this.add.text(100, 100, 'Broken Bonez', { fontSize: '32px', fill: '#FFF' });
      let onePlayerButton = this.add.text(100, 150, '1 Player', { fontSize: '24px', fill: '#FFF' }).setInteractive();
      let twoPlayerButton = this.add.text(100, 200, '2 Player', { fontSize: '24px', fill: '#FFF' }).setInteractive();

      onePlayerButton.on('pointerdown', () => {
          this.scene.start('playScene', { playerCount: 1 });
      });

      twoPlayerButton.on('pointerdown', () => {
          this.scene.start('playScene', { playerCount: 2 });
      });

      // Add pointerover and pointerout events for onePlayerButton
      onePlayerButton.on('pointerover', () => this.drawHighlight(onePlayerButton));
      onePlayerButton.on('pointerout', () => this.highlightGraphics.setVisible(false));

      // Add pointerover and pointerout events for twoPlayerButton
      twoPlayerButton.on('pointerover', () => this.drawHighlight(twoPlayerButton));
      twoPlayerButton.on('pointerout', () => this.highlightGraphics.setVisible(false));

      let tutorialButton = this.add.text(100, 250, 'Tutorial', { fontSize: '24px', fill: '#FFF' }).setInteractive();
        tutorialButton.on('pointerdown', () => {
            this.scene.start('tutorialScene');
        });

        // Add pointerover and pointerout events for tutorialButton
        tutorialButton.on('pointerover', () => this.drawHighlight(tutorialButton));
        tutorialButton.on('pointerout', () => this.highlightGraphics.setVisible(false));
  }

  // Function to update and show highlight around the button
  drawHighlight(button) {
      // Calculate rectangle bounds with some padding
      let bounds = button.getBounds();
      this.highlightGraphics.clear(); // Clear previous drawings
      this.highlightGraphics.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
      this.highlightGraphics.setVisible(true); // Make sure the highlight is visible
  }
}
