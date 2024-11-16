

// Declaração de variáveis globais ------------------------

// Player e inimigos
const player = $('.personagem_pk');
const enemy = $('.personagem_ht');
const enemy_nj = $('.personagem_nj');
var enemyClone
var enemyCloneNj
var firstEnemy = 'x'
var ht_gerado = false
var nj_gerado = false
var createEnemy
// Regras de iniciação
let iniciouGame = false;
var reiniciou = false;
var gameOver = false
var velocidadeTela
var pontuacao = 0
var pontuacao_maxima = 0
var carregarSprites = true
// Verificando status do personagem
var noAr = false;
var noSlide = false
// Capturando entidades do projeto
var tela_gameOver = $('.tela_fim_jogo')
const restart = $('#game-over')
const form = $('#form-wrap')
const btt_restart = $('.restart_btt')
const btt_home = $('.home_btt')
var pontuacao_game = $('.pontuacao_game')
var music_menu = new Audio('menu.mp3');
var music_game = new Audio('game.mp3');
//variaveis de setInterval 
var interval_colisao
var calculo_pontuacao
var gera_inimigo
var aumentar_velocidade



// Declaração de variáveis globais ------------------------


// ------------------- AÇÕES INICIAIS ------------------


$(document).ready(() => {
  music_menu.play();
  music_game.pause();

})

// Inicia a tela "game" ao apertar play -----------------------
$('.btt_play_menu').on('click', iniciarJogo)

function iniciarJogo() {

  console.log('att');

  pontuacao_game.html('0')
  $('.menu').css('display', 'none')
  $('.game').css('display', 'block')

  // Adicionar a função rotacionarTela aqui
  function rotacionarTela() {
    if (screen.orientation.lock) {
      screen.orientation.lock("landscape");
    } else if (screen.lockOrientation) {
      screen.lockOrientation("landscape");
    } else {
      alert("Não foi possível rotacionar a tela");
    }
  }

  // Deixa em tela cheia
  const elemento = document.documentElement;
  if (elemento.requestFullscreen) {
    elemento.requestFullscreen();
  } else if (elemento.mozRequestFullScreen) { /* Firefox */
    elemento.mozRequestFullScreen();
  } else if (elemento.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elemento.webkitRequestFullscreen();
  } else if (elemento.msRequestFullscreen) { /* IE/Edge */
    elemento.msRequestFullscreen();
  }

  music_game.play();
  music_game.currentTime = 0;
  music_menu.pause();


  rotacionarTela(); // chamar a função de rotação


  if (carregarSprites === true) {
    iniciouGame = true
    createEnemy = 1
    gerarInimigo()
    createEnemy = 0
    gerarInimigo()
    animacao_pulo()
    setTimeout(animacao_slide, 1000)
    carregarSprites = false
  }

  contagem()

};


// Sistema de controle de personagem -------------

$('html').on('click', function (event) {  // Pula ao clicar na tela
  if (!$(event.target).is('.restart_btt')) {
    console.log('detectado: click');
    animacao_pulo();
  }
})

$('html').on('keydown', function (event) { // Pula ao apertar seta para cima
  if (event.key === "ArrowUp") {
    console.log('detectado: press arrow up');
    animacao_pulo();
  }
})


$('html').on('keydown', function (event) { // Pula ao apertar espaço
  if (event.key === " ") {
    console.log('detectado: press space');
    animacao_pulo();
  }
})

document.addEventListener("keydown", function (event) { // Faz o "slide" ao apertar a seta
  if (event.key === "ArrowDown") {
    console.log("Seta para baixo pressionada");
    animacao_slide()
  }
});


// Faz o "slide" ao deslizar o dedo

let initialY = null;

document.addEventListener("touchmove", function (event) {
  if (initialY === null) {
    initialY = event.touches[0].clientY; // armazena a posição inicial do dedo
  }

  const currentY = event.touches[0].clientY; // posição atual do dedo

  if (currentY > initialY) {
    console.log("Deslizando para baixo");
    animacao_slide();
  }

  // reseta a posição inicial quando o movimento do dedo termina
  document.addEventListener("touchend", function () {
    initialY = null;
    document.removeEventListener("touchend", arguments.callee);
  });
});



