class BootScene extends Phaser.Scene {

    constructor() {
      super({
        key: 'BootScene'
      });
    }

    preload() {
        this.add.image(0, 0, 'loading_screen').setOrigin(0, 0);

        let load = this.load as any; // lol
        load.spritesheet('player', 'assets/sprites/ship_spritemap.png', { frameWidth: 65, frameHeight: 75 });

        this.load.audio('titleaudio', 'assets/audio/titlemusic.mp3', null);
        this.load.audio('gameoveraudio', 'assets/audio/gameover.mp3', null);
        this.load.audio('pew', 'assets/audio/Laser_shoot.wav', null);
        this.load.audio('shipfire', 'assets/audio/Laser_Shoot2.mp3', null);
        this.load.image('particle1', 'assets/sprites/particle_1.png');
        this.load.image('particle2', 'assets/sprites/particle_2.png');
        this.load.image('particle3', 'assets/sprites/particle_3.png');
        this.load.image('background_title', 'assets/sprites/title_screen.png');
        this.load.image('background_gameover', 'assets/sprites/gameoverfinaltransp.png');
        this.load.image('background_instruction', 'assets/sprites/instruction_screen.png');
        this.load.image('background_win', 'assets/sprites/win_screen.png');
        this.load.image('startguld', 'assets/sprites/startguld.png');
        this.load.image('instructionguld', 'assets/sprites/instructionguld.png');
        this.load.image('you_escaped', 'assets/sprites/youescaped.png');
        this.load.image('pixel', 'assets/sprites/pixel.png');
        this.load.image('bullet', 'assets/sprites/bullet.png');
        this.load.image('unicorn', 'assets/sprites/unicorn.png');
        this.load.image('unicornlarge', 'assets/sprites/unicornlarge.png');
        this.load.image('background', 'assets/sprites/funk_background_bottom.png');
        this.load.image('foreground', 'assets/sprites/funk_background_top.png');
        this.load.image('bluenote', 'assets/sprites/blue_note.png');
        this.load.image('greennote', 'assets/sprites/green_note.png');
        this.load.image('rednote', 'assets/sprites/red_note.png');
        this.load.image('yellownote', 'assets/sprites/yellow_note.png');
        this.load.image('bluefunk', 'assets/sprites/blue_funk.png');
        this.load.image('greenfunk', 'assets/sprites/green_funk.png');
        this.load.image('redfunk', 'assets/sprites/red_funk.png');
        this.load.image('yellowfunk', 'assets/sprites/yellow_funk.png');
        this.load.image('asteroid', 'assets/sprites/mushroom.png');
        this.load.image('particleyellow', 'assets/sprites/yellow.png');
        this.load.image('sparkles', 'assets/sprites/sparkles.png');
        this.load.image('success', 'assets/sprites/success.png');
        this.load.image('fail', 'assets/sprites/fail.png');

    }

    create() {
        this.add.text(350, 530, 'Loaded! Starting game...', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
            frameRate: 10,
            repeat: -1
          });

          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1] }),
            frameRate: 10,
            repeat: -1
          });

          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [2] }),
            frameRate: 10,
            repeat: -1
          });


        this.scene.start('TitleScene');
    }
}

export default BootScene;