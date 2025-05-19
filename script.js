// Configuración de la API
const API_KEY = '1894262f72f44857a06ea4350d651480';
const API_BASE_URL = 'https://api.rawg.io/api';

// Variables globales
let yourGame = null;
let theirGame = null;
let recommendedGames = [];
let usedGameIds = new Set(); // Para evitar recomendaciones repetitivas

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    // Botones principales
    const pickYourGameBtn = document.getElementById('pick-your-game');
    const pickTheirGameBtn = document.getElementById('pick-their-game');
    const randomComboBtn = document.getElementById('random-combo');
    
    // Contenedores
    const searchContainer = document.getElementById('search-container');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const gameDetails = document.getElementById('game-details');
    
    // Elementos de búsqueda
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Elementos de recomendación
    const recommendationsGrid = document.getElementById('recommendations-grid');
    
    // Elementos de detalle
    const backToRecommendationsBtn = document.getElementById('back-to-recommendations');
    const startOverBtn = document.getElementById('start-over');
    
    // Posters de juegos seleccionados
    const yourGamePoster = document.getElementById('your-game-poster');
    const theirGamePoster = document.getElementById('their-game-poster');
    
    // Event Listeners
    pickYourGameBtn.addEventListener('click', () => showSearch('your'));
    pickTheirGameBtn.addEventListener('click', () => {
        if (yourGame) {
            showSearch('their');
        } else {
            showNotification('¡Primero selecciona tu juego!', 'error');
        }
    });
    
    randomComboBtn.addEventListener('click', getRandomCombo);
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    backToRecommendationsBtn.addEventListener('click', () => {
        gameDetails.style.display = 'none';
        recommendationsGrid.style.display = 'grid';
    });
    
    startOverBtn.addEventListener('click', resetSelections);
    
    // Crear logo animado
    createLogo();
    
    // Añadir elementos animados al fondo
    createGameElements();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a Game Night! Selecciona dos juegos para obtener recomendaciones personalizadas.', 'info');
    }, 1000);
});

