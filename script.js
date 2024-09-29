document.addEventListener("DOMContentLoaded", () => {
  function createFallingNumber() {
    const numberElement = document.createElement("div");
    numberElement.classList.add("background-number");

    // Gera um número aleatório da lista [2, 4, 8, 16, 32, 64]
    const numbers = [2, 4, 8, 16, 32, 64];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    numberElement.textContent = randomNumber;

    // Define a posição e a duração da animação
    numberElement.style.left = `${Math.random() * 100}vw`; // Posição horizontal aleatória
    numberElement.style.animationDuration = `${Math.random() * 10 + 10}s`; // Aumenta o tempo da queda para 10 a 20 segundos

    document.querySelector(".background-numbers").appendChild(numberElement);
  }

  // Gerar números de forma contínua
  setInterval(createFallingNumber, 500); // Cria um número a cada 500ms

  // Restante do código do jogo 2048...
  const gridContainer = document.getElementById("grid-container");
  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("high-score");
  const modal = document.getElementById("game-over-modal");
  const restartButton = document.getElementById("restart-button");
  let cells = [];
  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0; // Carrega o recorde do localStorage
  let startX, startY, endX, endY;

  // Exibe o recorde atual
  highScoreDisplay.textContent = highScore;

  // Inicializa o tabuleiro
  function createGrid() {
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      gridContainer.appendChild(cell);
      cells.push(cell);
    }
    generateNumber();
    generateNumber();
  }

  // Gera um novo número aleatório (2 ou 4)
  function generateNumber() {
    const emptyCells = cells.filter((cell) => !cell.textContent);
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      randomCell.textContent = Math.random() > 0.1 ? "2" : "4";
      randomCell.setAttribute("data-value", randomCell.textContent);
      randomCell.style.transform = "scale(0)";
      setTimeout(() => (randomCell.style.transform = "scale(1)"), 100);
    }
  }

  // Movimenta as células
  function move(direction) {
    let moved = false;

    if (direction === "up") {
      moved = moveUp();
    } else if (direction === "down") {
      moved = moveDown();
    } else if (direction === "left") {
      moved = moveLeft();
    } else if (direction === "right") {
      moved = moveRight();
    }

    if (moved) {
      generateNumber();
      setTimeout(checkGameOver, 300); // Verifica o fim do jogo após gerar novo número
    }
  }

  function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      let merged = [false, false, false, false];
      for (let row = 1; row < 4; row++) {
        let currentIdx = row * 4 + col;
        if (cells[currentIdx].textContent) {
          let targetRow = row;
          while (
            targetRow > 0 &&
            !cells[(targetRow - 1) * 4 + col].textContent
          ) {
            targetRow--;
          }

          let targetIdx = targetRow * 4 + col;
          if (
            targetRow > 0 &&
            cells[targetIdx - 4].textContent ===
              cells[currentIdx].textContent &&
            !merged[targetRow - 1]
          ) {
            cells[targetIdx - 4].textContent = String(
              parseInt(cells[currentIdx].textContent) * 2
            );
            cells[targetIdx - 4].setAttribute(
              "data-value",
              cells[targetIdx - 4].textContent
            );
            score += parseInt(cells[targetIdx - 4].textContent);
            scoreDisplay.textContent = score;

            // Adiciona a animação de combinação ao par combinado
            cells[targetIdx - 4].classList.add("pair-animation");

            // Remove a classe de animação após a conclusão
            setTimeout(() => {
              cells[targetIdx - 4].classList.remove("pair-animation");
            }, 600); // Duração da animação

            updateHighScore(); // Atualiza o recorde se necessário
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            merged[targetRow - 1] = true;
            moved = true;
          } else if (targetIdx !== currentIdx) {
            cells[targetIdx].textContent = cells[currentIdx].textContent;
            cells[targetIdx].setAttribute(
              "data-value",
              cells[targetIdx].textContent
            );
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            moved = true;
          }
        }
      }
    }
    return moved;
  }

  function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      let merged = [false, false, false, false];
      for (let row = 2; row >= 0; row--) {
        let currentIdx = row * 4 + col;
        if (cells[currentIdx].textContent) {
          let targetRow = row;
          while (
            targetRow < 3 &&
            !cells[(targetRow + 1) * 4 + col].textContent
          ) {
            targetRow++;
          }

          let targetIdx = targetRow * 4 + col;
          if (
            targetRow < 3 &&
            cells[targetIdx + 4].textContent ===
              cells[currentIdx].textContent &&
            !merged[targetRow + 1]
          ) {
            cells[targetIdx + 4].textContent = String(
              parseInt(cells[currentIdx].textContent) * 2
            );
            cells[targetIdx + 4].setAttribute(
              "data-value",
              cells[targetIdx + 4].textContent
            );
            score += parseInt(cells[targetIdx + 4].textContent);
            scoreDisplay.textContent = score;

            // Adiciona a animação de combinação ao par combinado
            cells[targetIdx + 4].classList.add("pair-animation");

            // Remove a classe de animação após a conclusão
            setTimeout(() => {
              cells[targetIdx + 4].classList.remove("pair-animation");
            }, 600); // Duração da animação

            updateHighScore(); // Atualiza o recorde se necessário
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            merged[targetRow + 1] = true;
            moved = true;
          } else if (targetIdx !== currentIdx) {
            cells[targetIdx].textContent = cells[currentIdx].textContent;
            cells[targetIdx].setAttribute(
              "data-value",
              cells[targetIdx].textContent
            );
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            moved = true;
          }
        }
      }
    }
    return moved;
  }

  function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      let merged = [false, false, false, false];
      for (let col = 1; col < 4; col++) {
        let currentIdx = row * 4 + col;
        if (cells[currentIdx].textContent) {
          let targetCol = col;
          while (
            targetCol > 0 &&
            !cells[row * 4 + (targetCol - 1)].textContent
          ) {
            targetCol--;
          }

          let targetIdx = row * 4 + targetCol;
          if (
            targetCol > 0 &&
            cells[targetIdx - 1].textContent ===
              cells[currentIdx].textContent &&
            !merged[targetCol - 1]
          ) {
            cells[targetIdx - 1].textContent = String(
              parseInt(cells[currentIdx].textContent) * 2
            );
            cells[targetIdx - 1].setAttribute(
              "data-value",
              cells[targetIdx - 1].textContent
            );
            score += parseInt(cells[targetIdx - 1].textContent);
            scoreDisplay.textContent = score;

            // Adiciona a animação de combinação ao par combinado
            cells[targetIdx - 1].classList.add("pair-animation");

            // Remove a classe de animação após a conclusão
            setTimeout(() => {
              cells[targetIdx - 1].classList.remove("pair-animation");
            }, 600); // Duração da animação

            updateHighScore(); // Atualiza o recorde se necessário
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            merged[targetCol - 1] = true;
            moved = true;
          } else if (targetIdx !== currentIdx) {
            cells[targetIdx].textContent = cells[currentIdx].textContent;
            cells[targetIdx].setAttribute(
              "data-value",
              cells[targetIdx].textContent
            );
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            moved = true;
          }
        }
      }
    }
    return moved;
  }

  function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      let merged = [false, false, false, false];
      for (let col = 2; col >= 0; col--) {
        let currentIdx = row * 4 + col;
        if (cells[currentIdx].textContent) {
          let targetCol = col;
          while (
            targetCol < 3 &&
            !cells[row * 4 + (targetCol + 1)].textContent
          ) {
            targetCol++;
          }

          let targetIdx = row * 4 + targetCol;
          if (
            targetCol < 3 &&
            cells[targetIdx + 1].textContent ===
              cells[currentIdx].textContent &&
            !merged[targetCol + 1]
          ) {
            cells[targetIdx + 1].textContent = String(
              parseInt(cells[currentIdx].textContent) * 2
            );
            cells[targetIdx + 1].setAttribute(
              "data-value",
              cells[targetIdx + 1].textContent
            );
            score += parseInt(cells[targetIdx + 1].textContent);
            scoreDisplay.textContent = score;

            // Adiciona a animação de combinação ao par combinado
            cells[targetIdx + 1].classList.add("pair-animation");

            // Remove a classe de animação após a conclusão
            setTimeout(() => {
              cells[targetIdx + 1].classList.remove("pair-animation");
            }, 600); // Duração da animação

            updateHighScore(); // Atualiza o recorde se necessário
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            merged[targetCol + 1] = true;
            moved = true;
          } else if (targetIdx !== currentIdx) {
            cells[targetIdx].textContent = cells[currentIdx].textContent;
            cells[targetIdx].setAttribute(
              "data-value",
              cells[targetIdx].textContent
            );
            cells[currentIdx].textContent = "";
            cells[currentIdx].removeAttribute("data-value");
            moved = true;
          }
        }
      }
    }
    return moved;
  }

  // Função para atualizar o recorde
  function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // Armazena o recorde no localStorage
      highScoreDisplay.textContent = highScore; // Atualiza a exibição do recorde
    }
  }

  // Detecta a vitória ou o fim do jogo
  function checkGameOver() {
    const emptyCells = cells.filter((cell) => !cell.textContent);
    if (emptyCells.length > 0) return;

    for (let i = 0; i < 16; i++) {
      const currentValue = parseInt(cells[i].textContent);
      if (
        (i % 4 !== 3 && currentValue === parseInt(cells[i + 1]?.textContent)) || // Verifica fusão à direita
        (i < 12 && currentValue === parseInt(cells[i + 4]?.textContent)) || // Verifica fusão para baixo
        (i % 4 !== 0 && currentValue === parseInt(cells[i - 1]?.textContent)) || // Verifica fusão à esquerda
        (i > 3 && currentValue === parseInt(cells[i - 4]?.textContent)) // Verifica fusão para cima
      ) {
        return;
      }
    }

    // Exibe o modal de fim de jogo
    showGameOverModal();
  }

  // Mostra o modal de fim de jogo
  function showGameOverModal() {
    modal.style.display = "flex";
  }

  // Reseta o jogo
  function resetGame() {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.removeAttribute("data-value");
      cell.style.transform = "scale(1)";
    });
    score = 0;
    scoreDisplay.textContent = score;
    modal.style.display = "none"; // Esconde o modal
    generateNumber();
    generateNumber();
  }

  // Eventos
  restartButton.addEventListener("click", resetGame);
  createGrid();

  // Captura o início do movimento do mouse
  gridContainer.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });

  // Captura o final do movimento do mouse e define a direção
  gridContainer.addEventListener("mouseup", (e) => {
    endX = e.clientX;
    endY = e.clientY;
    handleGesture();
  });

  // Lida com o movimento do mouse e define a direção
  function handleGesture() {
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        move("right");
      } else {
        move("left");
      }
    } else {
      if (diffY > 0) {
        move("down");
      } else {
        move("up");
      }
    }
  }

  // Captura as teclas de seta para movimentação
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        move("up");
        break;
      case "ArrowDown":
        move("down");
        break;
      case "ArrowLeft":
        move("left");
        break;
      case "ArrowRight":
        move("right");
        break;
    }
  });

  // Captura o início do toque
  gridContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  // Captura o final do toque e define a direção
  gridContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleGesture();
  });
});
