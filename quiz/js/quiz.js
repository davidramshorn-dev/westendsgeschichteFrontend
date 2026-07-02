document.addEventListener('DOMContentLoaded', () => {
    // Zustandsvariablen (gekapselt)
    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let currentQuestionsPool = [];

    // DOM Elemente
    const loadingView = document.getElementById('loading-view');
    const errorView = document.getElementById('error-view');
    const errorText = document.getElementById('error-text');
    const btnRetry = document.getElementById('btn-retry');
    const quizView = document.getElementById('quiz-view');
    const endView = document.getElementById('end-view');
    
    const questionText = document.getElementById('question-text');
    const answersGrid = document.getElementById('answers-grid');
    const currentScoreEl = document.getElementById('current-score');
    const maxScoreEl = document.getElementById('max-score');
    const currentQuestionNumEl = document.getElementById('current-question-num');
    const totalQuestionsNumEl = document.getElementById('total-questions-num');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const finalScoreEl = document.getElementById('final-score');
    
    const btnToSaveResult = document.getElementById('btn-to-saveResult');
    const btnRestart = document.getElementById('btn-restart');

    // Initialisierung
    init();

    function init() {
        setupEventListeners();
        loadQuestions();
    }

    function setupEventListeners() {
        btnRetry.addEventListener('click', loadQuestions);
        btnRestart.addEventListener('click', () => {
            currentIndex = 0;
            score = 0;
            endView.classList.add('hidden');
            loadQuestions();
        });
        btnToSaveResult.addEventListener('click', () => {
            // Im LocalStorage unter dem Schlüssel 'meinDatenSchluessel' speichern
            localStorage.setItem('score', score);
            window.location.href = 'login.html';
        });
    }

    // ===================================================================
    // BACKEND-SCHNITTSTELLE
    //
    // REST-Endpunkt:
    // GET /api/question
    //
    // Erwartete Antwort (Array aus Objekten):
    // [
    //   {
    //      "id": 1,
    //      "question": "Welche Sprache nutzt Spring Boot?",
    //      "answers": ["Java", "Python", "C++", "JavaScript"],
    //      "correct": 0
    //   }
    // ]
    //
    // Diese Daten stammen aus dem Spring-Boot-Backend.
    // Falls sich die API ändert, muss ausschließlich dieser Bereich
    // angepasst werden.
    // ===================================================================
    async function loadQuestions() {
        showLoading();
        try {
            const response = await fetch('https://westendsgeschichte-3.onrender.com/api/question');
            if (!response.ok) throw new Error('Fehler beim Laden der Fragen.');
            
            questions = await response.json();
            
            if (questions.length === 0) {
                showError('Keine Fragen im System vorhanden.');
                return;
            }
            
            // Logik vorbereiten
            currentQuestionsPool = shuffleQuestions([...questions]);
            
            // UI Setup
            maxScoreEl.textContent = currentQuestionsPool.length;
            totalQuestionsNumEl.textContent = currentQuestionsPool.length;
            
            // Zeige Quiz-View
            loadingView.classList.add('hidden');
            errorView.classList.add('hidden');
            quizView.classList.remove('hidden');
            
            showQuestion();
        } catch (error) {
            showError('Das Quizsystem konnte die Fragen nicht laden. Bitte prüfe deine Serververbindung.');
        }
    }
    // ===================================================================

    function shuffleQuestions(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array.slice(0, 10); // nur die ersten 10 behalten
    }

    function shuffleAnswers(answers, correctIdx) {
        // Erzeugt Array aus Objekten um den alten Index zu tracken
        let mapped = answers.map((ans, idx) => ({ text: ans, originalIndex: idx }));
        for (let i = mapped.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
        }
        return {
            shuffledList: mapped.map(m => m.text),
            newCorrectIndex: mapped.findIndex(m => m.originalIndex === correctIdx)
        };
    }

    function showQuestion() {
        updateProgress();
        updateScore();
        
        const currentQuestion = currentQuestionsPool[currentIndex];
        
        // Sanfter Fade-In Effekt der Frage
        quizView.classList.remove('fade-in');
        quizView.classList.add('fade-out');

        setTimeout(() => {
            questionText.textContent = currentQuestion.question;
            answersGrid.innerHTML = '';

            // Antworten aus dem Backend übernehmen
            const answers = [
                currentQuestion.answer1,
                currentQuestion.answer2,
                currentQuestion.answer3
            ];

            // correctAnswer ist 1-3 -> für JavaScript 0-2 umwandeln
            const correctIndex = currentQuestion.correctAnswer - 1;

            // Antworten mischen
            const { shuffledList, newCorrectIndex } =
                shuffleAnswers(answers, correctIndex);

            shuffledList.forEach((answerText, idx) => {
                const card = document.createElement('button');
                card.classList.add('answer-card');
                card.textContent = answerText;
                card.addEventListener('click', () => selectAnswer(card, idx, newCorrectIndex));
                answersGrid.appendChild(card);
            });

            quizView.classList.remove('fade-out');
            quizView.classList.add('fade-in');
        }, 250);
    }

    function selectAnswer(selectedCard, selectedIdx, correctIdx) {
        // Verhindert Mehrfachklicks während der Animation
        const cards = answersGrid.querySelectorAll('.answer-card');
        cards.forEach(card => card.classList.add('disabled'));

        checkAnswer(selectedCard, selectedIdx, correctIdx);
    }

    function checkAnswer(selectedCard, selectedIdx, correctIdx) {
        const cards = answersGrid.querySelectorAll('.answer-card');
        
        if (selectedIdx === correctIdx) {
            selectedCard.classList.add('correct');
            score++;
        } else {
            selectedCard.classList.add('wrong');
            // Zeige die richtige Antwort zusätzlich grün an
            cards[correctIdx].classList.add('correct');
        }

        // Verzögerter automatischer Übergang zur nächsten Frage (Vorgabe: kurze Animation)
        setTimeout(() => {
            nextQuestion();
        }, 1400);
    }

    function updateScore() {
        currentScoreEl.textContent = score;
    }

    function updateProgress() {
        currentQuestionNumEl.textContent = currentIndex + 1;
        const percent = ((currentIndex) / currentQuestionsPool.length) * 100;
        progressBarFill.style.width = `${percent}%`;
    }

    function nextQuestion() {
        currentIndex++;
        if (currentIndex < currentQuestionsPool.length) {
            showQuestion();
        } else {
            // Letztes Update für ProgressBar auf 100% vor dem Ende
            progressBarFill.style.width = '100%';
            setTimeout(finishQuiz, 300);
        }
    }

    function finishQuiz() {
        quizView.classList.add('hidden');
        endView.classList.remove('hidden');
        finalScoreEl.textContent = score;
    }
    function showError(msg) {
        loadingView.classList.add('hidden');
        quizView.classList.add('hidden');
        endView.classList.add('hidden');
        errorView.classList.remove('hidden');
        errorText.textContent = msg;
    }

    function showLoading() {
        loadingView.classList.remove('hidden');
        quizView.classList.add('hidden');
        errorView.classList.add('hidden');
        endView.classList.add('hidden');
    }
});