// Función para crear el logo
function createLogo() {
    const logoImg = document.getElementById('logo');
    if (!logoImg.src || logoImg.src.includes('logo.png')) {
        // Crear un canvas para el logo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 80;
        
        // Fondo del logo
        ctx.fillStyle = '#4a1942';
        ctx.beginPath();
        ctx.roundRect(0, 0, 200, 80, 10);
        ctx.fill();
        
        // Borde del logo
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(0, 0, 200, 80, 10);
        ctx.stroke();
        
        // Dibujar un controlador estilizado
        ctx.fillStyle = '#e91e63';
        ctx.beginPath();
        ctx.arc(40, 40, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar botones del controlador
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(160, 30, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(180, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(160, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(140, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Texto "GAME NIGHT"
        ctx.font = 'bold 24px Orbitron';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('GAME', 100, 35);
        ctx.fillText('NIGHT', 100, 60);
        
        // Convertir a imagen
        const dataURL = canvas.toDataURL('image/png');
        logoImg.src = dataURL;
    }
}

// Función para crear elementos de videojuegos animados en el fondo
function createGameElements() {
    const backgroundAnimation = document.querySelector('.background-animation');
    
    // Crear elementos de videojuegos flotantes
    const gameIcons = [
        'controller', 'joystick', 'console', 'arcade', 'pixel-heart',
        'pixel-star', 'pixel-coin', 'pixel-ghost', 'pixel-mushroom'
    ];
    
    // Crear 30 elementos aleatorios para un fondo más dinámico
    for (let i = 0; i < 30; i++) {
        const element = document.createElement('div');
        element.className = 'game-element';
        
        // Seleccionar un icono aleatorio
        const iconType = gameIcons[Math.floor(Math.random() * gameIcons.length)];
        element.classList.add(iconType);
        
        // Posición aleatoria
        element.style.left = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = 20 + Math.random() * 40;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        // Animación aleatoria
        const duration = 15 + Math.random() * 30;
        element.style.animation = `float ${duration}s infinite linear`;
        element.style.animationDelay = `-${Math.random() * duration}s`;
        
        // Añadir al fondo
        backgroundAnimation.appendChild(element);
    }
    
    // Añadir estilos para los elementos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .controller {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M7.97,16L5,19C4.67,19.3 4.23,19.5 3.75,19.5A2.25,2.25 0 0,1 1.5,17.25C1.5,16.77 1.7,16.33 2,16L5,13H7V11H3V9H7V7H1V5H7V3H9V5H11V3H13V5H15V7H9V9H13V11H9V13H11V15H13V13H15V11H17V13H19V11H21V13H19V15H21V17H19V15H17V17H15V15H13V17H11.97L7.97,16Z"/></svg>');
        }
        
        .joystick {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M17,5H7A5,5 0 0,0 2,10V14A5,5 0 0,0 7,19H17A5,5 0 0,0 22,14V10A5,5 0 0,0 17,5M7,7H17A3,3 0 0,1 20,10V14A3,3 0 0,1 17,17H7A3,3 0 0,1 4,14V10A3,3 0 0,1 7,7M12,9A2,2 0 0,0 10,11A2,2 0 0,0 12,13A2,2 0 0,0 14,11A2,2 0 0,0 12,9Z"/></svg>');
        }
        
        .console {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M21,6H3A2,2 0 0,0 1,8V16A2,2 0 0,0 3,18H21A2,2 0 0,0 23,16V8A2,2 0 0,0 21,6M21,16H3V8H21M6,15H8V13H10V11H8V9H6V11H4V13H6M14.5,12A1.5,1.5 0 0,1 16,13.5A1.5,1.5 0 0,1 14.5,15A1.5,1.5 0 0,1 13,13.5A1.5,1.5 0 0,1 14.5,12M18.5,9A1.5,1.5 0 0,1 20,10.5A1.5,1.5 0 0,1 18.5,12A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 18.5,9Z"/></svg>');
        }
        
        .arcade {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M14,12H15.5V14.5H14V12M18,10.5H19.5V14.5H18V10.5M8,9H16V10.5H8V9M7,12H8.5V14.5H7V12M5,10.5H6.5V14.5H5V10.5M11,12H12.5V14.5H11V12M2,7H22V17H2V7Z"/></svg>');
        }
        
        .pixel-heart {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/></svg>');
        }
        
        .pixel-star {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>');
        }
        
        .pixel-coin {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z"/></svg>');
        }
        
        .pixel-ghost {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A9,9 0 0,0 3,11V22L6,19L9,22L12,19L15,22L18,19L21,22V11A9,9 0 0,0 12,2M9,8A2,2 0 0,1 11,10A2,2 0 0,1 9,12A2,2 0 0,1 7,10A2,2 0 0,1 9,8M15,8A2,2 0 0,1 17,10A2,2 0 0,1 15,12A2,2 0 0,1 13,10A2,2 0 0,1 15,8Z"/></svg>');
        }
        
        .pixel-mushroom {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,8A2,2 0 0,0 14,6A2,2 0 0,0 12,4A2,2 0 0,0 10,6A2,2 0 0,0 12,8M17,12A2,2 0 0,0 19,10A2,2 0 0,0 17,8A2,2 0 0,0 15,10A2,2 0 0,0 17,12M7,12A2,2 0 0,0 9,10A2,2 0 0,0 7,8A2,2 0 0,0 5,10A2,2 0 0,0 7,12Z"/></svg>');
        }
    `;
    document.head.appendChild(styleSheet);
}

// Función para mostrar la búsqueda
function showSearch(type) {
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    
    searchContainer.style.display = 'block';
    searchInput.focus();
    searchInput.dataset.type = type;
    
    // Limpiar resultados anteriores
    document.getElementById('search-results').innerHTML = '';
    
    // Mostrar mensaje de instrucción
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '<li class="search-instruction">Escribe el nombre de un videojuego para buscar...</li>';
    
    // Mostrar notificación
    showNotification(`Buscando ${type === 'your' ? 'tu' : 'su'} juego. Escribe al menos 3 caracteres.`, 'info');
}

// Función para mostrar notificación
function showNotification(message, type = 'success') {
    // Verificar si ya existe una notificación
    let notification = document.querySelector('.game-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'game-notification';
        document.body.appendChild(notification);
    }
    
    // Añadir clase de tipo
    notification.className = 'game-notification';
    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'info') {
        notification.classList.add('info');
    } else {
        notification.classList.add('success');
    }
    
    // Actualizar mensaje y mostrar
    notification.textContent = message;
    notification.classList.add('show');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para manejar la búsqueda
async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.trim();
    
    if (query.length < 3) {
        searchResults.innerHTML = '<li class="search-instruction">Escribe al menos 3 caracteres para buscar...</li>';
        return;
    }
    
    // Mostrar indicador de carga
    searchResults.innerHTML = '<li class="search-loading">Buscando juegos...</li>';
    
    try {
        const games = await searchGames(query);
        displaySearchResults(games, searchInput.dataset.type);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        searchResults.innerHTML = '<li class="search-error">Error al buscar juegos. Inténtalo de nuevo.</li>';
        showNotification('Error al buscar juegos. Inténtalo de nuevo.', 'error');
    }
}

// Función para buscar juegos en la API
async function searchGames(query) {
    const url = `${API_BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=10`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Error API: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
}

// Función para mostrar resultados de búsqueda
function displaySearchResults(games, type) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (games.length === 0) {
        searchResults.innerHTML = '<li class="search-no-results">No se encontraron juegos. Intenta con otra búsqueda.</li>';
        return;
    }
    
    games.forEach(game => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        
        // Crear imagen en miniatura
        const img = document.createElement('img');
        img.src = game.background_image || 'img/placeholder.png';
        img.alt = game.name;
        img.onerror = function() {
            this.src = 'img/placeholder.png';
        };
        
        // Crear div para información
        const info = document.createElement('div');
        info.className = 'search-result-info';
        
        // Título del juego
        const title = document.createElement('div');
        title.className = 'search-result-title';
        title.textContent = game.name;
        
        // Año de lanzamiento
        const year = document.createElement('div');
        year.className = 'search-result-year';
        year.textContent = game.released ? new Date(game.released).getFullYear() : 'Año desconocido';
        
        // Plataformas (si están disponibles)
        if (game.platforms && game.platforms.length > 0) {
            const platforms = document.createElement('div');
            platforms.className = 'search-result-platforms';
            platforms.textContent = game.platforms.slice(0, 3).map(p => p.platform.name).join(', ');
            if (game.platforms.length > 3) {
                platforms.textContent += '...';
            }
            info.appendChild(platforms);
        }
        
        info.appendChild(title);
        info.appendChild(year);
        
        li.appendChild(img);
        li.appendChild(info);
        
        // Añadir indicador de selección
        const selectIndicator = document.createElement('div');
        selectIndicator.className = 'select-indicator';
        selectIndicator.innerHTML = '<span>Seleccionar</span>';
        li.appendChild(selectIndicator);
        
        li.addEventListener('click', () => selectGame(game, type));
        
        searchResults.appendChild(li);
    });
}

// Función para seleccionar un juego
function selectGame(game, type) {
    if (type === 'your') {
        yourGame = game;
        updateGamePoster('your-game-poster', game);
        
        // Mostrar mensaje de éxito
        showNotification('¡Juego seleccionado! Ahora selecciona el segundo juego.');
    } else {
        theirGame = game;
        updateGamePoster('their-game-poster', game);
    }
    
    // Ocultar búsqueda
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('search-input').value = '';
    
    // Si ambos juegos están seleccionados, mostrar recomendaciones
    if (yourGame && theirGame) {
        showNotification('¡Ambos juegos seleccionados! Generando recomendaciones...');
        getRecommendations();
    }
}

// Función para actualizar el poster de un juego
function updateGamePoster(elementId, game) {
    const posterElement = document.getElementById(elementId);
    posterElement.innerHTML = '';
    posterElement.classList.add('selected');
    
    const img = document.createElement('img');
    img.src = game.background_image || 'img/placeholder.png';
    img.alt = game.name;
    img.onerror = function() {
        this.src = 'img/placeholder.png';
    };
    
    // Añadir título del juego
    const title = document.createElement('div');
    title.className = 'game-title-overlay';
    title.textContent = game.name;
    
    posterElement.appendChild(img);
    posterElement.appendChild(title);
    
    // Actualizar estado visual de los botones
    updateButtonStates();
}

// Función para actualizar estado visual de los botones
function updateButtonStates() {
    const pickYourGameBtn = document.getElementById('pick-your-game');
    const pickTheirGameBtn = document.getElementById('pick-their-game');
    
    if (yourGame) {
        pickYourGameBtn.classList.add('selected');
        pickYourGameBtn.textContent = 'Cambiar Tu Juego';
    } else {
        pickYourGameBtn.classList.remove('selected');
        pickYourGameBtn.textContent = 'Elige Tu Juego';
    }
    
    if (theirGame) {
        pickTheirGameBtn.classList.add('selected');
        pickTheirGameBtn.textContent = 'Cambiar Su Juego';
    } else {
        pickTheirGameBtn.classList.remove('selected');
        pickTheirGameBtn.textContent = 'Elige Su Juego';
    }
}

// Función para obtener una combinación aleatoria
async function getRandomCombo() {
    try {
        showNotification('Buscando combinación aleatoria...', 'info');
        
        // Obtener juegos populares
        const url = `${API_BASE_URL}/games?key=${API_KEY}&ordering=-rating&page_size=40`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error API: ${response.status}`);
        }
        
        const data = await response.json();
        const games = data.results;
        
        if (games.length < 2) {
            showNotification('No se pudieron cargar suficientes juegos. Inténtalo de nuevo.', 'error');
            return;
        }
        
        // Seleccionar dos juegos aleatorios diferentes
        const randomIndex1 = Math.floor(Math.random() * games.length);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * games.length);
        } while (randomIndex2 === randomIndex1);
        
        // Asignar juegos
        yourGame = games[randomIndex1];
        theirGame = games[randomIndex2];
        
        // Actualizar posters
        updateGamePoster('your-game-poster', yourGame);
        updateGamePoster('their-game-poster', theirGame);
        
        // Mostrar mensaje de éxito
        showNotification('¡Combinación aleatoria seleccionada! Generando recomendaciones...');
        
        // Obtener recomendaciones
        getRecommendations();
        
    } catch (error) {
        console.error('Error al obtener combinación aleatoria:', error);
        showNotification('Error al obtener combinación aleatoria. Inténtalo de nuevo.', 'error');
    }
}

