let quizData = [];

fetch('/question/tes.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        shuffle(quizData);
        loadQuiz();
    })
    .catch(error => console.error('Error loading quiz data:', error));

const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const answersEls = document.querySelectorAll('.answer');
const quiz = document.querySelector('.quiz-container');

let currentQuiz = 0;
let score = 0;
let incorrectAnswers = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuiz() {
    deselectAnswers();

    if (quizData.length > 0) {
        const currentQuizData = quizData[currentQuiz];

        questionEl.innerText = currentQuizData.question;
        a_text.innerText = currentQuizData.a;
        b_text.innerText = currentQuizData.b;
        c_text.innerText = currentQuizData.c;
        d_text.innerText = currentQuizData.d;
    }
}

function deselectAnswers() {
    answersEls.forEach(answerEl => answerEl.checked = false);
}

function getSelected() {
    let answer = undefined;

    answersEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id;
        }
    });

    return answer;
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if (answer && quizData.length > 0) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[currentQuiz].question,
                selected: answer,
                correct: quizData[currentQuiz].correct,
                selectedText: quizData[currentQuiz][answer],
                correctAnswerText: quizData[currentQuiz][quizData[currentQuiz].correct]
            });
        }

        currentQuiz++;

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            showResults();
        }
    }
});

function showResults() {
    let resultHtml = `<h2>Anda menjawab ${score}/${quizData.length} pertanyaan dengan benar</h2>`;

    if (incorrectAnswers.length > 0) {
        resultHtml += `<h3>Pertanyaan yang salah dijawab:</h3><ul>`;
        incorrectAnswers.forEach((item, index) => {
            resultHtml += `<li>
                <strong>Pertanyaan ${index + 1}:</strong> ${item.question}<br>
                <strong>Jawaban Anda:</strong> ${item.selected.toUpperCase()} - ${item.selectedText}<br>
                <strong>Jawaban Benar:</strong> ${item.correct.toUpperCase()} - ${item.correctAnswerText}
            </li>`;
        });
        resultHtml += `</ul>`;
    } else {
        resultHtml += `<h3>Anda menjawab semua pertanyaan dengan benar!</h3>`;
    }

    resultHtml += `<button onclick="location.reload()">Ulangi</button>`;

    quiz.innerHTML = resultHtml;
}
