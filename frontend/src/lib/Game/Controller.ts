import type { Direction } from "../Types";
import type GameTicker from "./Ticker";
import type GameStateMachine from "./StateMachine";
import { LOCAL_MULTIPL_MODE_ID } from "./Modes";
import { PausedReason } from "./StateMachine";

class GameController {
	private _gameState: GameStateMachine;
	private _keysPressed: { [key: string]: boolean } = {};

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, tickRate: number = 60) {
		this._gameState = gameState;

		// run controller update every tick
		gameTicker.add(this._update);
	}

	/**
	 * Move the paddle of player 1
	 */
	private _movePaddleP1 = () => {
		const maxSpeed = this._gameState.player1.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["w"] && !this._keysPressed["s"])
			dy = -maxSpeed;
		if (this._keysPressed["s"] && !this._keysPressed["w"])
			dy = maxSpeed;
		this._gameState.player1.paddle.setMoveDirection(dy);
	}

	/**
	 * Move the paddle of player 2 - this is only used in local multiplayer mode
	 */
	private _movePaddleP2 = () => {
		const maxSpeed = this._gameState.player2.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["ArrowUp"] && !this._keysPressed["ArrowDown"])
			dy = -maxSpeed;
		if (this._keysPressed["ArrowDown"] && !this._keysPressed["ArrowUp"])
			dy = maxSpeed;
		this._gameState.player2.paddle.setMoveDirection(dy);
	}

	/**
	 * Ticker function - this function is run every game tick.
	 * @param tps: The current ticks per second
	 * @param deltaTick The time since the last tick in milliseconds.
	 */
	public _update = (tps: number, deltaTick: number) => {
		if (this._gameState.isPaused())
			return;

		// In all game modes
		this._movePaddleP1();

		// Only in local multiplayer mode
		if (this._gameState.getGameMode() == LOCAL_MULTIPL_MODE_ID)
			this._movePaddleP2();
	};

	//= Public =//

	/**
	 * Run this function when a key is pressed using the onkeydown event.
	 * @param key The key that was pressed (event.key)
	 */
	public setKeyPressed = (key: string) => {
		this._keysPressed[key] = true;
	};

	/**
	 * Run this function when a key is no longer being pressed using the onkeyup event.
	 * @param key The key that was released (event.key)
	 */
	public setKeyNotPressed = (key: string) => {
		if (key in this._keysPressed)
			delete this._keysPressed[key];
	};

	/**
	 * Run this function when the player is ready to start playing.
	 */
	public amReady = () => {
		this._gameState.startGame();
	}

	/**
	 * Pause the game from the current player's perspective.
	*/
	public pause = () => {
		this._gameState.pauseGame(PausedReason.PAUSED_BY_PLAYER);
	}

	/**
	 * Resume the game from the current player's perspective.
	 */
	public resume = () => {
		this._gameState.unPauseGame();
	}

	/**
	 * Toggle the paused state of the game from the current player's perspective.
	 */
	public togglePause = () => {
		if (this._gameState.isPaused())
			this.resume();
		else
			this.pause();
	}
}

export default GameController;
