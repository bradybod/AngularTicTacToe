import { Component, OnInit } from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CellComponent} from '../cell/cell.component';

@Component({
  selector: 'app-game-board',
  template: `
    <div>
    <h1 class="mat-display-2" >Current Player: {{CurrentPlayer}}</h1>
    <button mat-raised-button color="primary" (click)="CreateGame()">Create new Game</button>
    <mat-checkbox color="primary" (change)="PlayComputer($event)">Play Computer</mat-checkbox>
    <h2 class="mat-display-2" *ngIf="winner">
      {{winner}} won!
    </h2>
    <h2 class="mat-display-2" *ngIf="tie">
      Tie Game!
    </h2>
    <main>
      <app-cell *ngFor="let cellValue of cells; let i = index;"
                [value]="cellValue"
                (click)="CellClicked(i)">
      </app-cell>
    </main>
    </div>
  `,
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  cells: any[];
  currentPlayer: boolean;
  winner: boolean;
  tie: boolean;
  playComputer: boolean;
  constructor() { }

  ngOnInit(): void{
    this.CreateGame();
  }

  CreateGame(): void{
    this.cells = Array(9).fill(null);
    this.winner = null;
    this.tie = null;
    this.currentPlayer = true;
    this.playComputer = false;
  }

  get CurrentPlayer(): string{
    return this.currentPlayer ? 'X' : 'O';
  }

  CellClicked(index: number): void{
    if (!this.cells[index] && !this.winner){
      this.cells.splice(index, 1, this.CurrentPlayer);
      this.currentPlayer = !this.currentPlayer;
    }
    this.CheckForWinOrTie();
    if (this.playComputer && !this.currentPlayer && !this.winner && !this.tie){
      this.ComputersTurn();
    }
  }

  private ComputersTurn(): void {
    console.log('my Turn');
    const bestMove = this.GetBestMove();
    this.CellClicked(bestMove);
  }


  private MiniMax(tmpBoard: any[], depth: number, isMax: boolean): number {
    const score = this.EvaluateBoard(tmpBoard);
    if (score === 10 || score === -10){
      return score;
    }

    function MovesLeft(): boolean {
      let count = 0;
      for (const cell of tmpBoard){
        if (cell === null){
          count ++;
        }
      }
      return count > 0;
    }

    if (!MovesLeft()){
      return 0;
    }
    if (isMax){
      let best = -1000;
      for (let i = 0; i < 9; i++){
        if (tmpBoard[i] === null){
          tmpBoard[i] = this.currentPlayer;
          best = Math.max( best, this.MiniMax(tmpBoard, depth + 1, !isMax));
          tmpBoard[i] = null;
        }
      }
      return best;
    }else{
      let best = 1000;
      for (let i = 0; i < 9; i++){
        if (tmpBoard[i] === null){
          tmpBoard[i] = !this.currentPlayer;
          best = Math.min( best, this.MiniMax(tmpBoard, depth + 1, !isMax));
          tmpBoard[i] = null;
        }
      }
      return best;
    }
  }

  private EvaluateBoard(tmpBoard: any[]): number {
    for (let i = 0; i < 3; i++){
      // Check Columns
      if ( tmpBoard[i] === tmpBoard[i + 3]
        && tmpBoard[i] === tmpBoard[i + 6]
        && tmpBoard[i] != null){
        if (tmpBoard[i] === this.currentPlayer){
          return 10;
        }else{
          return -10;
        }
      }
      // Check Rows
      if (tmpBoard[i * 3] === tmpBoard[i * 3 + 1]
        && tmpBoard[i * 3] === tmpBoard[i * 3 + 2]
        && tmpBoard[i * 3] != null){
        if (tmpBoard[i * 3] === this.currentPlayer){
          return 10;
        }else{
          return -10;
        }
      }
    }
    // Check Diag
    if (this.cells[4] != null
      && (this.cells[0] === this.cells[4]
        && this.cells[0] === this.cells[8])
      || (this.cells[2] === this.cells[4]
        && this.cells[2] === this.cells[6])){
      if (tmpBoard[4] === this.currentPlayer){
        return 10;
      }else{
        return -10;
      }
    }
    return 0;
  }

  private GetBestMove(): number {
    const tmpBoard = this.cells;
    let bestValue = -1000;
    let bestCell = -1;
    for (let i = 0; i < 9; i++){
      if (tmpBoard[i] == null){
        tmpBoard [i] = this.currentPlayer;
        const moveCost = this.MiniMax(tmpBoard, 0, false);
        tmpBoard[i] = null;

        if (moveCost > bestValue){
          bestCell = i;
          bestValue = moveCost;
        }
      }
    }
    return bestCell;
  }

  private CheckForWinOrTie(): void{
    this.CheckForWin();
    this.CheckForTie();
  }

  private CheckForWin(): void{
    for (let i = 0; i < 3; i++){
      // Check Columns
      if ( this.cells[i] === this.cells[i + 3]
        && this.cells[i] === this.cells[i + 6]
        && this.cells[i] != null){
        this.winner = this.cells[i];
      }
      // Check Rows
      if (this.cells[i * 3] === this.cells[i * 3 + 1]
        && this.cells[i * 3] === this.cells[i * 3 + 2]
        && this.cells[i * 3] != null){
        this.winner = this.cells[i * 3];
      }
    }
    // Check Diag
    if (this.cells[4] != null
      && (this.cells[0] === this.cells[4]
      && this.cells[0] === this.cells[8])
      || (this.cells[2] === this.cells[4]
      && this.cells[2] === this.cells[6])){
      this.winner = this.cells[4];
    }
  }

  private CheckForTie(): void{
    if (this.winner){
      return;
    }
    let count = 0;
    for (const cell of this.cells){
      if (cell != null) {
        count++;
      }
    }
    this.tie = count === 9;
  }

  PlayComputer(event: MatCheckboxChange): void {
    this.playComputer = event.checked;
  }
}
