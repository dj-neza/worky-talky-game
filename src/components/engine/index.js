import React, { useState, useEffect } from "react";
import styles from "./engine.module.scss";
import { useEvent } from "../../hooks";
import  { Cabinets, Chair1, Chair2, Chill, DeskL, DeskS, Dining, Girl, Guy, Kitchen, Meeting, Plant, Railing, Table1, Table2, Terrace, Tv, Workspace } from "../../assets";
import io from 'socket.io-client'

let socket = io(`http://localhost:3000`);
// NUJNO UPORABI SPODNJO PRED DEPLOYEM NA HEROKU
// let socket = io(`https://serene-temple-32758.herokuapp.com`);

const BLOCKS = [
  // outer walls 
  [0, 0, 5, 400],
  [0, 0, 700, 5],
  [0, 395, 150, 400],
  [190, 395, 700, 400],
  // inner walls
  [695, 0, 700, 180],
  [695, 240, 700, 400],
  [580, 175, 700, 180],
  [525, 0, 530, 140],
  [490, 135, 530, 140],
  [385, 0, 390, 240],
  [250, 135, 430, 140],
  [0, 135, 150, 140],
  [145, 135, 150, 210],
  [145, 340, 150, 400],
  [0, 275, 150, 280],
  [250, 135, 255, 240],
  [250, 235, 320, 240],
  [495, 300, 500, 400],
];

const BACKGROUND = [
  [80, 20, 2, 380, <Chill />],
  [85, 23, 500, 379, <Dining />],
  [65, 30, 530, 0, <Kitchen />],
  [105, 30, 250, 135, <Meeting />],
  [105, 30, 0, 135, <Meeting />],
  [105, 30, 385, 0, <Meeting />],
  [100, 600, 695, 0, <Railing />],
  [73, 30, 700, 370, <Terrace />],
  [80, 30, 310, 3, <Workspace />],
  [15, 38, 500, 80, <Guy fill="green" />],
  [15, 38, 600, 50, <Girl fill="#11696D" />],
  [15, 38, 150, 80, <Guy fill="#B52331" />],
  [15, 38, 450, 100, <Girl fill="#C62CC2" />],
];

const STATIC_OBJECTS = [
  [60, 180, 630, 8, <Cabinets />],
  [30, 30, 100, 355, <Chair1 />],
  [28, 28, 10, 345, <Chair2 />],
  [100, 30, 20, 180, <DeskL />],
  [100, 30, 40, 50, <DeskL />],
  [100, 30, 300, 300, <DeskL />],
  [70, 30, 280, 170, <DeskS />],
  [70, 30, 290, 50, <DeskS />],
  [80, 30, 420, 50, <DeskS />],
  [20, 40, 470, 350, <Plant />],
  [20, 40, 395, 145, <Plant />],
  [70, 50, 610, 320, <Table1 />],
  [70, 60, 520, 220, <Table2 />],
  [100, 30, 10, 280, <Tv />],
];

const charWidth = 15;
const charHeight = 38;

const containerWidth = 800;
const containerHeight = 400;

