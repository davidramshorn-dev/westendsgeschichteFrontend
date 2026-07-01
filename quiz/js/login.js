
    const btnToLeaderboardName = document.getElementById('btn-to-leaderboard-name');
    const btnToLeaderboardAnonym = document.getElementById('btn-to-leaderboard-anonym');

    btnToLeaderboardName.addEventListener('click', () => {
        const playertag = document.getElementById('playertag').value;
        saveResult(playertag);
        window.location.href = 'leaderboard.html';

    });
    btnToLeaderboardAnonym.addEventListener('click', () => {
        saveResult('Anonym');
        window.location.href = 'leaderboard.html';

    });

// ===================================================================
// BACKEND-SCHNITTSTELLE
//
// REST-Endpunkt:
// POST /api/leaderboard
//
// Übergibt als JSON-Body:
// { "username": "...", "score": 8 }
//
// Erwartete Antwort:
// HTTP Status 200 OK oder 201 Created
//
// Diese Daten stammen aus dem Spring-Boot-Backend.
// Falls sich die API ändert, muss ausschließlich dieser Bereich
// angepasst werden.
// ===================================================================
async function saveResult(playertag) {
    const username = playertag;
    // Daten anhand des Schlüssels wieder auslesen
    const score = localStorage.getItem('score');

    try {
        await fetch('https://westendsgeschichte-3.onrender.com/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, score: score })
        });
    } catch (error) {
        console.error('Ergebnis konnte nicht an das Leaderboard übermittelt werden:', error);
    }
}
// ===================================================================
