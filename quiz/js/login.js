// Prüfen, ob die Elemente auf der aktuellen HTML-Seite existieren (Verhindert den "null"-Fehler)
const btnToLeaderboardName = document.getElementById('btn-to-leaderboard-name');
const btnToLeaderboardAnonym = document.getElementById('btn-to-leaderboard-anonym');

if (btnToLeaderboardName && btnToLeaderboardAnonym) {

    // Event-Listener muss ASYNC sein, um auf das Backend zu warten
    btnToLeaderboardName.addEventListener('click', async () => {
        const playertagInput = document.getElementById('playertag');
        if (!playertagInput || !playertagInput.value.trim()) {
            alert("Bitte gib einen Namen ein oder spiele anonym!");
            return;
        }

        const playertag = playertagInput.value;

        // Warten, bis der Server "OK" sagt...
        await saveResult(playertag);

        // ...erst dann die Seite wechseln!
        window.location.href = 'leaderboard.html';
    });

    btnToLeaderboardAnonym.addEventListener('click', async () => {
        // Warten, bis der Server "OK" sagt
        await saveResult('Anonym');
        window.location.href = 'leaderboard.html';
    });
}

// ===================================================================
// BACKEND-SCHNITTSTELLE
// ===================================================================
async function saveResult(playertag) {
    const username = playertag;

    // Auslesen aus dem Speicher
    const scoreRaw = localStorage.getItem('score');

    // In eine Ganzzahl umwandeln (wichtig für Spring Boot Integer/int)
    const score = scoreRaw ? parseInt(scoreRaw, 10) : 0;

    try {
        // 'return fetch' sorgt dafür, dass das Promise weitergegeben wird
        const response = await fetch('https://westendsgeschichte-3.onrender.com/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, score: score })
        });

        if (!response.ok) {
            throw new Error(`Server antwortete mit Status ${response.status}`);
        }

        console.log('Ergebnis erfolgreich gespeichert!');
    } catch (error) {
        console.error('Ergebnis konnte nicht an das Leaderboard übermittelt werden:', error);
        // Dem Nutzer Bescheid geben, falls Render.com im Standby war
        alert("Fehler beim Speichern des Scores. Bitte versuche es noch einmal.");
    }
}
