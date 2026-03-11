const params = new URLSearchParams(window.location.search)
const recipeId = params.get('id')
const themeSwitch = document.getElementById('theme-switch')

let darkmode = localStorage.getItem('darkmode')
const enableDarkmode = () => document.body.classList.add('darkmode')
const disableDarkmode = () => document.body.classList.remove('darkmode')
if(darkmode === "active") enableDarkmode()

    const style = document.createElement('style')
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-40px) rotate(180deg); }
    }
`
document.head.appendChild(style)

const createParticles = () => {
    const darkcolors = ['#ffd166', '#a8c573', '#f4b876', '#7ec850', '#ffb347', '#90d45a']
    const lightcolors = ['#dd9c02', '#6A994E', '#c47a00', '#4a7c2f', '#e8a020', '#5a8a3e']

    const isDark = document.body.classList.contains('darkmode')
    const colors = isDark ? darkcolors : lightcolors

    document.querySelectorAll('.particle').forEach(p => p.remove())
    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.cssText = `
            position: fixed;
            width: ${4 + Math.random() * 6}px;
            height: ${4 + Math.random() * 6}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.3 + Math.random() * 0.4};
            animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 0;
        `
        document.body.appendChild(particle)
    }
}

createParticles()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    if(darkmode !== "active"){
        enableDarkmode()
        localStorage.setItem('darkmode', 'active')
    } else {
        disableDarkmode()
        localStorage.setItem('darkmode', null)
    }
    createParticles()
})

const hamburger = document.getElementById('hamburger')
const navRight = document.getElementById('nav-right')
hamburger.addEventListener('click', () => navRight.classList.toggle('active'))

fetch('https://kitchenpal.onrender.com/get-recipe', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ id: recipeId })
})
.then(response => response.json())
.then(data => {
    document.getElementById('recipe-title').textContent = data.title
    document.getElementById('recipe-img').src = data.image
    document.getElementById('recipe-time').innerHTML = `⏱️ Ready in: ${data.readyInMinutes} minutes`
    document.getElementById('recipe-servings').innerHTML = `🍽️ Servings: ${data.servings}`

    data.extendedIngredients.forEach(ingredient => {
        const li = document.createElement('li')
        li.textContent = ingredient.original.length > 40 ? ingredient.original.slice(0, 40) + "..." : ingredient.original
        document.getElementById('ingredients-list').appendChild(li)
    })

    const instructionsList = document.getElementById('instructions-list')
    if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
    data.analyzedInstructions.forEach(group => {
        group.steps.forEach(step => {
            const li = document.createElement('li')
            li.textContent = step.step
            instructionsList.appendChild(li)
        })
    })
    } else if (data.instructions) {
        const sentences = data.instructions
            .replace(/<[^>]*>/g, '')
            .split(/(?<=[.!?])\s+/)
            .filter(s => s.trim().length > 0)
        sentences.forEach(sentence => {
            const li = document.createElement('li')
            li.textContent = sentence.trim()
            instructionsList.appendChild(li)
        })
    } else {
        instructionsList.innerHTML = '<li>No instructions available for this recipe 😔</li>'
    }
})
const gachaBtn = document.getElementById('gacha-btn')

gachaBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = 'home.html?gacha=true'
})

fetch('https://kitchenpal.onrender.com/random-recipes')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('suggested-container')
        data.results.forEach(recipe => {
            const card = document.createElement('div')
            card.className = 'suggested-card'
            card.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <a href="recipe.html?id=${recipe.id}">
                    <button class="card-Btn">View Recipe</button>
                </a>
            `
            container.appendChild(card)
        })
    })

document.getElementById('fav-btn').addEventListener('click', (e) => {
    e.preventDefault()
    alert('Favorites — Coming Soon!! 🌟')
})

document.getElementById('profile-btn').addEventListener('click', (e) => {
    e.preventDefault()
    alert('Profile — Coming Soon!! 🌟')
})