function CreateEngine(startPosition, setState) {
  this.settings = {
    tile: 1,
  };

  this.game = "start";
  this.posX = startPosition[0];
  this.posY = startPosition[1];
  this.moveX = 170;
  this.moveY = 360;
  this.blocks = BLOCKS;

  const checkBlocks = () => {
    const charX = this.posX + this.moveX;
    const charY = this.posY + this.moveY;

    return this.blocks.some((block) => {
      // check if char hits a block
      return ((charX + charWidth > block[0] && charX < block[2]) && (charY + charHeight > block[1] && charY < block[3])); 
    });
  };

  const checkStatics = () => {
    const charX = this.posX + this.moveX;
    const charY = this.posY + this.moveY;

    return STATIC_OBJECTS.some((block) => {
      // check if char hits a block
      return ((charX + charWidth > block[2] && charX < (block[2] + block[0])) && (charY + charHeight > block[3] && charY < (block[1] + block[3]))); 
    });
  };

  const withinEdges = () => {
    const charX = this.posX + this.moveX;
    const charY = this.posY + this.moveY;

    return (charX + charWidth < containerWidth-10 && charY + charHeight < containerHeight && charX >= 5 && charY >= 5)
  };

  // function that will be continuously ran
  this.repaint = () => {
    // check if char has hit a block
    const collision = checkBlocks();
    const staticCollision = checkStatics();
    const within = withinEdges();
    if (!collision && !staticCollision && within) {
      this.posX += this.moveX;
      this.posY += this.moveY;
    }
    this.moveX = 0;
    this.moveY = 0;

    // set state for use in the component
    setState({
      moveX: this.posX,
      moveY: this.posY,
      blocks: this.blocks,
      //status: this.game,
    });

    // stop the game if the game var has been set to false
    /*if (this.game !== 'start') {
      // reset and stop
      this.game = 'start';
      //this.stage = 0;
      this.jump = false;
      this.direction = 'up';
      this.position = 0;
      return null;
    }*/

    // start repaint on next frame
    return requestAnimationFrame(this.repaint);
  };

  // trigger initial paint
  this.repaint();
  return () => ({
    move: (direction) => {
      switch(direction) {
        case "up": 
          this.moveY = -10;
          break;
        case "right":
          this.moveX = 10;
          break;
        case "down":
          this.moveY = 10;
          break;
        default: 
          this.moveX = -10;
      }
    },
  });
}

const initialState = {
  moveX: 170,
  moveY: 360,
  blocks: BLOCKS,
  // TODO: interaction + status: "start",
};

export default function Engine() {
  // game state
  const [gameState, setGameState] = useState(initialState);
  // is game running
  const [started, setStarted] = useState(false);
  // instance of game engine
  const [engine, setEngine] = useState(null);
  const [player, setPlayer] = useState([]);
  
  const handleKeyPress = (e) => {
    // no game initialised
    if (engine === null) return;
    // otherwise move
    if (e.key === "ArrowLeft") {
      engine.move("left");
    } else if (e.key === "ArrowUp") {
      engine.move("up");
    } else if (e.key === "ArrowRight") {
      engine.move("right");
    } else if (e.key === "ArrowDown") {
      engine.move("down");
    } else if (e.key === " ") {
      // TODO: engine.interact();
    }
  };
  
  useEvent('keydown', handleKeyPress);
  
  useEffect(() => {
    if (!started) {
      // TODO: add a check to connect to the backend first
      // dobiva podatke kje so drugi
      socket.on(`chat message`, data => {
        console.log("drugi player ", data);
        setPlayer(data);
      })
      setStarted(true);
      // create a new engine and save it to the state to use
      setEngine(
        new CreateEngine(
          [initialState.moveX, initialState.moveY],
          newState => setGameState(newState)
        ),
      );
    }

    // TODO: add game states
    /*if (gameState.status === 'fail' && started) {
      setStarted(false);
      alert('You lost! Try again?');
      setGameState(initialState);
      setStart(true);
    }*/
  });

  useEffect(() => {
    socket.emit('send coordinates', [gameState.moveX, gameState.moveY]);
  }, [gameState]);
  
  return (
    <div
      className={styles.container}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
    >
      { STATIC_OBJECTS.map(obj => (
          <div className={styles.absolute} style={{ width: obj[0], height: obj[1], left: obj[2], top: obj[3] }} key={`${obj[0]}_${obj[1]}_${obj[2]}_${obj[3]}`}>
              {obj[4]}
          </div>
        ))}
      { BACKGROUND.map(obj => (
        <div className={styles.absolute} style={{ width: obj[0], height: obj[1], left: obj[2], top: obj[3] }} key={`${obj[0]}_${obj[1]}_${obj[2]}_${obj[3]}`}>
            {obj[4]}
        </div>
      ))}
      <div
        className={styles.character}
        style={{
          transform: `translate(${gameState.moveX}px, ${gameState.moveY}px)`,
          height: charHeight,
          width: charWidth,
        }}
      ><Girl fill="blue" /></div>
      {
        gameState.blocks.map(
          block => (
            <span
              className={styles.block}
              key={`${block[0]}_${block[1]}_${block[2]}_${block[3]}`}
              style={{
                transform: `translate(${block[0]}px, ${block[1]}px)`,
                height: block[3]-block[1],
                width: block[2]-block[0],
              }}
            />
          ),
        )
      }
    </div>
  );
}