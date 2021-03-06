import { GameMap } from './GameMap';
import { Player } from './Player';
import { Communicator } from './Communicator';
import { PowerUp, Power } from './PowerUp';
import { NoteType } from '../rythm/NoteType';

export class Shmup {

  gamemap: GameMap;
  player: any;
  asteroids: Phaser.Physics.Arcade.Sprite[];
  powerUps: PowerUp[];
  bulletgroup: any;

  starfield: Phaser.Physics.Arcade.Sprite[];
  private shieldCost: number = 10;
  private bulletCost: number = 3;
  public gameOver: boolean = false;
  private shmup: Shmup;
  private scoreTimer: number = 0;
  private lastScore: number = 0;

  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitters: any;

  bullets: any;
  bulletCleanTimer: number = 0;

  constructor(private scene: any, private communicator: Communicator, private scenePlug: Phaser.Scenes.ScenePlugin) {
    this.gamemap = new GameMap(this, this.scene);
    this.shmup = this;
  }

  public preload() {
  }

  public create() {
    this.gameOver = false;
    this.scoreTimer = 0;
    this.lastScore = 0;
    this.bulletCleanTimer = 0;
    this.asteroids = [];
    this.starfield = [];
    this.powerUps = [];
    this.emitters = [];
    this.bullets = [];
    this.bulletgroup = this.scene.physics.add.group();
    this.gamemap.create(this.asteroids, this.powerUps);
    this.player = new Player({ scene: this.scene, x: 820, y: 960 - 50, shmup: this });

    this.scene.physics.world.setBounds(340, 0, 1280 - 340, 960);
    this.scene.physics.add.collider(this.player.sprite, this.asteroids, this.crash, null, this.scene);
    this.scene.physics.add.collider(this.bulletgroup, this.asteroids, this.explode, null, this.scene);
    this.scene.physics.add.collider(this.player.sprite, this.powerUps, this.powerCollect, null, this.scene);

    this.particles = this.scene.add.particles('particle3')
    for (let i = 0; i < 75; i++) {
      this.createStar(Phaser.Math.Between(-30, 960));
    }
  }

  public createStar(y: number = -50) {
    this.starfield.push(this.scene.add.sprite(Phaser.Math.Between(340, 1280), y, 'sparkles'));
    let scale = 0.15 + (Math.random() * 0.4);
    let star = this.starfield[this.starfield.length - 1];
    star.setScale(scale);
    star.setDepth(0);
    star.setRotation(Phaser.Math.Between(0, 360));
    star.tint = Math.random() * 0xffffff;
  }

  public createBullet() {
    // check funkmeter
    if (this.communicator.getFunkAmount() >= this.bulletCost) {
      this.communicator.removeFunk(this.bulletCost);
    } else {
      return false;
    }

    this.bullets.push(this.bulletgroup.create(this.player.sprite.x, this.player.sprite.y, 'bullet'));
    let bullet = this.bullets[this.bullets.length - 1];

    bullet.setVelocity(0, -600);
    bullet.setScale(1.0);

    // this.emitters.push(this.particles.createEmitter({
    //   x: 0,
    //   y: 0,
    //   // tint: 0xffffffff,
    //   tint: {
    //     onEmit: function (p, k, t, v) {
    //       return Math.random() * 0xffffffff;
    //     }
    //   },
    //   // angle: 90,
    //   angle: {
    //     onEmit: function (p, k, t, v) {
    //       return Phaser.Math.Between(75, 105);
    //     }
    //   },
    //   speed: { min: 0, max: 300 },
    //   quantity: 1,
    //   // frequency: 2,
    //   // alpha: 0.8,
    //   alpha: { start: 1.0, end: 0.01 },
    //   // speed: { min: -1100, max: 100 },
    //   gravityY: 10,
    //   gravityX: 0,
    //   scale: { start: 0.2, end: 1.0 },
    //   lifespan: 1000,
    //   blendMode: 'ADD'
    // }));
    // bullet.emitterRef = this.emitters[this.emitters.length - 1];
    // bullet.emitterRef.startFollow(bullet, 0, 10, true);

    return true;
  }

