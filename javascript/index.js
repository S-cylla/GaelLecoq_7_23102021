// DOM
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const searchCard = document.querySelectorAll(".search-card")
const listContainer = document.querySelectorAll(".list-container"); // Containers
const ingredientsUl = document.getElementById("ingredients-ul"); // Container des ingrédients
const appliancesUl = document.getElementById("appliances-ul"); // Container des appareils
const ustensilsUl = document.getElementById("ustensils-ul"); // Container des ustensiles
const recipesContainer = document.getElementById("recipes-container"); // Container des recettes

/* fetch ("javascript/recipes.js")
    .then(function(response) {
        if (response.ok) {
            return response.json(); // Renvoie une promesse
        }
    })
    .then(function(value) {
        getRecipes(value)
        console.log(value[0].ingredients)
    })
    .catch(function(err) { // Affichage d'une éventuelle erreur sur la console
        console.log(err)
    }) */

// Récupération des recettes  
const recipesFile = async function() {
    let response = await fetch ("javascript/recipes.js")
    if (response.ok) {
        let value = await response.json()
        getRecipes(value)
    } else {
        console.error("Retour du serveur :", response.status);
    }
}
recipesFile()
    
function getRecipes(recipesList) {
    // Affichage des ingrédients dans la card
    function getIngredients(item) {
        return `<span class="ingredient">${item.ingredient}</span>: ${item.quantity || ""} ${item.unit || ""} <br>`;
    }

    // Affichage des ingrédients
    function getIngredientsList(item) {
        return `<li>${item.ingredient}</li>,`
    }
    
    const ingredientsArray = recipesList.map((recipe)=>{return `
    ${recipe.ingredients.map(getIngredientsList).join(" ").split(",")}
    `})
    const ingredientsStr = ingredientsArray.filter((e,i)=>ingredientsArray.indexOf(e) == i).join(" ").replace(/[, ]+/g, " ")
    ingredientsUl.innerHTML = ingredientsStr || ""
    
    // Affichage des appareils
    const appliancesArray = recipesList.map((recipe)=>{return `<li>${recipe.appliance}</li>`})
    const newAppliancesArray = appliancesArray.filter((e,i)=>appliancesArray.indexOf(e) == i)
    appliancesUl.innerHTML = newAppliancesArray.join(" ") || ""
    
    // Affichage des ustensiles
    function getUstensilsList(item) {
        return `<li>${item}</li>,`
    }
    const ustensilsArray = recipesList.map((recipe)=>{return `
    ${recipe.ustensils.map(getUstensilsList)}
    `}).join(" ").split(",")
    const ustensilsStr = ustensilsArray.filter((e,i)=>ustensilsArray.indexOf(e) == i).join(" ").replace(/[, ]+/g, " ")
    ustensilsUl.innerHTML = ustensilsStr || ""

    //Affichage des recettes
    const recipeHTMLString = recipesList.map((recipe)=>{return `
    <div class="recipe-card">
        <div class="recipe-img"></div>
        <div class="recipe-text">
            <div class="recipe-head">
                <h1>${recipe.name}</h1>
                <span class="time"><i class="far fa-clock"></i> ${recipe.time} min</span>
            </div>
            <div class="recipe-instructions">
                <aside>${recipe.ingredients.map(getIngredients).join(" ")}</aside>
                <article class="description">${recipe.description.substring(0,181)}${recipe.description.length > 181 ? "...":""/* Condition ternaire*/ }</article> 
            </div>
        </div>
    </div>
    `}).join(" ")
    recipesContainer.innerHTML = recipeHTMLString  
}

// Affichage des ingrédients au clic sur le bouton
chevron[0].addEventListener("click", showIngredientsList) 
function showIngredientsList() {
    openCard(searchCard[0]) // Ouverture de la search-card
    closeCard(searchCard[1])
    closeCard(searchCard[2])
}
    
// Affichage des appareils au clic sur le bouton
chevron[1].addEventListener("click", showAppliancesList) 
function showAppliancesList() {
    openCard(searchCard[1]) // Ouverture de la search-card
    closeCard(searchCard[0])
    closeCard(searchCard[2])
}

// Affichage des ustensiles au clic sur le bouton
chevron[2].addEventListener("click", showUstensilsList) 
function showUstensilsList() {
    openCard(searchCard[2]) // Ouverture de la search-card
    closeCard(searchCard[0])
    closeCard(searchCard[1])
}

// Ouverture de la searchCard + retournement chevron
function openCard(searchCard) {
    if (searchCard.classList.contains("active")) {
        searchCard.classList.remove("active")
    } else {
        searchCard.classList.add("active")
    }
}

// Fermeture des cards ouvertes
function closeCard(searchCard) {
    if (searchCard.classList.contains("active")) {
        searchCard.classList.remove("active")
    }
}