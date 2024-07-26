document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');
    const board = Array(9).fill(null);
    const player = 'X';
    const ai = 'O';

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (!board[index]) {
            makeMove(index, player);
            if (!checkWinner(board, player) && !isBoardFull(board)) {
                const aiMove = getBestMove(board);
                makeMove(aiMove, ai);
                checkWinner(board, ai);
            }
        }
    }

    function makeMove(index, symbol) {
        board[index] = symbol;
        cells[index].textContent = symbol;
    }

    function restartGame() {
        board.fill(null);
        cells.forEach(cell => cell.textContent = '');
    }

    function checkWinner(board, symbol) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === symbol && board[b] === symbol && board[c] === symbol) {
                setTimeout(() => alert(`${symbol} wins!`), 100);
                return true;
            }
        }

        if (isBoardFull(board)) {
            setTimeout(() => alert('Draw!'), 100);
            return true;
        }

        return false;
    }

    function isBoardFull(board) {
        return board.every(cell => cell !== null);
    }

    function getBestMove(board) {
        let bestMove;
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = ai;
                let score = minimax(board, 0, false, -Infinity, Infinity);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(board, depth, isMaximizing, alpha, beta) {
        const scores = {
            'O': 10,
            'X': -10,
            'tie': 0
        };

        const winner = checkWinnerMinimax(board);
        if (winner !== null) {
            return scores[winner];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = ai;
                    let score = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = player;
                    let score = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
            return bestScore;
        }
    }

    function checkWinnerMinimax(board) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (isBoardFull(board)) {
            return 'tie';
        }

        return null;
    }
});
