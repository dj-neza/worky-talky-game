import React, { useState, useEffect } from "react";
import styles from "./engine.module.scss";
import { useEvent } from "../../hooks";

const BLOCKS = [
  [140, 100, 280, 120],
  [250, 200, 270, 340],
  [390, 50, 400, 60]
];

const charWidth = 10;
const charHeight = 10;

//const blockWidth = 20;
//const blockHeight = 20;

function CreateEngine(startPosition, setState) {
  this.settings = {
    tile: 1,
  };

  this.game = "start";
  this.posX = startPosition[0];
  this.posY = startPosition[1];
  this.moveX = 0;
  this.moveY = 0;
  this.blocks = BLOCKS;

  const checkBlocks = () => {
    const charX = this.posX + this.moveX;
    const charY = this.posY + this.moveY;

    return this.blocks.some((block) => {
      // check if char hits a block
      return ((charX >= block[0] && charX < block[2]) && (charY >= block[1] && charY < block[3])); 
    });
  };

  // function that will be continuously ran
  this.repaint = () => {
    // check if char has hit a block
    const collision = checkBlocks();
    console.log(collision);
    if (!collision) {
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
  moveX: 10,
  moveY: 10,
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
  
  return (
    <div
      className={styles.container}
    >
      <span
        className={styles.character}
        style={{
          transform: `translate(${gameState.moveX}px, ${gameState.moveY}px)`,
          height: charHeight,
          width: charWidth,
        }}
      />
      {
        gameState.blocks.map(
          block => (
            <span
              className={styles.block}
              key={`${block[0]}_${block[1]}`}
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