var jet = document.getElementById("jet");
var board = document.getElementById("board");

window.addEventListener("keydown", (e) => {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (e.key == "ArrowLeft" && left > 0) {
    jet.style.left = left - 10 + "px";
  }
  //460  =>  board width - jet width
  else if (e.key == "ArrowRight" && left <= 460) {
    jet.style.left = left + 10 + "px";
  }

  if (e.key == "ArrowUp" || e.keyCode == 32) {
    //32 is for space key
    var bullet = document.createElement("div");
    bullet.classList.add("bullets");
    board.appendChild(bullet);

    var movebullet = setInterval(() => {
      var rocks = document.getElementsByClassName("rocks");

      for (var i = 0; i < rocks.length; i++) {
        var rock = rocks[i];
        if (rock != undefined) {
          var rockbound = rock.getBoundingClientRect();
          var bulletbound = bullet.getBoundingClientRect();

          //Condition to check whether the rock/alien and the bullet are at the same position..!
          //If so,then we have to destroy that rock

          if (
            bulletbound.left >= rockbound.left &&
            bulletbound.right <= rockbound.right &&
            bulletbound.top <= rockbound.top &&
            bulletbound.bottom <= rockbound.bottom
          ) {
            rock.parentElement.removeChild(rock); //Just removing that particular rock;
            //Scoreboard
            document.getElementById("points").innerHTML =
              parseInt(document.getElementById("points").innerHTML) + 1;
          }
        }
      }
      var bulletbottom = parseInt(
        window.getComputedStyle(bullet).getPropertyValue("bottom")
      );

      //Stops the bullet from moving outside the gamebox
      if (bulletbottom >= 500) {
        clearInterval(movebullet);
      }

      bullet.style.left = left + "px"; //bullet should always be placed at the top of my jet..!
      bullet.style.bottom = bulletbottom + 3 + "px";
    });
  }
});

var generaterocks = setInterval(() => {
  var rock = document.createElement("div");
  rock.classList.add("rocks");
  //Just getting the left of the rock to place it in random position...
  var rockleft = parseInt(
    window.getComputedStyle(rock).getPropertyValue("left")
  );
  //generate value between 0 to 450 where 450 => board width - rock width
  rock.style.left = Math.floor(Math.random() * 450) + "px";

  board.appendChild(rock);
}, 1000);

var moverocks = setInterval(() => {
  var rocks = document.getElementsByClassName("rocks");

  if (rocks != undefined) {
    for (var i = 0; i < rocks.length; i++) {
      //Now I have to increase the top of each rock,so that the rocks can move downwards..
      var rock = rocks[i]; //getting each rock
      var rocktop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );
      //475 => boardheight - rockheight + 25
      if (rocktop >= 475) {
        const gameOverMessage = document.createElement("div");
        gameOverMessage.id = "game-over";
        gameOverMessage.innerHTML = `
          <p>Game Over!</p>
          <button id="replay-button">Replay</button>
        `;
        gameOverMessage.style.position = "absolute";
        gameOverMessage.style.top = "50%";
        gameOverMessage.style.left = "50%";
        gameOverMessage.style.transform = "translate(-50%, -50%)";
        gameOverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        gameOverMessage.style.color = "white";
        gameOverMessage.style.padding = "20px";
        gameOverMessage.style.borderRadius = "10px";
        gameOverMessage.style.textAlign = "center";
        gameOverMessage.style.zIndex = "1000";
        document.body.appendChild(gameOverMessage);

        clearInterval(moverocks);
        clearInterval(generaterocks);

        const replayButton = document.getElementById("replay-button");
        replayButton.addEventListener("click", () => {
          location.reload(); // Reload the page to restart the game
        });
      }

      rock.style.top = rocktop + 25 + "px";
    }
  }
}, 450);
document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("play-button");
  const board = document.getElementById("board");
  const points = document.getElementById("points");

  playButton.addEventListener("click", () => {
    playButton.style.display = "none"; // Cache le bouton Play
    board.style.display = "block"; // Affiche le plateau de jeu
    points.style.display = "block"; // Affiche les points
  });

  // Increase movement speed for left and right arrow keys
  window.addEventListener("keydown", (e) => {
    var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
    if (e.key == "ArrowLeft" && left > 0) {
      jet.style.left = left - 20 + "px"; // Move faster to the left
    } else if (e.key == "ArrowRight" && left <= 460) {
      jet.style.left = left + 20 + "px"; // Move faster to the right
    }
  });
});