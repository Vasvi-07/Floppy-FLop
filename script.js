let move_speed = 4, grativy = 0.45;
let character = document.querySelector('.character');
let img = document.getElementById('character-2');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting bird element properties
let character_props = character.getBoundingClientRect();

// This method returns DOMRect -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// --- Updated popup content with horizontal, smaller, centered layout ---
message.innerHTML = `
  <div style="
    width: 60vw;
    max-width: 90vw;
    padding: 20px 30px;
    background: rgba(0,0,0,0.7);
    color: yellow;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: Arial, sans-serif;
    font-size: 14px;
  ">
    <h1 style="color: red; font-size: 30px; margin: 0 10px 0 0; ">FLAPPY FLOP WITH SHINCHAN</h1> <br>

    <h3 style="margin: 0 10px 0 0;">Use Spacebar to control</h3> <br>

    <p style="margin: 0 10px 0 0; ">Collect points</p> <br>

    <label for="capsicum-answer" style="font-weight: bold; margin: 0 10px 0 0;">
      Does Shinchan like Capsicum? (Yes/no)
    </label>
    <input type="text" id="Capsicum-answer" style="padding: 5px; width: 80px; font-size: 14px;" autofocus />
    <button id="start-btn" style="padding: 5px 10px; font-size: 14px;">Start Game</button>
    <p id="answer-feedback" style="color: red; margin: 0 0 0 10px; font-size: 13px;"></p>
  </div>
`;

// Add event listener to start button
document.getElementById('start-btn').addEventListener('click', () => {
  let answerInput = document.getElementById('capsicum-answer');
  let feedback = document.getElementById('answer-feedback');
  let answer = answerInput.value.trim().toLowerCase();

  if(answer === 'yes' || answer === 'no'){
    // Clear feedback and start game
    feedback.textContent = '';
    document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
    document.querySelectorAll('.coin_sprite').forEach(e => e.remove());
    document.querySelectorAll('.capsicum_sprite').forEach(e => e.remove());
    img.style.display = 'block';
    character.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  } else {
    feedback.textContent = 'Please type "yes" or "no"';
  }
});

document.addEventListener('keydown', (e) => {
  if(e.key == 'Enter' && game_state != 'Play'){
    // Optional: allow enter to start only if valid input
    let answerInput = document.getElementById('capsicum-answer');
    let feedback = document.getElementById('answer-feedback');
    if(answerInput){
      let answer = answerInput.value.trim().toLowerCase();
      if(answer === 'yes' || answer === 'no'){
        feedback.textContent = '';
        document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
        document.querySelectorAll('.coin_sprite').forEach(e => e.remove());
        document.querySelectorAll('.capsicum_sprite').forEach(e => e.remove());
        img.style.display = 'block';
        character.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
      } else {
        feedback.textContent = 'Please type "yes" or "no"';
      }
    } else {
      // fallback if no input present
      document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
      document.querySelectorAll('.coin_sprite').forEach(e => e.remove());
      document.querySelectorAll('.capsicum_sprite').forEach(e => e.remove());
      img.style.display = 'block';
      character.style.top = '40vh';
      game_state = 'Play';
      message.innerHTML = '';
      score_title.innerHTML = 'Score : ';
      score_val.innerHTML = '0';
      message.classList.remove('messageStyle');
      play();
    }
  }
});

function gameOver() {
  game_state = 'End';

  message.innerHTML = `
    <div class="game-over-box">
      <div class="game-over-title">GAME OVER</div>
      <img src="images/shinchan.gif" alt="Shinchan" class="game-over-gif">
      <div class="game-over-restart">Press Enter To Restart</div>
    </div>
  `;

  message.classList.add('messageStyle');
  img.style.display = 'none';
  sound_die.play();
}


