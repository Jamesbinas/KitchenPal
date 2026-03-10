
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}

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
    for (let i = 0; i < 50; i++) {
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
    if(darkmode!== "active"){
        enableDarkmode()
    }
    else{
        disableDarkmode()
    }
    createParticles()
})

const gachaBtn = document.getElementById('gacha-btn')

gachaBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const heading = document.getElementById('suggested-heading')
    const container = document.getElementById('card-container')

    heading.style.display = 'block'
    heading.textContent = '🎰 Gacha Recipes!!'
    container.innerHTML = '<p style="text-align:center; color: var(--para-color)">Rolling... 🎲</p>'

    fetch('https://kitchenpal.onrender.com/random-recipes')
        .then(res => res.json())
        .then(data => {
            container.innerHTML = ''
            data.results.forEach(recipe => {
                const card = document.createElement('div')
                card.className = 'home-cards'
                card.innerHTML = `
                    <img class="home-img" src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <div class="Tags">
                        ${recipe.extendedIngredients.slice(0,5).map(i => `<span>${i.name}</span>`).join('')}
                    </div>
                    <a href="recipe.html?id=${recipe.id}">
                        <button class="card-Btn">View Recipe</button>
                    </a>
                `
                container.appendChild(card)
            })
        })
})
let ingredientsList = []

const overlay = document.getElementById('overlay')
const popup = document.getElementById('popup')
const closeBtn = document.getElementById('close-btn')
const addBtn = document.getElementById('add-btn')
const ingredientInput = document.getElementById('ingredient-input')
const addIngredientBtn = document.getElementById('add-ingredient-btn')
const tagsContainer = document.getElementById('ingredient-tags')

addBtn.addEventListener('click', () => {
    overlay.classList.add('active')
    popup.classList.add('active')
})

const closePopup = (keepIngredients = false) => {
    overlay.classList.remove('active')
    popup.classList.remove('active')
    if (!keepIngredients) {
        tagsContainer.innerHTML = ''
        ingredientsList = []
    }
}

closeBtn.addEventListener('click', closePopup)
overlay.addEventListener('click', closePopup)

const addTag = () => {
    const value = ingredientInput.value.trim()
    if (!value) return
    ingredientsList.push(value)
    const tag = document.createElement('div')
    tag.className = 'tag'
    tag.innerHTML = `${value} <button onclick="removeTag(this)">✕</button>`
    tagsContainer.appendChild(tag)
    ingredientInput.value = ''
    ingredientInput.focus()
}

const removeTag = (btn) => {
    const tagText = btn.parentElement.firstChild.textContent.trim()
    ingredientsList = ingredientsList.filter(i=> i !== tagText)
    btn.parentElement.remove()
}
addIngredientBtn.addEventListener('click', addTag)
ingredientInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTag()
})

const hamburger = document.getElementById('hamburger')
const navRight = document.getElementById('nav-right')

hamburger.addEventListener('click', () => {
    navRight.classList.toggle('active')
})

const displayResults = (recipes) => {
    const container = document.getElementById('card-container')
    const heading = document.getElementById('suggested-heading')
    heading.style.display = 'none'
    container.innerHTML = ''

    if (recipes.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--para-color)">No recipes found! Try different ingredients 🥺</p>'
        return
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div')
        card.className = 'home-cards'
        card.innerHTML = `
        <img class="home-img" src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title.length > 40 ? recipe.title.slice(0, 40) + "..." : recipe.title}</h3>
        <div class="Tags">
            ${recipe.missedIngredients.map(i => `<span>${i.name}</span>`).join('')}
        </div>
        <a href="recipe.html?id=${recipe.id}">
            <button class="card-Btn">View Recipe</button>
        </a>
    `
        container.appendChild(card)
    })
}
const findRecipesBtn = document.getElementById('find-recipes-btn')

findRecipesBtn.addEventListener('click', () => {
    container.innerHTML = '<p style="text-align:center; color: var(--par-color)">Waking up the server, please wait...</p>'
    if(ingredientsList.length === 0) {
        alert('Please add at least one ingredient first! 🥺') 
       return
    }
    findRecipesBtn.textContent = 'Searching... 🔍'
    findRecipesBtn.disabled = true

    fetch('https://kitchenpal.onrender.com/find-recipes', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({ ingredients: ingredientsList})
        })
        .then(responce => responce.json())
        .then(data => {
            console.log(data.results)
            displayResults(data.results)
            closePopup(true)
            findRecipesBtn.textContent = 'Find Recipes 🍳'
            findRecipesBtn.disabled = false
        })
} )

