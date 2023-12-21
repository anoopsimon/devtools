import { tools } from './tools.js';

document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;


    const cardContainer = document.getElementById('cards');
    tools.forEach(tool => {
        const card = document.createElement('a');
        card.href = tool.link;
        card.className = 'card';
        card.innerHTML = `
            <h2>${tool.name}</h2>
            <p>${tool.description}</p>
        `;
        cardContainer.appendChild(card);
    });
});