function play() {
  function move() {
    if(game_state != 'Play') return;

    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach(element => {
      let pipe_sprite_props = element.getBoundingClientRect();
      character_props = character.getBoundingClientRect();

      if(pipe_sprite_props.right <= 0){
        element.remove();
      }else{
        // Collision detection pipe vs character
        if(character_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          character_props.left + character_props.width > pipe_sprite_props.left &&
          character_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          character_props.top + character_props.height > pipe_sprite_props.top){
          gameOver();
          return;
        }else{
          if(pipe_sprite_props.right < character_props.left &&
             pipe_sprite_props.right + move_speed >= character_props.left &&
             element.increase_score == '1'){
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });

    // Move and check coin collision
    let coin_sprite = document.querySelectorAll('.coin_sprite');
    coin_sprite.forEach(coin => {
      let coin_props = coin.getBoundingClientRect();

      if(coin_props.right <= 0){
        coin.remove();
      } else {
        coin.style.left = coin_props.left - move_speed + 'px';

        // Collision with player
        if(game_state === 'Play' && !coin.collected &&
          character_props.left < coin_props.left + coin_props.width &&
          character_props.left + character_props.width > coin_props.left &&
          character_props.top < coin_props.top + coin_props.height &&
          character_props.top + character_props.height > coin_props.top){

          // Coin collected
          coin.collected = true;
          coin.remove();
          score_val.innerHTML = +score_val.innerHTML + 5; // coin gives +5 points
          sound_point.play();
        }
      }
    });

    // Move and check capsicum collision (slower speed now)
    let capsicum_sprite = document.querySelectorAll('.capsicum_sprite');
    capsicum_sprite.forEach(capsicum => {
      let capsicum_props = capsicum.getBoundingClientRect();

      if(capsicum_props.right <= 0){
        capsicum.remove();
      } else {
        capsicum.style.left = capsicum_props.left - (move_speed / 2) + 'px';  // slower speed here

        // Collision with player - game over
        if(character_props.left < capsicum_props.left + capsicum_props.width &&
          character_props.left + character_props.width > capsicum_props.left &&
          character_props.top < capsicum_props.top + capsicum_props.height &&
          character_props.top + character_props.height > capsicum_props.top){
          gameOver();
          return;
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let character_dy = 0;
  function apply_gravity(){
    if(game_state != 'Play') return;
    character_dy = character_dy + grativy;
    document.addEventListener('keydown', (e) => {
      if(e.key == 'ArrowUp' || e.key == ' '){
        img.src = 'images/character-2.png';
        character_dy = -7.6;
      }
    });

    document.addEventListener('keyup', (e) => {
      if(e.key == 'ArrowUp' || e.key == ' '){
        img.src = 'images/character.png';
      }
    });

    if(character_props.top <= 0 || character_props.bottom >= background.bottom){
      gameOver();
      return;
    }
    character.style.top = character_props.top + character_dy + 'px';
    character_props = character.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 50;  // lowered to start pipes earlier
  let pipe_gap = 45;  // increased gap between pipes

  function create_pipe(){
    if(game_state != 'Play') return;

    if(pipe_seperation > 115){
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';

      document.body.appendChild(pipe_sprite_inv);

      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';

      document.body.appendChild(pipe_sprite);

      // Create coin in the gap
      let coin_sprite = document.createElement('div');
      coin_sprite.className = 'coin_sprite';
      coin_sprite.style.top = pipe_posi + pipe_gap/2 + 'vh';
      coin_sprite.style.left = '100vw';
      coin_sprite.collected = false;
      document.body.appendChild(coin_sprite);
    }
    pipe_seperation++;

    // Capsicum spawn randomly but independently from pipes
    if(game_state === 'Play' && Math.random() < 0.005) { // ~0.5% chance per frame
      let capsicum_sprite = document.createElement('div');
      capsicum_sprite.className = 'capsicum_sprite';
      let capsicum_top = Math.floor(Math.random() * 45) + 15;
      capsicum_sprite.style.top = capsicum_top + 'vh';
      capsicum_sprite.style.left = '100vw';
      document.body.appendChild(capsicum_sprite);
    }

    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}
