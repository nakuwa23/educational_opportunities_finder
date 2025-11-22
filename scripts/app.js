const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const loadingIndicator = document.getElementById('loading');
const savedSection = document.getElementById('savedSection');
const savedContainer = document.getElementById('savedContainer');

document.addEventListener('DOMContentLoaded', loadSavedItems);

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const keyword = document.getElementById('keyword').value.trim();
    const category = document.getElementById('category').value;
    const country = document.getElementById('country').value.trim();

    if (!keyword) return;

    let query = `${keyword} ${category}`;
    if (country) {
        query += ` ${country}`;
    }

    resultsContainer.innerHTML = '';
    loadingIndicator.classList.remove('hidden');

    const cacheKey = `search_${query}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        console.log('Serving from cache');
        renderResults(JSON.parse(cachedData));
        loadingIndicator.classList.add('hidden');
        return;
    }

    try {
        const results = await fetchGoogleSearchResults(query);
        localStorage.setItem(cacheKey, JSON.stringify(results));
        renderResults(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = `
            <div class="message" style="color: red;">
                <p>Error: ${error.message}</p>
                <p style="font-size: 12px; color: #666;">Ensure you have set your API_KEY and CX (Search Engine ID) in config.js file</p>
            </div>`;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
});

async function fetchGoogleSearchResults(query) {
    if (CONFIG.API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' || CONFIG.CX === 'YOUR_SEARCH_ENGINE_ID_HERE') {
        throw new Error('API Key or Search Engine ID not configured in config.js file');
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.API_KEY}&cx=${CONFIG.CX}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to fetch results');
    }

    const data = await response.json();
    return data.items || [];
}

function renderResults(items) {
    if (items.length === 0) {
        resultsContainer.innerHTML = '<p class="message">No results found. Try typing a different keyword.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <div class="uni-icon">🎓</div>
            <div class="card-content">
                <h3 class="card-title"><a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">${item.title}</a></h3>
                <p class="card-subtitle" style="color: #017d28ff; font-size: 12px;">${item.displayLink}</p>
                <p class="card-subtitle">${item.snippet}</p>
                <a href="${item.link}" target="_blank" class="card-link">View Opportunity &rarr;</a>
                <br>
                <button class="btn-save" onclick='saveItem(${JSON.stringify(item).replace(/'/g, "&#39;")})'>Save</button>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}


function getSavedItems() {
    const saved = localStorage.getItem('savedOpportunities');
    return saved ? JSON.parse(saved) : [];
}

function saveItem(item) {
    const savedItems = getSavedItems();

    if (savedItems.some(saved => saved.link === item.link)) {
        alert('This opportunity is already saved!');
        return;
    }

    savedItems.push(item);
    localStorage.setItem('savedOpportunities', JSON.stringify(savedItems));
    loadSavedItems();
    alert('Opportunity saved!');
}

function removeItem(link) {
    let savedItems = getSavedItems();
    savedItems = savedItems.filter(item => item.link !== link);
    localStorage.setItem('savedOpportunities', JSON.stringify(savedItems));
    loadSavedItems();
}

function loadSavedItems() {
    const savedItems = getSavedItems();
    savedContainer.innerHTML = '';

    if (savedItems.length > 0) {
        savedSection.classList.remove('hidden');
        savedItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.borderLeft = '4px solid #e2b80eff'; 

            card.innerHTML = `
                <div class="card-content">
                    <h3 class="card-title"><a href="${item.link}" target="_blank" style="text-decoration: none; color: inherit;">${item.title}</a></h3>
                    <a href="${item.link}" target="_blank" class="card-link">View Opportunity &rarr;</a>
                    <br>
                    <button class="btn-remove" onclick="removeItem('${item.link}')">Remove</button>
                </div>
            `;
            savedContainer.appendChild(card);
        });
    } else {
        savedSection.classList.add('hidden');
    }
}
