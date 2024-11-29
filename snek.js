import { colorCell, generateTable } from './utils.js';
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
const FOOD_COLOR = '#b54624';
const SNEK_COLOR = '#35db53';
const BOARD_COLOR = '#2d3138';

export class Engine {
  constructor(mapSize) {
    /* @type HTMLTableElement */
    this.map = generateTable(mapSize);
    this.mapSize = mapSize;
    this.direction = UP;
    this.snek = [
      {
        x: Math.floor(this.mapSize / 2),
        y: Math.floor(this.mapSize / 2)
      },
      {
        x: Math.floor(this.mapSize / 2) + 1,
        y: Math.floor(this.mapSize / 2)
      }
    ];
    this.head = this.snek[0];
    this.tail = this.snek[this.snek.length - 1];
    this.food = null;
    this.stop = false;

    this.update = this.update.bind(this);
    this.prepare = this.prepare.bind(this);
    this.start = this.start.bind(this);

    this.checkIsOutOfBounds = this.checkIsOutOfBounds.bind(this);
    this.getNewTail = this.getNewTail.bind(this);

    this.readInput = this.readInput.bind(this);

    this.spawnFood = this.spawnFood.bind(this);

    this.moveSnek = this.moveSnek.bind(this);
    this.moveSnekTail = this.moveSnekTail.bind(this);
    this.eatFood = this.eatFood.bind(this);

    this.drawSnek = this.drawSnek.bind(this);
    this.drawFood = this.drawFood.bind(this);
    this.drawTable = this.drawTable.bind(this);
  }

  readInput(event) {
    switch (event.key) {
      case 'j':
        this.direction = DOWN;
        break;
      case 'k':
        this.direction = UP;
        break;
      case 'l':
        this.direction = RIGHT;
        break;
      case 'h':
        this.direction = LEFT;
        break;
      default:
    }
    console.log(this.direction);
  }

  spawnFood() {
    const x = Math.floor(Math.random() * this.mapSize);
    const y = Math.floor(Math.random() * this.mapSize);
    return { x, y };
  }

  eatFood() {
    if (this.tail.x == this.food.x && this.tail.y == this.food.y) {
      this.preparedToEat = true;
      this.oldTail = { x: this.tail.x, y: this.tail.y };
    }
    if (this.preparedToEat) {
      this.preparedToEat = false;
      this.snek.push(this.oldTail);
      this.tail = this.snek[this.snek.length - 1];
      this.tail.x = this.food.x;
      this.tail.y = this.food.y;
    }
  }

  drawTable() {
    for (let row of this.map.rows) {
      for (let cell of row.cells) {
        if (cell.style.backgroundColor !== FOOD_COLOR) {
          cell.style.backgroundColor = BOARD_COLOR;
        }
      }
    }
  }

  drawFood() {
    console.log("drawing food")
    colorCell(this.map, this.food.x, this.food.y, FOOD_COLOR);
  }

  drawSnek() {
    console.log(this.snek);
    for (const hunk of this.snek) {
      colorCell(this.map, hunk.x, hunk.y, SNEK_COLOR);
    }
    //colorCell(this.map, this.snek[this.snek.length - 1].x, this.snek[this.snek.length - 1].y, BOARD_COLOR);
    return { x: this.head.x, y: this.head.y };
  }

  getNewTail() {
    return this.snek[this.snek.length - 2];
  }

  moveSnekTail() {
    this.tail.x = this.getNewTail().x;
    this.tail.y = this.getNewTail().y;
    //ABOVE
  }

  moveSnek() {
    this.moveSnekTail();
    switch (this.direction) {
      case UP:
        this.head.x--;
        break;
      case DOWN:
        this.head.x++;
        break;
      case LEFT:
        this.head.y--;
        break;
      case RIGHT:
        this.head.y++;
        break;
      default:
    }
  }

  checkIsOutOfBounds() {
    if (this.head.x < 0 || this.head.y < 0 || this.head.x > this.mapSize || this.head.y > this.mapSize) {
      this.stop = true;
    }
  }

  prepare() {
    this.drawSnek();
    this.food = this.spawnFood();
    document.addEventListener('keydown', this.readInput);
  }

  update() {
    this.moveSnek();
    this.checkIsOutOfBounds();
    this.eatFood();
    this.drawTable();
    this.drawSnek();
    this.drawFood();
    console.log("stop: " + this.stop);
    if (this.stop) {
      clearInterval(this.intervalId);
      console.log("Game over");
    }
  }

  start() {
    this.prepare();
    this.intervalId = setInterval(this.update.bind(this), 500);
  }
}
