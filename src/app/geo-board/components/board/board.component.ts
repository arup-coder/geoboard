import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public bands = [
    {
      color: '#79539d',
      disabled: false,
    },
    {
      color: '#fecf30',
      disabled: true,
    },
    {
      color: '#f59231',
      disabled: true,
    },
    {
      color: '#c4222c',
      disabled: true,
    },
    {
      color: '#65a44a',
      disabled: true,
    },
    {
      color: '#189dc3',
      disabled: true,
    }
  ];

  private numOfPin = 5;
  private pinRadius = 6;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private canvasBg: HTMLCanvasElement;
  private contextBg: CanvasRenderingContext2D;
  private draggable = false;
  private mouseIndex = 1;
  private mouse: IMouse;
  private coordinates: ICoordinate[] = [];
  private pinCoordinates: ICoordinate[] = [];
  private polygonCoordinates: ICoordinate[] = [];
  private cw: number;
  private ch: number;

  ngOnInit() {
    this.init();
    this.initListeners(this.canvas);
  }

  init() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.canvasBg = document.getElementById("canvasbg") as HTMLCanvasElement;
    this.contextBg = this.canvasBg.getContext("2d");

    this.context.lineWidth = 4;
    this.context.strokeStyle = "black";
    this.cw = this.canvas.width;
    this.ch = this.canvas.height;

    this.pinCoordinates = this.drawBoard(this.canvasBg, this.contextBg, this.numOfPin);

    const midPos = Math.floor(this.pinCoordinates.length / 2);

    this.drawBand(this.context,
      this.pinCoordinates[midPos].x - this.pinRadius,
      this.pinCoordinates[midPos].y - this.pinRadius + 1,
      15,
      Math.floor(this.canvas.getBoundingClientRect().height / this.numOfPin) - 2);

    const gutter = this.canvas.getBoundingClientRect().width / (this.numOfPin + 1);
    this.polygonCoordinates.push(
      { x: this.pinCoordinates[midPos].x, y: this.pinCoordinates[midPos].y },
      { x: this.pinCoordinates[midPos].x, y: this.pinCoordinates[midPos].y + gutter }
    );

    console.log(this.polygonCoordinates);
    console.log(this.pinCoordinates);
  }

  initListeners(canvas: HTMLCanvasElement) {

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.handleMouseDown(e);
    });

    canvas.addEventListener("mouseup", () => {
      this.handleMouseUp();
    });

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      this.handleouseMove(e);
    });
  }

  handleMouseDown(e: MouseEvent) {
    this.mouse = this.getMousePos(this.canvas, e);
    const isValidSelection = this.context.isPointInStroke(this.mouse.x, this.mouse.y);
    console.log(isValidSelection);
    if (isValidSelection) {
      this.draggable = true;
      if (!this.polygonCoordinates['contains']({ x: this.mouse.x, y: this.mouse.y })) {
        console.log('true-----');
        this.polygonCoordinates.push({ x: this.mouse.x, y: this.mouse.y });
        console.log(this.polygonCoordinates);
        this.drawPin(this.context, this.polygonCoordinates.length, this.polygonCoordinates, true, 5);
      }
    }
  }

  handleMouseUp() {
    if (this.draggable) {
      this.draggable = false;
      if (this.pinCoordinates['contains'](this.polygonCoordinates[this.polygonCoordinates.length - 1])) {
        this.drawPolygon();
      } else {
        this.polygonCoordinates.splice(this.polygonCoordinates.length - 1, 1);
        if (this.polygonCoordinates.length === 2) {
          const midPos = Math.floor(this.pinCoordinates.length / 2);
          this.drawBand(this.context,
            this.pinCoordinates[midPos].x - this.pinRadius,
            this.pinCoordinates[midPos].y - this.pinRadius + 1,
            15,
            Math.floor(this.canvas.getBoundingClientRect().height / this.numOfPin) - 2);
        } else {
          this.drawPolygon();
        }
      }
    }
  }

  handleouseMove(e: MouseEvent) {
    if (this.draggable) {
      this.mouse = this.getMousePos(this.canvas, e);
      this.polygonCoordinates[this.polygonCoordinates.length - 1].x = this.mouse.x;
      this.polygonCoordinates[this.polygonCoordinates.length - 1].y = this.mouse.y;
      this.drawPolygon();
      this.drawPin(this.context, this.polygonCoordinates.length, this.polygonCoordinates, true, 5);
    }
  }

  drawPolygon() {

    const len = this.polygonCoordinates.length;

    this.context.clearRect(0, 0, this.cw, this.ch);
    this.context.strokeStyle = "#79539d";
    this.context.lineWidth = 7;
    this.context.beginPath();
    this.context.moveTo(this.polygonCoordinates[0].x, this.polygonCoordinates[0].y);

    for (let i = 1; i <= len; i++) {
      if (i == len) {
        this.context.lineTo(this.polygonCoordinates[0].x, this.polygonCoordinates[0].y);
      } else {
        this.context.lineTo(this.polygonCoordinates[i].x, this.polygonCoordinates[i].y);
      }
    }

    this.context.lineJoin = 'round';
    this.context.stroke();
    this.context.closePath();
  }

  drawPin(
    context: CanvasRenderingContext2D,
    numPin: number,
    coordinates: Array<ICoordinate>,
    shadow: boolean = false,
    pinRadius: number = 17) {

    for (let index = 0; index < numPin; index++) {
      context.lineWidth = 3;
      context.fillStyle = "#274b59";
      context.strokeStyle = "white";
      context.beginPath();
      context.arc(coordinates[index].x, coordinates[index].y, pinRadius, 0, 2 * Math.PI);
      context.fill();
      context.stroke();

      if (shadow) {
        context.shadowColor = 'rgba(30, 30, 30, .3)';
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowBlur = 5;
      }
    }
  }

  drawBoard(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    numOfPin: number = 5,
    boardTopx: number = 0,
    boardTopy: number = 0): ICoordinate[] {

    const size = numOfPin + 1;
    const ClientRect = canvas.getBoundingClientRect();
    const squareSize = Math.round(ClientRect.width / size);
    let context = ctx;
    let pinCoordinates: ICoordinate[] = [];
    let i: number;
    let j: number;


    for (i = 0; i < size; i++) {
      let xOffset: number;
      let yOffset: number;
      for (j = 0; j < size; j++) {
        xOffset = boardTopx + j * squareSize;
        yOffset = boardTopy + i * squareSize;
        if (i > 0 && j > 0) {
          pinCoordinates.push({ x: xOffset, y: yOffset });
        }
      }
    }

    this.drawPin(this.contextBg, 1, [{ x: -10, y: -10 }], true);
    this.drawPin(this.contextBg, pinCoordinates.length, pinCoordinates, true);

    return pinCoordinates;
  }

  getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {

    const clientRect = canvas.getBoundingClientRect();

    return {
      x: Math.round(e.clientX - clientRect.left),
      y: Math.round(e.clientY - clientRect.top)
    };
  }

  drawBand(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {

    this.context.clearRect(0, 0, this.cw, this.ch);
    context.beginPath();
    context.strokeStyle = "#79539d";
    context.lineWidth = 7;

    context.moveTo(x, y + h / 8);
    context.lineTo(x, y + h - h / 8);
    context.moveTo(x + w, y + h / 8);
    context.lineTo(x + w, y + h - h / 8);

    context.stroke();
    // context.shadowColor = "black";
    // context.shadowOffsetX = 0;
    // context.shadowBlur = 0;
    context.closePath();
  }

}

interface IMouse {
  x: number;
  y: number;
}

interface ICoordinate {
  x: number;
  y: number;
}

Array.prototype['contains'] = function (item: ICoordinate) {

  let filteredItem = false;

  this.forEach(function (i: ICoordinate) {
    if (((i.x === item.x) || (item.x > i.x && item.x < i.x + 10) || (item.x < i.x && item.x > i.x - 10)) &&
      ((i.y === item.y) || (item.y > i.y && item.y < i.y + 10) || (item.y < i.y && item.y > i.y - 10))) {
      filteredItem = true;
    }
  })

  return filteredItem;
}