// Función para obtener recomendaciones basadas en los juegos seleccionados
async function getRecommendations() {
    try {
        // Limpiar recomendaciones anteriores
        recommendedGames = [];
        
        // Obtener géneros de ambos juegos
        const yourGenres = yourGame.genres.map(g => g.id);
        const theirGenres = theirGame.genres.map(g => g.id);
        
        // Combinar géneros (sin duplicados)
        const combinedGenres = [...new Set([...yourGenres, ...theirGenres])];
        
        // Si no hay géneros, usar tags o plataformas
        let queryParams = '';
        if (combinedGenres.length > 0) {
            queryParams = `&genres=${combinedGenres.join(',')}`;
        } else {
            // Usar plataformas como alternativa
            const yourPlatforms = yourGame.platforms ? yourGame.platforms.map(p => p.platform.id) : [];
            const theirPlatforms = theirGame.platforms ? theirGame.platforms.map(p => p.platform.id) : [];
            const combinedPlatforms = [...new Set([...yourPlatforms, ...theirPlatforms])];
            
            if (combinedPlatforms.length > 0) {
                queryParams = `&platforms=${combinedPlatforms.join(',')}`;
            }
        }
        
        // Excluir los juegos ya seleccionados
        const excludeIds = [yourGame.id, theirGame.id, ...Array.from(usedGameIds)].join(',');
        
        // Obtener juegos recomendados - Aumentado a 10 recomendaciones
        const url = `${API_BASE_URL}/games?key=${API_KEY}${queryParams}&exclude=${excludeIds}&ordering=-rating&page_size=20`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filtrar juegos para asegurar variedad
        recommendedGames = data.results.filter(game => {
            // Verificar que no sea uno de los juegos seleccionados
            return game.id !== yourGame.id && game.id !== theirGame.id && !usedGameIds.has(game.id);
        });
        
        // Limitar a 10 juegos (cambiado de 8 a 10)
        recommendedGames = recommendedGames.slice(0, 10);
        
        // Agregar IDs a la lista de usados para evitar repeticiones en futuras recomendaciones
        recommendedGames.forEach(game => usedGameIds.add(game.id));
        
        // Mostrar recomendaciones
        displayRecommendations();
        
    } catch (error) {
        console.error('Error al obtener recomendaciones:', error);
        showNotification('Error al obtener recomendaciones. Inténtalo de nuevo.', 'error');
    }
}

