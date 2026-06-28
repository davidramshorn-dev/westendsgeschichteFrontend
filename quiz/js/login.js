document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorContainer = document.getElementById('error-container');
    const btnCancel = document.getElementById('btn-cancel');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Speicher User lokal für spätere Auswertungen (z.B. Highlight in Rangliste)
        localStorage.setItem('quiz_username', username);

        // ===================================================================
        // BACKEND-SCHNITTSTELLE
        //
        // REST-Endpunkt:
        // POST /api/login
        //
        // Übergibt als JSON-Body:
        // { "username": "...", "password": "..." }
        //
        // Erwartete Antwort bei Erfolg:
        // HTTP Status 200 OK (ggf. JSON-Token oder Status-Meldung)
        // Erwartete Antwort bei Fehler:
        // HTTP Status 401 Unauthorized
        //
        // Diese Daten stammen aus dem Spring-Boot-Backend.
        // Falls sich die API ändert, muss ausschließlich dieser Bereich
        // angepasst werden.
        // ===================================================================
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                // Weiterleitung zur Quiz-Hauptseite bei Erfolg
                window.location.href = 'fragen.html';
            } else {
                showError('Anmeldung fehlgeschlagen. Falscher Username oder Passwort.');
            }
        } catch (error) {
            showError('Verbindung zum Anmeldeservice fehlgeschlagen.');
        }
        // ===================================================================
    });

    btnCancel.addEventListener('click', () => {
        loginForm.reset();
        errorContainer.classList.add('hidden');
    });

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }
});