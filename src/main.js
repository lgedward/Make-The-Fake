/*
Liam Edwards
Make The Fake: Broken Bonez
*/

'use strict';

let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            },
            debug: true, // Enable physics debugging
        }
    },
    scene: [ Load, Title, Play, Menu, Pause, GameOver ]
}

let game = new Phaser.Game(config);

let { height, width } = game.config

let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
const textSpacer = 64;
let player = null;
const playerWidth = 16;
const playerHeight = 128 * 0.75;
const playerVelocity = 150 * 0.75;
let level;
let highScore;
let newHighScore = false;
let cursors;

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;