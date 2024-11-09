// Function to fetch games based on the selected type
function fetchGames(type) {
    if (!type) {
        return; // Exit if no type is selected
    }

    const query = `
        PREFIX ex: <http://example.org/games#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?game ?name ?developer ?releaseYear ?description ?image WHERE {
            ?game rdf:type ex:${type} ;
                  rdfs:label ?name ;
                  ex:developer ?developer ;
                  ex:releaseYear ?releaseYear ;
                  ex:description ?description ;
                  ex:image ?image .  
        }
    `;

    const endpoint = 'http://localhost:3030/game/sparql';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: `query=${encodeURIComponent(query)}`
    })
    .then(response => response.json())
    .then(data => {
        // Call the displayGames function with the fetched data
        displayGames(data);
    })
    .catch(error => {
        console.error('Error fetching games:', error);
    });
}

// Function to display games in the container
// Function to display games in the container
function displayGames(data) {
    const gamesContainer = document.getElementById('games-container');
    
    // Clear any existing content in the games container
    gamesContainer.innerHTML = '';

    // Check if data is available
    if (data.results.bindings.length > 0) {
        data.results.bindings.forEach(game => {
            const gameName = game.name.value;
            const developer = game.developer.value;
            const releaseYear = game.releaseYear.value;
            const description = game.description.value;
            const imageSrc = game.image.value;

            // Create a game card element
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            
            // Add an onclick event to navigate to store.html
            gameCard.onclick = () => {
                window.location.href = 'store.html';
            };
            
            gameCard.innerHTML = `
                <img src="${imageSrc}" alt="${gameName} Image" class="game-image">
                <h3>${gameName}</h3>
                <p><strong>Developer:</strong> ${developer}</p>
                <p><strong>Release Year:</strong> ${releaseYear}</p>
                <p><strong>Description:</strong> ${description}</p>
            `;

            // Append the game card to the games container
            gamesContainer.appendChild(gameCard);
        });
    } else {
        // If no games are found, display a message
        gamesContainer.innerHTML = '<p>No games found for this type.</p>';
    }
}
