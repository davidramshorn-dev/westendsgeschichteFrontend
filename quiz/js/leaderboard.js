document.addEventListener('DOMContentLoaded', () => {
    const loadingView = document.getElementById('loading-view');
    const leaderboardView = document.getElementById('leaderboard-view');
    const errorView = document.getElementById('error-view');
    const errorText = document.getElementById('error-text');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const btnBackMap = document.getElementById('btn-back-map');

    // Podium Elemente
    const top1Name = document.getElementById('top1-name');
    const top1Score = document.getElementById('top1-score');
    const top2Name = document.getElementById('top2-name');
    const top2Score = document.getElementById('top2-score');
    const top3Name = document.getElementById('top3-name');
    const top3Score = document.getElementById('top3-score');

    btnBackMap.addEventListener('click', () => {
        window.location.href = 'https://react-yxgjyh3n.stackblitz.io/';  //../interactiveMap/index.html
    });

    // ===================================================================
    // BACKEND-SCHNITTSTELLE
    //
    // REST-Endpunkt:
    // GET /api/leaderboard
    //
    // Erwartete Antwort (Array aus Objekten sortiert nach Score absteigend):
    // [
    //   { "username": "Spieler1", "score": 12 },
    //   { "username": "Spieler2", "score": 10 },
    //   { "username": "Spieler3", "score": 9 },
    //   { "username": "DeinUsername", "score": 5 }
    // ]
    //
    // Diese Daten stammen aus dem Spring-Boot-Backend.
    // Falls sich die API ändert, muss ausschließlich dieser Bereich
    // angepasst werden.
    // ===================================================================
    async function fetchLeaderboard() {
        try {
            const response = await fetch('https://westendsgeschichte-3.onrender.com/api/leaderboard');
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            renderLeaderboard(data);
        } catch (error) {
            loadingView.classList.add('hidden');
            errorView.classList.remove('hidden');
            errorText.textContent = 'Die Bestenliste konnte nicht geladen werden.';
        }
    }
    // ===================================================================

    function renderLeaderboard(data) {
        loadingView.classList.add('hidden');
        leaderboardView.classList.remove('hidden');
        
        const currentUsername = localStorage.getItem('quiz_username');

        // 1. Top 3 Podium befüllen (wenn vorhanden)
        if (data[0]) {
            top1Name.textContent = data[0].username;
            top1Score.textContent = `${data[0].score} Pkt`;
        }
        if (data[1]) {
            top2Name.textContent = data[1].username;
            top2Score.textContent = `${data[1].score} Pkt`;
        }
        if (data[2]) {
            top3Name.textContent = data[2].username;
            top3Score.textContent = `${data[2].score} Pkt`;
        }

        // 2. Gesamte Tabelle rendern
        leaderboardBody.innerHTML = '';
        data.forEach((entry, index) => {
            const tr = document.createElement('tr');
            
            // Eigener Rang farbig markiert / hervorgehoben (Vorgabe)
            if (currentUsername && entry.username === currentUsername) {
                tr.classList.add('current-user');
            }

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.score}</td>
            `;
            leaderboardBody.appendChild(tr);
        });
    }

    // Start-Aufruf
    fetchLeaderboard();
});