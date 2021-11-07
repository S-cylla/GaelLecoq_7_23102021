// DOM
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const listContainer = document.querySelectorAll(".list-container"); // Containers
const ingredientsContainer = document.getElementById("ingredients-container"); // Container des ingrédients
const appliancesContainer = document.getElementById("appliances-container"); // Container des appareils
const ustensilsContainer = document.getElementById("ustensils-container"); // Container des ustensiles
const recipesContainer = document.getElementById("recipes-container"); // Container des recettes

//Évènements
chevron[0].addEventListener("click", showIngredientsList) // Affichage des ingrédients au clic sur le bouton
chevron[1].addEventListener("click", showAppliancesList) // Affichage des appareils au clic sur le bouton
chevron[2].addEventListener("click", showUstensilsList) // Affichage des ustensiles au clic sur le bouton

// Récupération des recettes
fetch ("javascript/recipes.js")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        getRecipes(value)
        
    })
    .catch(function(err) { // Affichage d'une éventuelle erreur sur la console
        console.log(err)
    })

//Fonctions
function getRecipes(recipesList) { //Affichage des recettes
    function getIngredients(item) { // Affichage des ingrédients dans la card
        return [
            `<span class="ingredient">${item.ingredient}</span>:`,
            item.quantity,
            item.unit, `<br>`
        ].join(" ");
    }

    const recipeHTMLString = recipesList.map((recipe)=>{return `
    <div class="recipe-card">
        <div class="recipe-img"></div>
        <div class="recipe-text">
            <div class="recipe-head">
                <h1>${recipe.name}</h1>
                <span class="time"><i class="far fa-clock"></i> ${recipe.time} min</span>
            </div>
            <div class="recipe-instructions">
                <aside>${recipe.ingredients.map(getIngredients)}</aside>
                <article class="description">${recipe.description}</article>
            </div>
        </div>
    </div>
    `}).join(" ")
    recipesContainer.innerHTML = recipeHTMLString   
}

function dropdown(chevron) { //Retournement du chevron des cards au clic
    if (chevron.style.transform == "rotate(180deg)") {
        chevron.style.transform = "";
    } else {
        chevron.style.transform = "rotate(180deg)";
    }
}

function showIngredientsList(recipe) {
    dropdown(chevron[0])
    function ingredientsList(item) {
        return [item.ingredient].join(" ")
    }

    const ingredientsHTMLString = `${recipe.map(ingredientsList)}`
    ingredientsContainer.innerHTML = ingredientsHTMLString
}

function showAppliancesList(recipesList) {
    dropdown(chevron[1])
    const appliancesHTMLString = recipesList.map((recipe)=>{return `
    <span class="appliance">${recipe.appliance}</span>
    `}).join(" ")
    appliancesContainer.innerHTML = appliancesHTMLString
}

function showUstensilsList(recipesList) {
    dropdown(chevron[2])
    const ustensilsHTMLString = recipesList.map((recipe)=>{return `
    <span class="ustensils">${recipe.ustensils}</span>
    `}).join(" ")
    ustensilsContainer.innerHTML = ustensilsHTMLString
}
/* // Retournement du chevron des cards au clic
for (let i = 0; i < chevron.length; i++) {
    const element = chevron[i];
    element.addEventListener("click", dropdown)
    function dropdown() {
        if (element.style.transform == "rotate(180deg)") {
            element.style.transform = "";
        } else {
            element.style.transform = "rotate(180deg)";
        }
    }
}*/