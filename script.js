const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

let questions = [];
let time = 30;
let score = 0;
let currentQuestion;
let timer;

const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startscreen = document.querySelector(".start-screen");

const startQuiz = () => {
    const num = numQuestions.value;
    cat = category.value;
    diff = difficulty.value;

    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            startscreen.classList.add("hide");
            quiz.classList.remove("hide");
            currentQuestion = 1;
            showQuestion(questions[0]);
        }, 1000);
};

startBtn.addEventListener("click", startQuiz);



const showQuestion = (question) => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answer-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];

    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
        <div class="answer">
            <span class="text">${answer}</span>
            <span class="checkbox">
                <span class="icon"><i class="fa-solid fa-check"></i></span>
            </span>
        </div>
        `;
    });

    questionNumber.innerHTML = `
    Question <span class="current">${
        questions.indexOf(question) + 1
    }</span> 
            <span class="total">/ ${questions.length}</span>`;

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if(!answer.classList.contains("checked")){
                answerDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });

                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(() => {
        if(time >= 0){
            progress(time);
            time--;
        }else{
            checkAnswer();
        }
    }, 1000);
};

const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");

    if(selectedAnswer){
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        console.log(currentQuestion);

        if(answer === questions[currentQuestion - 1].correct_answer){
            score++;
            selectedAnswer.classList.add("correct");
        } else{
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
                if(answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer){
                    answer.classList.add("correct");
                }
            });
        }
    }
    else{
        const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
            if(answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer){
                answer.classList.add("correct");
            }
        });
    }

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.classList.add("checked");
    })

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
    nextQuestion();

    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});

const nextQuestion = () => {
    if(currentQuestion < questions.length){
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
    } else {
        showScore();
    };
};

const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});