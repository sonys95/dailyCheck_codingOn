// 퀴즈를 저장할 배열
let quizzes = [];

// 새 퀴즈 추가 섹션을 보여주는 함수
function showNewQuizSection() {
  const newQuizSection = document.getElementById("newQuizSection");
  newQuizSection.style.display = "block";
}

// 답변을 설정하는 함수
function setAnswer(answer) {
  const answerInput = document.getElementById("answerInput");
  answerInput.value = answer;

  const answerO = document.getElementById("answerO");
  const answerX = document.getElementById("answerX");

  if (answer === "O") {
    answerO.classList.add("selected");
    answerX.classList.remove("selected");
  } else if (answer === "X") {
    answerO.classList.remove("selected");
    answerX.classList.add("selected");
  }

  const selectedAnswer = document.getElementById("selectedAnswer");
  selectedAnswer.innerText = answer;
}

// 새 퀴즈를 추가하는 함수
function addQuiz() {
  const questionInput = document.getElementById("questionInput");
  const answerInput = document.getElementById("answerInput");

  const question = "Q. " + questionInput.value;
  const answer = answerInput.value.toUpperCase();

  if (answer !== "O" && answer !== "X") {
    alert("답변은 O 또는 X만 가능합니다.");
    return;
  }

  quizzes.push({ question, answer, correctAttempts: 0, totalAttempts: 0 });

  // 새 퀴즈 목록 업데이트
  updateQuizList();

  // 입력 필드 초기화
  questionInput.value = "";
  answerInput.value = "";
  // 새 퀴즈 추가 섹션 숨기기
  const newQuizSection = document.getElementById("newQuizSection");
  newQuizSection.style.display = "none";

  // 로컬 스토리지에 퀴즈 저장
  saveQuizzesToLocalStorage();
}

// 퀴즈 목록을 보여주는 함수
function updateQuizList() {
  const quizList = document.getElementById("quizList");
  quizList.innerHTML = "";

  quizzes.forEach((quiz, index) => {
    // const quizDiv = document.createElement("div");
    // quizDiv.classList.add("quizDiv");

    const quizElement = document.createElement("div");
    quizElement.classList.add("quiz");

    const questionElement = document.createElement("div");
    questionElement.classList.add("quizContent");
    questionElement.innerText = quiz.question;

    const resultElement = document.createElement("div");
    resultElement.classList.add("result");

    const correctnessRateElement = document.createElement("div");
    correctnessRateElement.classList.add("correctness-rate");
    const correctnessRate =
      quiz.totalAttempts === 0
        ? 0
        : (quiz.correctAttempts / quiz.totalAttempts) * 100;
    correctnessRateElement.innerText = `정답률: ${correctnessRate.toFixed(2)}%`;

    const answerOButton = document.createElement("button");
    answerOButton.innerText = "O";
    answerOButton.onclick = () => checkAnswer(index, "O");

    const answerXButton = document.createElement("button");
    answerXButton.innerText = "X";
    answerXButton.onclick = () => checkAnswer(index, "X");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.onclick = () => deleteQuiz(index);

    const answerButtonsContainer = document.createElement("div");
    answerButtonsContainer.classList.add("answer-buttons");
    answerButtonsContainer.appendChild(answerOButton);
    answerButtonsContainer.appendChild(answerXButton);

    // div로 감싸기
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("questionDiv1");
    questionDiv.appendChild(questionElement);

    const rateDiv = document.createElement("div");
    rateDiv.classList.add("rateDiv1");
    rateDiv.appendChild(correctnessRateElement);
    rateDiv.appendChild(answerButtonsContainer);
    rateDiv.appendChild(resultElement);
    rateDiv.appendChild(deleteButton);

    quizElement.appendChild(questionDiv);
    quizElement.appendChild(rateDiv);

    quizList.appendChild(quizElement);
  });
}

// 답 확인을 위한 함수
function checkAnswer(index, userAnswer) {
  const quiz = quizzes[index];
  const correctAnswer = quiz.answer;

  const resultElement = document.getElementsByClassName("result")[index];
  const answerButtonsContainer =
    document.getElementsByClassName("answer-buttons")[index];

  quiz.totalAttempts++;

  if (userAnswer.toUpperCase() === correctAnswer) {
    resultElement.innerText = "정답!";
    quiz.correctAttempts++;
  } else {
    resultElement.innerText = "오답!";
  }

  answerButtonsContainer.style.display = "none";

  // 정답률 업데이트
  const correctnessRateElement =
    document.getElementsByClassName("correctness-rate")[index];
  const correctnessRate =
    quiz.totalAttempts === 0
      ? 0
      : (quiz.correctAttempts / quiz.totalAttempts) * 100;
  correctnessRateElement.innerText = `정답률: ${correctnessRate.toFixed(2)}%`;

  // 로컬 스토리지에 퀴즈 저장
  saveQuizzesToLocalStorage();
}

// 퀴즈 삭제를 위한 함수
function deleteQuiz(index) {
  quizzes.splice(index, 1);
  updateQuizList();
  // 로컬 스토리지에 퀴즈 저장
  saveQuizzesToLocalStorage();
}

// 로컬 스토리지에 퀴즈 저장하는 함수
function saveQuizzesToLocalStorage() {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
}

// 페이지 로딩 시 로컬 스토리지에서 퀴즈 불러오기
function loadQuizzesFromLocalStorage() {
  const savedQuizzes = localStorage.getItem("quizzes");
  if (savedQuizzes) {
    quizzes = JSON.parse(savedQuizzes);
    updateQuizList();
  }
}

// 페이지 로딩 시 저장된 퀴즈 불러오기
loadQuizzesFromLocalStorage();