//----------------------- FUNÇÕES A SEREM CONVOCADAS ----------------------
// Contagem para iniciar - chamada nas ações iniciais
function contagem() {
  $('.contagem_game').css('display', 'block')
  $('.contagem_game').html('3...')


  setTimeout(function () {
    $('.contagem_game').html('2...')

    setTimeout(function () {
      $('.contagem_game').html('1...')

      setTimeout(function () {
        $('.contagem_game').html('VAI')

        setTimeout(function () {

          $('.tutorial_container').css('display', 'none')
          $('.contagem_game').css('display', 'none')
          $('.contagem_game').html('3...')
          iniciouGame = true;
          $('.personagem_ht').css('opacity', '1')
          $('.personagem_nj').css('opacity', '1')
          player.css('opacity', '1')

          definirVelocidade()
          interval_colisao = setInterval(detectarColisao, 50)
          calculo_pontuacao = setInterval(calcularPontuacao, 500)
          gera_inimigo = setInterval(gerarInimigo, 2000);
          aumentar_velocidade = setInterval(aumentarVelocidade, 2000)
        }, 1000)
      }, 1000)
    }, 1000)
  }, 1000)
}


// Define a velocidade dos inimigos a cada 500ms - Convocado nas ações iniciais
function definirVelocidade() {
  var tamanhoTela = window.screen.width

  if (tamanhoTela <= 700) {
    velocidadeTela = 1000

  } else if (tamanhoTela > 700 && tamanhoTela < 850) {
    velocidadeTela = 1500

  } else {
    velocidadeTela = 2000
  }

}


// Aumenta a velocidade da tela progressivamente
function aumentarVelocidade() {
  if (pontuacao >= 10) {

    velocidadeTela = velocidadeTela - (velocidadeTela / 20)
    console.log(`velocidade atual: ${velocidadeTela}`);
    if (velocidadeTela < 400) { clearInterval(aumentar_velocidade) }

  }
}

// Animação de pulo - Convocado toda vez que clica ou pressiona espaço
function animacao_pulo() {
  if (iniciouGame === true && noAr === false) {
    noAr = true

    player.css('background-image', 'url(pk_pulo.png)');
    player.css('animation', 'animacao_pk 0.6s steps(8) infinite');
    player.css('transition', 'bottom 0.4s')
    player.css('bottom', '190px');

    setTimeout(() => {
      player.css('transition', 'bottom 0.6s')
      player.css('bottom', '0px')

      setTimeout(() => {
        noAr = false
        player.css('background-image', 'url(pk_andando.png)');
        player.css('animation', 'animacao_pk 0.6s steps(8) infinite');
      }, 550);

    }, 400);
  }
}

// Animação de slide - Convocado toda vez que aperta seta para baixo ou touch pra baixo

function animacao_slide() {
  if (iniciouGame === true && noAr === false && gameOver === false) {

    player.css('background-image', 'url(slide_pk.png)');
    player.css('animation', 'none');
    player.css('scale', '0.9');
    player.css('bottom', '-2px');

    setTimeout(() => {

      player.css('background-image', 'url(pk_andando.png)');
      player.css('animation', 'animacao_pk 0.6s steps(8) infinite');
      player.css('scale', '1')

    }, 650);

  }
}


// Gera um inimigo randomicamente - Convocado durante o jogo a cada 2s
function gerarInimigo() {

  createEnemy = Math.floor(Math.random() * 2)
  if (iniciouGame === true && gameOver === false) {


    // Faz o primeiro inimigo ser o hunter - Convocado quando o jogo abre
    if (firstEnemy == 'x') {
      createEnemy = 1
      firstEnemy = 'z'
    }

    if (createEnemy == 1) { // Cria o inimigo HUNTER
      ht_gerado = true
      enemyClone = enemy.clone(); // Clona a div original
      enemyClone.addClass('personagem_ht');
      enemyClone.appendTo("body"); // Adiciona a div clonada ao corpo do documento
      enemyClone.css('display', 'block')
      enemyClone.animate({ right: '100%' }, velocidadeTela, 'linear', function () {
      })
    }


    else if (createEnemy == 0) { // Cria o inimigo ninja

      nj_gerado = true
      enemyCloneNj = enemy_nj.clone(); // Clona a div original
      enemyCloneNj.addClass('personagem_nj');
      enemyCloneNj.appendTo("body"); // Adiciona a div clonada ao corpo do documento
      enemyCloneNj.css('display', 'block')
      enemyCloneNj.animate({ right: '100%' }, velocidadeTela, 'linear', function () {

      })
    }
  }
}


// Verifica se houve colisão entre player e inimigo Hunter a cada 50ms


