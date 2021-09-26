import "./App.css";
import React, { Component } from "react";
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { square: squares[a], line: lines[i] };
    }
  }
  return null;
}
function Square(props) {
  let className = "";
  if (props.isWinSquare) className = " square-winner";
  return (
    <button className={"square" + className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    let isWinSquare = false;
    if (this.props.win && this.props.win.includes(i)) isWinSquare = true;

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinSquare={isWinSquare}
      />
    );
  }
  renderSquares() {
    const size = 3;
    let squares = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(this.renderSquare(i * size + j));
      }
      squares.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return squares;
  }

  render() {
    return <div>{this.renderSquares()}</div>;
  }
}
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastIndex: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastIndex: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleSort() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? "selected-item" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (!this.state.ascending) moves = moves.reverse();

    let status;
    if (winner) {
      status = "Winner: " + winner.square;
    } else {
      if (this.state.stepNumber === 9) status = "Draw";
      else status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const getPosition = () => {
      const index = current.lastIndex;
      if (index !== null)
        return `Position (col,row)=(${1 + (index % 3)}, ${
          1 + Math.floor(index / 3)
        })`;
      return `Game start`;
    };
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            win={winner !== null ? winner.line : null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{getPosition()}</div>
          <button onClick={() => this.handleSort()}>
            {this.state.ascending === true
              ? "Desceding order"
              : "Ascending order"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
