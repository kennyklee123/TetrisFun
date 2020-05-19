let canvas; // reference to the canvas
let ctx; //reference to context
let gBarrayHeight =20; //20 squares going down our canvas
let gBarrayWidth = 12; // 12 square across
let startX = 4; //start drawing here
let startY = 0;  //start drawing here at lvl 0
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));// fill all rows with 0, multi dimensional Array
let curTetromino =  [[1,0], [0,1], [1,1], [2,1]]; // used to make the tetronminos
let tetrominos = [];
let tetrominoColors = ['purple', 'pink', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));
//used to track direction of the tetronmino, used to see  if u hit walls n crap
let DIRECTION =
{
    IDLE: 0, // not moving
    DOWN 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates
{
    constrcutor(x,y)
    {
        this.x =  x;
        this.y  = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);//waiting for our document to be ready for us to start drawing on it, once domcontated is loaded it calls SetupCanvas

function CreateCoordArray() // creates the coordinate array
{
    let xR = 0, yR = 19;
    let i = 0, j = 0;  // x and y position
    //9 pixels from the top of the screen, max pixels 446, uses 23 because thats
    //the height of a block,
    //max pixels left to right is 264 to be drawn on the screen, 23 is width of a block
    for(let y = 9; y<= 446; y += 23)//works down the array
    {
       for(let x = 11; x <= 264; x+= 23)//works from left to right
       {
            coordinateArray[i][j] = new Coordinates(x,y,);
            i++;
       }
       j++;
       i = 0;
    }
}

function SetupCanvas
{
    canvas = document.getElementByID('my-canvas');//name of the id in html
    ctx = canvas.getContext('2d');//context provides functions to draw on the content
    canvas.width = 936; //936pixels
    canvas.height = 956;//956 pixels gBArrayHeight

    ctx.scale(2,2); //scale makes everything in the browser bigger, we are zooming in the size of the elements by 2

    ctx.fillStyle = 'white'; //draw canvas
    ctx.fillRect(0,0, canvas.width, canvas.height);// draws over the canvas width/height, starts at 0,0

    ctx.strokeStyle = 'black';//draw the game board rectangle
    ctx.strokeRect(8,8, 280, 462); //8 px from the left of the canvas and 8 down, 280/462 used from illistrator
    //keyboard presses here

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    // Set font for score label text and draw
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    // Draw score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // Draw score
    ctx.fillText(score.toString(), 310, 127);

    // Draw level label text
    ctx.fillText("LEVEL", 300, 157);

    // Draw level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // Draw level
    ctx.fillText(level.toString(), 310, 190);

    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 221);

    // Draw playing condition
    ctx.fillText(winOrLose, 310, 261);

    // Draw playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);

    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 354);

    // Draw controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);


    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();

}

function DrawTetrisLogo()
{
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino()
{   //2 arrays, one is filled with 0 and 1 in the x y position, 1 means there is a block there(for the tetronmino)
    //second array references the first and draws it using those positons and translates it to pixels
    for(let i = 0, i < curTetromino.length; i++)
    {    //this is the starting x position
        let x = curTetromnio[i][0] + startX;//x is a 0 position
        let y = curTetromnio[i][1] + startY;//y is 1 position
        gameBoardArray[x][y] = 1; //there is a square there
        //use coordinate array to see the x and y values to draw the squares
        let coorX = coordinateArray[x][y].x; //get x coordinate
        let coorY = coordinateArray[x][y].y; //get y coordinate
        ctx.fillStyle = curTetrominoColor; // needs a colour
        ctx.fillRect(coorX, coorY, 21, 21); //each square is 21 by 21 pixels
    }
}
//pass the key pressed

function HandleKeyPress(key)
{
    if(winOrLose != "Game Over")
    {
        if(key.keyCode === 65) //they pressed the a key making it go left
        {
              direction = DIRECTION.LEFT;
              if(!HittingTheWall() && !CheckForHorizontalCollision())
              {
                  DeleteTetromino();
                  startX--;
                  DrawTetromino();
              }
        }
        else if(key.keyCode === 68)//hit the d key goes to the right
        {
              direction = DIRECTION.RIGHT;
              if(!HittingTheWall() && !CheckForHorizontalCollision())
              {
                  DeleteTetromino();
                  startX++;
                  DrawTetromino();
              }
        }
        else if(key.keycode === 83)// hit s key u go down
        {
              MoveTetrominoDown();
        }
        else if(key.keyCode === 69)
        {
            RotateTetromino();
        }
      }
}

function MoveTetrominoDown()
{
    // 4. Track that I want to move down
    direction = DIRECTION.DOWN;

    // 5. Check for a vertical collision
    if(!CheckForVerticalCollison())
    {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

window.setInterval(function()
{
    if(winOrLose != "Game Over")
    {
        MoveTetrominoDown();
    }
  }, 1000);

function DeleteTetromino()
{
    for(let i = 0; i < curTetromino.length; i++)//length is number of squares we are working width
    {
        let x = curTetromino[i][0] = startX; // start x and y is the upper left hand corner of where we gonna draw
        let y = curTetromino[i][0] = startY; // our tetromino squares
        //this part is actually deleting the tetromino
        gameBoardArray[x][y] = 0; // 0 means theres nothing theres, deletes the square
        let coorX = coordinateArray[x][y].x; //.x is getting x
        let coorY = coordinateArray[x][y].y; //.y is getting y Coordinates
        // to delete the tetromino we fill the block with white
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21); // 21 x 21 is the size of the block, and it is erased
    }
}

function CreateTetrominos // we store teh shapes of the tetrominos here, using x and y values where we have filled in squares
{   //T tetromino
  // Push T
  tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
  // Push I
  tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
  // Push J
  tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
  // Push Square
  tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
  // Push L
  tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
  // Push S
  tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
  // Push Z
  tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);

}
function CreateTetromino()
{
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino];
    // Get the color for it
    curTetrominoColor = tetrominoColors[randomTetromino];
}
// Cycle through the squares adding the upper left hand corner
// position to see if the value is <= to 0 or >= 11
// If they are also moving in a direction that would be off  the board stop movement
function HittingTheWall()
{
    for(let i = 0; i < curTetromino.length; i++)
    {
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT)
        {
            return true;
        }
        else if(newX >= 11 && direction === DIRECTION.RIGHT)
        {
            return true;
        }
    }
    return false;
}