function detectarColisao() {
  if (iniciouGame === true && carregarSprites === false) {

    var playerPos = player.position();

    var playerLeft = playerPos.left;
    var playerRight = playerLeft + player.width();
    var playerTop = playerPos.top;
    var playerBottom = playerTop + player.height();

    if (ht_gerado === true) {

      var enemyPos = enemyClone.position();

      var enemyLeft = enemyPos.left;
      var enemyRight = enemyLeft + enemyClone.width();
      var enemyTop = enemyPos.top;
      var enemyBottom = enemyTop + enemyClone.height();
    }
    // Verificar se há colisão
    if (playerRight >= enemyLeft && playerLeft <= enemyRight && playerBottom >= enemyTop && playerTop <= enemyBottom) {

      console.log('Colisão detectada inimigo: 1');
      gameOver = true
      finalizarGame()

      enemyClone.remove();
    }

    // Verifica se houve colisão entre player e NINJA a cada 50ms


    var playerRight = playerLeft + player.width();
    var playerTop = playerPos.top;
    var playerBottom = playerTop + player.height();

    if (nj_gerado === true) {

      var enemyNjPos = enemyCloneNj.position();
      var enemyNjLeft = enemyNjPos.left;
      var enemyNjRight = enemyNjLeft + enemyCloneNj.width();
      var enemyNjTop = enemyNjPos.top;
      var enemyNjBottom = enemyNjTop + enemyCloneNj.height();
    }
    // Verificar se há colisão
    if (playerRight >= enemyNjLeft && playerLeft <= enemyNjRight && playerBottom >= enemyNjTop && playerTop <= enemyNjBottom) {

      console.log("Colisão detectada inimigo: 0");
      gameOver = true
      finalizarGame()

      enemyCloneNj.remove();
    }

  }
}

function fecharForm() {
  const form = document.getElementById('form-wrap');
  const gameOver = document.getElementById('game-over');

  if (form && gameOver) {
    form.style.display = "none"
    gameOver.style.display = "flex"
  }
}

function abrirForm() {
  const form = document.getElementById('form-ranking');
  const text = document.getElementById('text-wrap');

  if (form && text) {
    form.style.display = "flex";
    text.style.display = "none";
  }
}

async function registrarPontuacao(e) {
  e.preventDefault();
  const input = document.getElementById('nome');
  const nome = input.value;

  if (!nome) {
    $('#error').html('Por favor digite seu nome')
    return
  }

  const body = {
    nome: nome,
    pontos: pontuacao_maxima
  }

  try {
    const res = await fetch("https://pumpkin-api.vercel.app/ranking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const link = `<a href="https://site-endless-run-game.vercel.app/">clique aqui</a>`;
      const success = document.getElementById('success');

      success.innerHTML = `Pontuação cadastrada! para conferir o ranking ${link}`

      const timer = setTimeout(() => {
        fecharForm();
        return clearTimeout(timer);
      }, 5000);
    }

  } catch (err) {
    console.log(err)
  }
}

// Função de derrota chamada quando ocorre uma colisão
function finalizarGame() {
  fecharForm();

  if (pontuacao == pontuacao_maxima) {
    form.css('display', 'block');
    restart.css('display', 'none');
  }

  // Faz os intervalos ativos do game pararem
  clearInterval(calculo_pontuacao)
  clearInterval(interval_colisao)
  clearInterval(aumentar_velocidade);

  tela_gameOver.css('display', 'flex')
  player.css('display', 'none')

  $('.pontuacao_final').html(`Fugiu por: ${pontuacao} metros`)
  $('.maiorPontuacao').html(`Mas já me disseram que seu maior recorde foi de: ${pontuacao_maxima} metros`)

}

// Aumenta a pontuação do player em 1 ponto a cada 500ms quando a partida inicia

function calcularPontuacao() {

  if (iniciouGame === true && gameOver === false) {
    pontuacao = pontuacao + 1
    pontuacao_game.html(pontuacao)

    if (pontuacao > pontuacao_maxima) {
      pontuacao_maxima = pontuacao
    }
  }
}


// ------------------ PROCESSO PÓS FIM DE JOGO --------------------- //

btt_restart.on('click', () => {

  console.log('Clicou em restart');

  tela_gameOver.css('display', 'none')
  player.css('display', 'block')
  // reseta condições
  pontuacao = 0
  gameOver = false
  iniciouGame = true
  iniciarJogo()
  clearInterval(gera_inimigo);

  music_game.play();
  music_game.currentTime = 0;
  music_menu.pause();
})


btt_home.on('click', () => {
  // reseta tela
  $('.menu').css('display', 'flex')
  $('.game').css('display', 'none')
  tela_gameOver.css('display', 'none')
  player.css('display', 'block')

  player.css('opacity', '0')
  $('.personagem_ht').css('opacity', '0')
  $('.personagem_nj').css('opacity', '0')
  enemyClone.css('opacity', '0')
  enemyCloneNj.css('opacity', '0')



  music_menu.play();
  music_menu.currentTime = 0;
  music_game.pause();

  clearInterval(gera_inimigo);
  // reseta condições
  pontuacao = 0
  gameOver = false
  iniciouGame = false
  carregarSprites = true
})