const loadSuggestedRecipes = () => {
    const saved = localStorage.getItem('suggestedRecipes')
    const savedTime = localStorage.getItem('suggestedTime')
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    if (saved && savedTime && (now - savedTime) < twentyFourHours) {
        displayRandomResults(JSON.parse(saved))
        return
    }
container.innerHTML = '<p style="text-align:center; color: var(--par-color)">Waking up the server, please wait...</p>'
    fetch('https://kitchenpal.onrender.com/random-recipes')
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('suggestedRecipes', JSON.stringify(data.results))
            localStorage.setItem('suggestedTime', now)
            displayRandomResults(data.results)
        })
}
if (new URLSearchParams(window.location.search).get('gacha') === 'true') {
    const heading = document.getElementById('suggested-heading')
    const container = document.getElementById('card-container')

    heading.style.display = 'block'
    heading.textContent = '🎰 Gacha Recipes!!'
    container.innerHTML = '<p style="text-align:center; color: var(--para-color)">Rolling... 🎲</p>'

    fetch('https://kitchenpal.onrender.com/random-recipes')
        .then(res => res.json())
        .then(data => {
            container.innerHTML = ''
            data.results.forEach(recipe => {
                const card = document.createElement('div')
                card.className = 'home-cards'
                card.innerHTML = `
                    <img class="home-img" src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title.length > 40 ? recipe.title.slice(0, 40) + "..." : recipe.title}</h3>
                    <div class="Tags">
                        ${recipe.extendedIngredients.slice(0,5).map(i => `<span>${i.name}</span>`).join('')}
                    </div>
                    <a href="recipe.html?id=${recipe.id}">
                        <button class="card-Btn">View Recipe</button>
                    </a>
                `
                container.appendChild(card)
            })
        })
}

const displayRandomResults = (recipes) => {
    const container = document.getElementById('card-container')
    const heading = document.getElementById('suggested-heading')
    heading.style.display = 'block'
    container.innerHTML = ''

    recipes.forEach(recipe => {
        const card = document.createElement('div')
        card.className = 'home-cards'
        card.innerHTML = `
            <img class="home-img" src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <div class="Tags">
                ${recipe.extendedIngredients.slice(0,5).map(i => `<span>${i.name}</span>`).join('')}
            </div>
            <a href="recipe.html?id=${recipe.id}">
                <button class="card-Btn">View Recipe</button>
            </a>
        `
        container.appendChild(card)
    })
}
container.innerHTML = '<p style="text-align:center; color: var(--par-color)">Waking up the server, please wait...</p>'
loadSuggestedRecipes()

document.getElementById('fav-btn').addEventListener('click', (e) => {
    e.preventDefault()
    alert('Favorites — Coming Soon!! 🌟')
})

document.getElementById('profile-btn').addEventListener('click', (e) => {
    e.preventDefault()
    alert('Profile — Coming Soon!! 🌟')
})
const scanBtn = document.getElementById('scan-btn')
const cameraInput = document.createElement('input')
cameraInput.type = 'file'
cameraInput.accept = 'image/*'
cameraInput.capture = 'environment'

scanBtn.addEventListener('click', () => {
    alert ("Scan feature coming soon ")

   /*cameraInput.click()
})

cameraInput.addEventListener('change', () => {
    const file = cameraInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        scanBtn.textContent = 'Scanning... 🔍'
        scanBtn.disabled = true

        fetch('https://kitchenpal.onrender.com/scan-ingredients', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ image: base64 })
        })
        .then(response => response.json())
        .then(data => {
            data.ingredients.forEach(ingredient => {
                if (!ingredientsList.includes(ingredient)) {
                    ingredientsList.push(ingredient)
                    const tag = document.createElement('div')
                    tag.className = 'tag'
                    tag.innerHTML = `${ingredient} <button onclick="removeTag(this)">✕</button>`
                    tagsContainer.appendChild(tag)
                }
            })
            overlay.classList.add('active')
            popup.classList.add('active')
            scanBtn.textContent = 'Scan Ingredients'
            scanBtn.disabled = false
        })
    }*/
}) 

