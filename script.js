document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameOfLifeCanvas');
    const ctx = canvas.getContext('2d');

    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');

    const resolution = 10;
    let cols;
    let rows;
    let grid;
    let nextGrid;
    let animationId;
    let isRunning = false;

    function setup() {
        // Make it mobile friendly
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        canvas.width = size;
        canvas.height = size;

        cols = Math.floor(canvas.width / resolution);
        rows = Math.floor(canvas.height / resolution);

        grid = buildGrid();
        nextGrid = buildGrid();
        randomizeGrid(grid);
        drawGrid(grid);
    }

    function buildGrid() {
        return new Array(cols).fill(null)
            .map(() => new Array(rows).fill(0));
    }

    function randomizeGrid(grid) {
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                grid[col][row] = Math.floor(Math.random() * 2);
            }
        }
    }

    function drawGrid(grid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                if (grid[col][row]) {
                    ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
                }
            }
        }
    }

    function computeNextGeneration() {
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const neighbors = countNeighbors(grid, col, row);
                const cell = grid[col][row];
                if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[col][row] = 0;
                } else if (cell === 0 && neighbors === 3) {
                    nextGrid[col][row] = 1;
                } else {
                    nextGrid[col][row] = cell;
                }
            }
        }
    }

    function countNeighbors(grid, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                const col = (x + i + cols) % cols;
                const row = (y + j + rows) % rows;
                sum += grid[col][row];
            }
        }
        return sum;
    }

    function gameLoop() {
        if (!isRunning) {
            return;
        }
        computeNextGeneration();

        // Swap grids
        const temp = grid;
        grid = nextGrid;
        nextGrid = temp;

        drawGrid(grid);
        animationId = requestAnimationFrame(gameLoop);
    }

    startButton.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            gameLoop();
        }
    });

    pauseButton.addEventListener('click', () => {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });

    resetButton.addEventListener('click', () => {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        randomizeGrid(grid);
        drawGrid(grid);
    });

    window.addEventListener('resize', setup);

    // Initial setup
    setup();
});
