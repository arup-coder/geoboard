import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

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

    this.context.lineWidth = 2;
    this.context.strokeStyle = "black";
    this.cw = this.canvas.width;
    this.ch = this.canvas.height;

    this.pinCoordinates = this.drawBoard(this.canvasBg, this.contextBg, this.numOfPin);

    const midPos = Math.floor(this.pinCoordinates.length / 2);
    
    this.drawBand(this.context,
      this.pinCoordinates[midPos].x - this.pinRadius - 1,
      this.pinCoordinates[midPos].y - this.pinRadius,
      14,
      this.canvas.getBoundingClientRect().height/this.numOfPin);
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
    this.draggable = true;
    this.mouse = this.getMousePos(this.canvas, e);

    if (this.coordinates.length > 10) {
      for (let index = 0; index < this.coordinates.length; index++) {
        this.context.beginPath();
        this.context.arc(this.coordinates[index].x, this.coordinates[index].y, 5, 0, 2 * Math.PI);
        if (this.context.isPointInPath(this.mouse.x, this.mouse.y)) {
          this.mouseIndex = index + 1;
          break;
        }
      }
    } else {
      this.coordinates.push({ x: this.mouse.x, y: this.mouse.y });
      this.drawPolygon();
      this.drawPin(this.context, this.coordinates.length, this.coordinates);
    }
  }

  handleMouseUp() {
    if (this.draggable) {
      this.draggable = false;
    }
  }

  handleouseMove(e: MouseEvent) {
    if (this.draggable) {
      this.mouse = this.getMousePos(this.canvas, e);
      this.coordinates[this.mouseIndex - 1].x = this.mouse.x;
      this.coordinates[this.mouseIndex - 1].y = this.mouse.y;
      this.drawPolygon();
      this.drawPin(this.context, this.coordinates.length, this.coordinates);
    }
  }

  drawPolygon() {
    const len = this.coordinates.length;

    this.context.clearRect(0, 0, this.cw, this.ch);
    this.context.strokeStyle = "orange";
    this.context.beginPath();
    this.context.moveTo(this.coordinates[0].x, this.coordinates[0].y);

    for (let index = 1; index < len; index++) {
      this.context.lineTo(this.coordinates[index].x, this.coordinates[index].y);
    }
    this.context.stroke();
    this.context.closePath();
  }

  drawPin(context: CanvasRenderingContext2D, 
    numPin: number, 
    coordinates: Array<ICoordinate>, 
    shadow: boolean = false,
    pinRadius:number = 6) {
    for (let index = 0; index < numPin; index++) {
      context.strokeStyle = "white";
      context.beginPath();
      context.arc(coordinates[index].x, coordinates[index].y, pinRadius, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
      if (shadow) {
        context.shadowColor = "black";
        context.shadowOffsetX = 1;
        context.shadowBlur = 7;
      }

    }
  }

  drawBoard(canvas: HTMLCanvasElement,
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
    this.drawPin(this.contextBg, 1, [{x: -10, y: -10}], true);
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
    let i: number, xPos: number, yPos: number, pi = Math.PI, twoPi = 2 * pi;

    context.beginPath();
    context.strokeStyle = "orange";

    for (i = 0; i < twoPi; i += 0.001) {
      xPos = (x + w / 2) - (w / 2 * Math.cos(i));
      yPos = (y + h / 8) + (h / 8 * Math.sin(i));
    }

    context.moveTo(x, y + h / 8);
    context.lineTo(x, y + h - h / 8);

    for (i = 0; i < pi; i += 0.001) {
      xPos = (x + w / 2) - (w / 2 * Math.cos(i));
      yPos = (y + h - h / 8) + (h / 8 * Math.sin(i));

      if (i === 0) {
        context.moveTo(xPos, yPos);
      } else {
        context.lineTo(xPos, yPos);
      }
    }
    context.moveTo(x + w, y + h / 8);
    context.lineTo(x + w, y + h - h / 8);

    context.stroke();
    context.closePath();
    context.shadowColor = "black";
    context.shadowOffsetX = 2;
    context.shadowBlur = 2;
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