  public crash(player, asteroid) {

    if (this.communicator.getFunkAmount() >= this.shmup.shieldCost) {
      this.communicator.removeFunk(this.shmup.shieldCost);
      asteroid.destroy();
    } else {
      this.scene.gameOver = true;
    }

  }

  public explode(target, shot) {
    // this.shmup.emitters.splice(this.shmup.emitters.indexOf(shot.emitterRef), 1);
    this.shmup.bullets.splice(this.shmup.bullets.indexOf(shot), 1);
    shot.destroy();
    target.destroy();
  }

  public powerCollect(player, powerUp: PowerUp) {
    switch (powerUp.power) {
      case Power.left:
        this.communicator.addFunk(NoteType.left);
        this.communicator.addFunk(NoteType.left);
        this.communicator.addFunk(NoteType.left);
        break;
      case Power.midLeft:
        this.communicator.addFunk(NoteType.midleft);
        this.communicator.addFunk(NoteType.midleft);
        this.communicator.addFunk(NoteType.midleft);
        break; case Power.midRight:
        this.communicator.addFunk(NoteType.midright);
        this.communicator.addFunk(NoteType.midright);
        this.communicator.addFunk(NoteType.midright);
        break;
      case Power.right:
        this.communicator.addFunk(NoteType.right);
        this.communicator.addFunk(NoteType.right);
        this.communicator.addFunk(NoteType.right);
        break;

      default:
        break;
    }
    powerUp.destroy();
  }

  public nuke() {
    for (let asteroid of this.asteroids) {
      asteroid.destroy();
    }
    this.asteroids = [];
  }

  public update(time: number, delta: number) {
    this.bulletCleanTimer += delta;
    this.scoreTimer += delta;
    this.gamemap.update(time, delta);
    this.player.update(delta, this.communicator.getFunkAmount());
    if (Math.random() < 0.05) {
      this.createStar();
    }

    if (this.bulletCleanTimer > 1000) {
      for (let index = 0; index < this.bullets.length; index++) {
        if (this.bullets.hasOwnProperty(this.bullets[index])) {
          let bullet = this.bullets[index];
          if (bullet.y < -1000) {
            //this.emitters.splice(this.emitters.indexOf(bullet.emitterRef), 1);
            this.bullets.splice(this.bullets.indexOf(bullet), 1);
            index--;
            bullet.destroy();
          }
        }
      }
      this.bulletCleanTimer = 0;
    }

    for (let index = 0; index < this.starfield.length; index++) {
      let star = this.starfield[index];
      star.y += star.scaleX + star.scaleY;
      if (star.y > 1000) {
        this.starfield.splice(index--, 1);
        star.destroy();
      }
    }

    if (this.scoreTimer > 5000) {

      let funk: number = this.communicator.getScore();
      //let diff: number = funk - (400000 - this.lastScore);
      let diff: number =  this.lastScore - funk;
      if (diff > 10000) {

        this.adjustAsteroidInterval(Math.pow(0.97, Math.floor(diff/10000)));
        this.lastScore = funk;
      }

      this.scoreTimer = 0;
    }

  }

  public adjustVelocity(multiplier: number) {
    this.gamemap.adjustVelocity(multiplier);
  }

  public setVelocity(velocity: number) {
    this.gamemap.setVelocity(velocity);
  }

  public adjustAsteroidInterval(multiplier: number) {
    this.gamemap.adjustAsteroidInterval(multiplier);
  }

  public setAsteroidInterval(interval: number) {
    this.gamemap.setAsteroidInterval(interval);
  }

  public adjustPowerUpInterval(multiplier: number) {
    this.gamemap.adjustPowerUpInterval(multiplier);
  }

  public setPowerUpInterval(interval: number) {
    this.gamemap.setPowerUpInterval(interval);
  }

}