function CheckForVerticalCollison()
{
    // Make a copy of the tetromino so that I can move a use it to see if it hits something, so we dont have to sue the real one
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;
    // Cycle through all Tetromino squares
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Get each square of the Tetromino and change the position so I can check for collisions
        let square = tetrominoCopy[i];
        // Move into position based on the changing upper left
        // hand corner of the entire Tetromino shape
        let x = square[0] + startX;
        let y = square[1] + startY;
        // If I'm moving down increment y to check for a collison
        if(direction === DIRECTION.DOWN)
        {
            y++;
        }
        // Check if I'm going to hit a previously set piece
        // if(gameBoardArray[x][y+1] === 1){
        if(typeof stoppedShapeArray[x][y+1] === 'string')
        {
            // console.log("COLLISON x : " + x + " y : " + y);
            // If so delete Tetromino
            DeleteTetromino();
            // Increment to put into place and draw
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20)
        {
            collision = true;
            break;
        }
    }
    if(collision)
    {
        // Check for game over and if so set game over text
        if(startY <= 2)
        {
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        }
        else
        {
            // Add stopped Tetromino to stopped shape array
            // so I can check for future collisions
            for(let i = 0; i < tetrominoCopy.length; i++)
            {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            // 7. Check for completed rows
            CheckForCompletedRows();
            CreateTetromino();
            // Create the next Tetromino and draw it and reset direction
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}
function CheckForHorizontalCollision()
{
    // Copy the Teromino so I can manipulate its x value
    // and check if its new value would collide with
    // a stopped Tetromino
    var tetrominoCopy = curTetromino;
    var collision = false;

    // Cycle through all Tetromino squares
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        // Get the square and move it into position using
        // the upper left hand coordinates
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        // Move Tetromino clone square into position based
        // on direction moving
        if (direction == DIRECTION.LEFT)
        {
            x--;
        }
        else if (direction == DIRECTION.RIGHT)
        {
            x++;
        }
        // Get the potential stopped square that may exist
        var stoppedShapeVal = stoppedShapeArray[x][y];
        // If it is a string we know a stopped square is there
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}
function CheckForCompletedRows()
{
    // 8. Track how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    // Check every row to see if it has been completed
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array
            let square = stoppedShapeArray[x][y];
            // Check if nothing is there
            if (square === 0 || (typeof square === 'undefined'))
            {
                // If there is nothing there once then jump out
                // because the row isn't completed
                completed=false;
                break;
            }
        }
        // If a row has been completed
        if (completed)
        {
            // 8. Used to shift down the rows
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            // Delete the line everywhere
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous squares
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the square as white
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}
// 8. Move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion)
{
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = square; // Draw color into stopped
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);
                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in Game board array
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}
// 9. Rotate the Tetromino
function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino, we clone the array, otherwise it would create a reference to the array that had the error
        curTetrominoBU = [...curTetromino];
        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
    // Try to draw the new Tetromino rotation
    try
    {
        curTetromino = newRotation;
        DrawTetromino();
    }
    catch (e)// if there is an error to get backup teromino, draw it instead
    {
        if(e instanceof TypeError)
         {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

// Gets the x value for the last square in the Tetromino
// so we can orientate all other squares using that as
// a boundary. This simulates rotating the Tetromino
function GetLastSquareX()
{
    let lastX = 0;
    for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}