// Función para mostrar recomendaciones
function displayRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    const recommendationsGrid = document.getElementById('recommendations-grid');
    const gameDetails = document.getElementById('game-details');
    
    // Mostrar contenedor de recomendaciones
    recommendationsContainer.style.display = 'block';
    recommendationsGrid.style.display = 'grid';
    gameDetails.style.display = 'none';
    
    // Limpiar grid
    recommendationsGrid.innerHTML = '';
    
    // Verificar si hay recomendaciones
    if (recommendedGames.length === 0) {
        recommendationsGrid.innerHTML = '<p class="no-results">No se encontraron recomendaciones basadas en tu selección. Intenta con otros juegos.</p>';
        return;
    }
    
    // Crear elementos para cada juego recomendado
    recommendedGames.forEach(game => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        const poster = document.createElement('div');
        poster.className = 'recommendation-poster';
        
        const img = document.createElement('img');
        img.src = game.background_image || 'img/placeholder.png';
        img.alt = game.name;
        img.onerror = function() {
            this.src = 'img/placeholder.png';
        };
        
        const title = document.createElement('div');
        title.className = 'recommendation-title';
        title.textContent = game.name;
        
        // Añadir información adicional
        const info = document.createElement('div');
        info.className = 'recommendation-info';
        
        // Año de lanzamiento
        if (game.released) {
            const year = document.createElement('span');
            year.className = 'recommendation-year';
            year.textContent = new Date(game.released).getFullYear();
            info.appendChild(year);
        }
        
        // Rating si está disponible
        if (game.rating) {
            const rating = document.createElement('span');
            rating.className = 'recommendation-rating';
            rating.innerHTML = `★ ${game.rating.toFixed(1)}`;
            info.appendChild(rating);
        }
        
        poster.appendChild(img);
        item.appendChild(poster);
        item.appendChild(title);
        item.appendChild(info);
        
        // Evento para mostrar detalles
        item.addEventListener('click', () => showGameDetails(game));
        
        recommendationsGrid.appendChild(item);
    });
    
    // Desplazar a las recomendaciones
    recommendationsContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Mostrar notificación
    showNotification(`¡Listo! Encontramos ${recommendedGames.length} juegos recomendados para ti.`);
}

