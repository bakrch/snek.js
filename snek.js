import { colorCell, generateTable } from './utils.js';
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
const FOOD_COLOR = '#b54624';
const EATEN_FOOD_COLOR = '#2d6938';
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
    this.getChunkAt = this.getChunkAt.bind(this);

    this.readInput = this.readInput.bind(this);

    this.spawnFood = this.spawnFood.bind(this);

    this.moveSnek = this.moveSnek.bind(this);
    this.moveSnekChunks = this.moveSnekChunks.bind(this);
    this.eatFood = this.eatFood.bind(this);
    this.appendFood = this.appendFood.bind(this);


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
    return { x, y, eaten: false };
  }

  eatFood() {
    if (this.head.x == this.food.x && this.head.y == this.food.y) {
      this.eating = true;
      this.foodCounter = 0;
      this.food.eaten = true;
    }
  }

  appendFood() {
    if (this.eating) {
      if (this.foodCounter < this.snek.length) {
        this.foodCounter++;
      } else {
        this.eating = false;
        this.snek.push({ x: this.food.x, y: this.food.y });
        this.tail = this.snek[this.snek.length - 1];
        this.food = this.spawnFood();
      }
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
    if (this.food.eaten) {
      colorCell(this.map, this.food.x, this.food.y, EATEN_FOOD_COLOR);
    } else {
      colorCell(this.map, this.food.x, this.food.y, FOOD_COLOR);
    }
  }

  drawSnek() {
    let log = '[';
    for (const chunk of this.snek) {
      log += ` {x: ${chunk.x} , y: ${chunk.y}}, `;
    }
    log += ']';
    console.log(log);
    for (const chunk of this.snek) {
      colorCell(this.map, chunk.x, chunk.y, SNEK_COLOR);
    }
  }

  getChunkAt(idx) {
    return this.snek[idx];
  }

  getNewTail() {
    return this.snek[this.snek.length - 2];
  }

  moveChunk() {
    this.tail.x = this.getNewTail().x;
    this.tail.y = this.getNewTail().y;
  }

  moveSnekChunks() {
    for (let i = this.snek.length - 1; i > 0; i--) {
      if (i === 0) continue;
      this.snek[i].x = this.snek[i - 1].x;
      this.snek[i].y = this.snek[i - 1].y;
    }
  }

  moveSnek() {
    this.moveSnekChunks();
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
    this.eatFood();
    this.appendFood();
    this.moveSnek();
    this.checkIsOutOfBounds();
    if (this.stop) {
      clearInterval(this.updateIntervalId);
      console.log("Game over");
    }
  }

  render() {
    this.drawTable();
    this.drawSnek();
    this.drawFood();
  }

  start() {
    this.prepare();
    this.updateIntervalId = setInterval(this.update.bind(this), 200);
    this.renderIntervalId = setInterval(this.render.bind(this), 20);
  }
}

function logSnek(snek, prefix = '') {
  let log = `${prefix}: [`;
  for (const chunk of snek) {
    log += ` {x: ${chunk.x} , y: ${chunk.y}}, `;
  }
  log += ']';
  console.log(log);
}
