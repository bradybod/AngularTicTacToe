import {Component, Input, OnInit} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CellComponent} from '../cell/cell.component';

@Component({
  selector: 'app-game-board',
  template: `
    <div class="mainPage">
    <h1 class="mat-display-2" >Current Player: {{CurrentPlayer}}</h1>
    <button mat-raised-button color="primary" (click)="CreateGame(); myCheckbox.checked=false">Create new Game</button>
    <mat-checkbox color="primary" #myCheckbox (change)="PlayComputer($event)">Play Computer</mat-checkbox>
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
export class GameBoardComponent implements OnInit
{
  cells: any[];
  currentPlayer: boolean;
  winner: boolean;
  tie: boolean;
  playComputer: boolean;
  constructor() { }

  ngOnInit(): void
  {
    this.CreateGame();
  }

  CreateGame(): void
  {
    this.cells = Array(9).fill(null);
    this.winner = null;
    this.tie = null;
    this.currentPlayer = true;
    this.playComputer = false;
  }

  get CurrentPlayer(): string
  {
    return this.currentPlayer ? 'X' : 'O';
  }

  CellClicked(index: number): void
  {
    if (!this.cells[index] && !this.winner)
    {
      this.cells.splice(index, 1, this.CurrentPlayer);
      this.currentPlayer = !this.currentPlayer;
    }
    this.CheckForWinOrTie();
    if (this.playComputer && !this.currentPlayer && !this.winner && !this.tie)
    {
      this.ComputersTurn();
    }
  }

  private ComputersTurn(): void
  {
    const bestMove = this.GetBestMove();
    this.CellClicked(bestMove);
  }


  private MiniMax(depth: number, tmpBoard: any[], isMax: boolean, alpha: number, beta: number): number
  {
    const score = this.EvaluateBoard(tmpBoard)[0];
    if (score === 10 || score === -10)
    {
      return score;
    }

    function MovesLeft(): boolean
    {
      for (const cell of tmpBoard)
      {
        if (cell === null)
        {
          return true;
        }
      }
      return false;
    }

    if (!MovesLeft())
    {
      return 0;
    }
    if (isMax)
    {
      let best = -1000;
      for (let i = 0; i < 9; i++)
      {
        if (tmpBoard[i] === null)
        {
          tmpBoard.splice(i, 1, '0');
          best = Math.max( best, this.MiniMax(depth + 1, tmpBoard, !isMax, alpha, beta));
          alpha = Math.max(alpha, best);
          tmpBoard.splice(i, 1, null);
          if (beta <= alpha){
            break;
          }
        }
      }
      return best;
    }else
    {
      let best = 1000;
      for (let i = 0; i < 9; i++)
      {
        if (tmpBoard[i] === null)
        {
          tmpBoard.splice(i, 1, 'X');
          best = Math.min( best, this.MiniMax(depth + 1, tmpBoard,  !isMax, alpha, beta));
          beta = Math.min(beta, best);
          tmpBoard.splice(i, 1, null);
          if (beta <= alpha){
            break;
          }
        }
      }
      return best;
    }
  }

  private EvaluateBoard(tmpBoard: any[]): (number | any)[] {
    for (let i = 0; i < 3; i++) {
      // Check Columns
      if (tmpBoard[i] === tmpBoard[i + 3]
        && tmpBoard[i] === tmpBoard[i + 6]
        && tmpBoard[i] !== null) {
        if (tmpBoard[i] === this.CurrentPlayer) {
          return [10, tmpBoard[i]];
        } else {
          return [-10, tmpBoard[i]];
        }
      }
      // Check Rows
      if (tmpBoard[i * 3] === tmpBoard[i * 3 + 1]
        && tmpBoard[i * 3] === tmpBoard[i * 3 + 2]
        && tmpBoard[i * 3] !== null) {
        if (tmpBoard[i * 3] === this.CurrentPlayer) {
          return [10, tmpBoard[i * 3]];
        } else {
          return [-10, tmpBoard[i * 3]];
        }
      }
    }
    // Check Diag
    if (tmpBoard[4] !== null
      && ((tmpBoard[0] === tmpBoard[4]
        && tmpBoard[0] === tmpBoard[8])
        || (tmpBoard[2] === tmpBoard[4]
          && tmpBoard[2] === tmpBoard[6]))) {
      if (tmpBoard[4] === this.CurrentPlayer) {
        return [10, tmpBoard[4]];
      } else {
        return [-10, tmpBoard[4]];
      }
    }
    return [0, null];
  }

  private PlayerWinsNextMove(tmpBoard: any[]): number
  {
    for (let i = 0; i < 9; i++) {
      if (tmpBoard[i] === null) {
        tmpBoard.splice(i, 1, 'O');
        if (this.EvaluateBoard(tmpBoard)[0] === 10) {
          return i;
        }
        tmpBoard.splice(i, 1, null);
      }
    }
    for (let i = 0; i < 9; i++)
    {
      if (tmpBoard[i] === null){
        tmpBoard.splice(i, 1, 'X');
        if (this.EvaluateBoard(tmpBoard)[0] === -10) {
          return i;
        }
        tmpBoard.splice(i, 1, null);
      }
    }
    return -1;
  }

  private GetBestMove(): number
  {
    const tmpBoard = [...this.cells];
    const nextTurn = this.PlayerWinsNextMove(tmpBoard);
    if (nextTurn !== -1)
    {
      return nextTurn;
    }
    let bestValue = -1000;
    let bestCell = -1;
    for (let i = 0; i < 9; i++)
    {
      if (tmpBoard[i] === null)
      {
        tmpBoard.splice(i, 1, this.CurrentPlayer);
        const moveCost = this.MiniMax(0, tmpBoard,  true, -1000, 1000);
        tmpBoard.splice(i, 1, null);
        if (moveCost > bestValue)
        {
          bestCell = i;
          bestValue = moveCost;
        }
      }
    }
    return bestCell;
  }

  private CheckForWinOrTie(): void
  {
    this.CheckForWin();
    this.CheckForTie();
  }

  private CheckForWin(): void
  {
    const gameOver = this.EvaluateBoard(this.cells)[1];
    if (gameOver !== null)
    {
      this.winner = gameOver;
    }
  }

  private CheckForTie(): void
  {
    if (this.winner)
    {
      return;
    }
    let count = 0;
    for (const cell of this.cells)
    {
      if (cell != null)
      {
        count++;
      }
    }
    this.tie = count === 9;
  }

  PlayComputer(event: MatCheckboxChange): void
  {
    this.playComputer = event.checked;
  }
}