// Función para mostrar detalles de un juego
async function showGameDetails(game) {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    const gameDetails = document.getElementById('game-details');
    const detailPoster = document.getElementById('detail-poster');
    const detailTitle = document.getElementById('detail-title');
    const detailYear = document.getElementById('detail-year');
    const detailGenres = document.getElementById('detail-genres');
    const detailDescription = document.getElementById('detail-description');
    
    // Ocultar grid y mostrar detalles
    recommendationsGrid.style.display = 'none';
    gameDetails.style.display = 'block';
    
    // Mostrar indicador de carga
    detailDescription.innerHTML = '<div class="loading-indicator">Cargando detalles del juego...</div>';
    
    // Actualizar información básica
    detailPoster.src = game.background_image || 'img/placeholder.png';
    detailPoster.onerror = function() {
        this.src = 'img/placeholder.png';
    };
    detailTitle.textContent = game.name;
    detailYear.textContent = game.released ? `Lanzamiento: ${new Date(game.released).getFullYear()}` : 'Fecha de lanzamiento desconocida';
    detailGenres.textContent = `Géneros: ${game.genres.map(g => g.name).join(', ') || 'No disponible'}`;
    
    // Obtener detalles adicionales
    try {
        const url = `${API_BASE_URL}/games/${game.id}?key=${API_KEY}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            
            // Crear contenido HTML para la descripción
            let descriptionHTML = '';
            
            if (data.description) {
                descriptionHTML += `<div class="game-description">${data.description}</div>`;
            } else {
                descriptionHTML += '<p>No hay descripción disponible.</p>';
            }
            
            // Añadir plataformas si están disponibles
            if (data.platforms && data.platforms.length > 0) {
                descriptionHTML += '<div class="game-platforms"><strong>Plataformas:</strong> ';
                descriptionHTML += data.platforms.map(p => p.platform.name).join(', ');
                descriptionHTML += '</div>';
            }
            
            // Añadir desarrolladores si están disponibles
            if (data.developers && data.developers.length > 0) {
                descriptionHTML += '<div class="game-developers"><strong>Desarrolladores:</strong> ';
                descriptionHTML += data.developers.map(d => d.name).join(', ');
                descriptionHTML += '</div>';
            }
            
            // Añadir editores si están disponibles
            if (data.publishers && data.publishers.length > 0) {
                descriptionHTML += '<div class="game-publishers"><strong>Editores:</strong> ';
                descriptionHTML += data.publishers.map(p => p.name).join(', ');
                descriptionHTML += '</div>';
            }
            
            detailDescription.innerHTML = descriptionHTML;
        } else {
            detailDescription.textContent = 'No se pudo cargar la descripción.';
        }
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        detailDescription.textContent = 'Error al cargar la descripción.';
    }
    
    // Desplazar a los detalles
    gameDetails.scrollIntoView({ behavior: 'smooth' });
}

// Función para reiniciar selecciones
function resetSelections() {
    yourGame = null;
    theirGame = null;
    
    // Limpiar posters
    document.getElementById('your-game-poster').innerHTML = '<div class="selection-indicator">Selecciona un juego</div>';
    document.getElementById('your-game-poster').classList.remove('selected');
    
    document.getElementById('their-game-poster').innerHTML = '<div class="selection-indicator">Selecciona un juego</div>';
    document.getElementById('their-game-poster').classList.remove('selected');
    
    // Actualizar estado de botones
    updateButtonStates();
    
    // Ocultar recomendaciones
    document.getElementById('recommendations-container').style.display = 'none';
    
    // Mostrar notificación
    showNotification('Selecciones reiniciadas. ¡Elige nuevos juegos!', 'info');
    
    // Desplazar al inicio
    document.querySelector('.heart-container').scrollIntoView({ behavior: 'smooth' });
}

// Función debounce para evitar demasiadas llamadas a la API
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}
