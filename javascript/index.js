// DOM
const searchBarInput = document.getElementById("search"); // Input de la barre de recherche
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const searchCard = document.querySelectorAll(".search-card")
const listContainer = document.querySelectorAll(".list-container"); // Containers
const ingredientsUl = document.getElementById("ingredients-ul"); // Container des ingrédients
const appliancesUl = document.getElementById("appliances-ul"); // Container des appareils
const ustensilsUl = document.getElementById("ustensils-ul"); // Container des ustensiles
const recipesContainer = document.getElementById("recipes-container"); // Container des recettes

// Récupération des recettes  
const recipesFile = async function() {
    let response = await fetch ("javascript/recipes.js")
    if (response.ok) {
        let recipes = await response.json()
        getRecipes(recipes)
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

    // Affichage des ingrédients pour la search-card "Ingrédients"
    function getIngredientsList(item) {
        return `<li>${item.ingredient}</li>,`
    }
    
    const ingredientsArr = recipesList.map((recipe)=>{
        return `${recipe.ingredients.map(getIngredientsList).join(" ").split(",")}`
    })
    const ingredientsHTMLString = ingredientsArr.filter((e,i)=>ingredientsArr.indexOf(e) == i).join(" ").replace(/[, ]+/g, " ")
    ingredientsUl.innerHTML = ingredientsHTMLString || ""
    
    // Affichage des appareils dans la search-card "Appareils"
    const appliancesArray = recipesList.map((recipe)=>{
        return `<li>${recipe.appliance}</li>`
    })
    const appliancesHTMLString = appliancesArray.filter((e,i)=>appliancesArray.indexOf(e) == i).join(" ")
    appliancesUl.innerHTML = appliancesHTMLString || ""
    
    // Affichage des ustensiles dans la search-card "Ustensiles"
    function getUstensilsList(item) {
        return `<li>${item}</li>`
    }
    const ustensilsHTMLString = recipesList.map((recipe)=>{
        return `${recipe.ustensils.map(getUstensilsList).join(" ")}`
    }).join(" ")
    ustensilsUl.innerHTML = ustensilsHTMLString || ""

    //Affichage des recettes sur la page
    const recipeArray = recipesList.map((recipe)=>{return `
    <div class="recipe-card">
        <div class="recipe-img"></div>
        <div class="recipe-text">
            <div class="recipe-head">
                <h1>${recipe.name}</h1>
                <span class="time"><i class="far fa-clock"></i> ${recipe.time} min</span>
            </div>
            <div class="recipe-instructions">
                <aside>${recipe.ingredients.map(getIngredients).join(" ")}</aside>
                <article class="description">${recipe.description.substring(0,181)}${recipe.description.length > 181 ? "...":""}</article> 
            </div>
        </div>
    </div>
    `})
    let recipeHTMLString = recipeArray.join(" ")
    recipesContainer.innerHTML = recipeHTMLString
    console.log(recipesList);
    
    // Filtrage des recettes avec la search-bar
    searchBarInput.addEventListener("input", recipeFilter)
    function recipeFilter() {
        if (searchBarInput.value.length >= 3) {
            let searchArray = []
            for (let i = 0; i < recipeArray.length; i++) {
                const element = recipeArray[i];
                let research = searchBarInput.value.toLowerCase()
                if (element.toLowerCase().includes(research)) {
                    searchArray.push(element)
                }
            }
            if (searchArray.length === 0) {
                recipesContainer.innerHTML = "Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.";
            } else {
                recipesContainer.innerHTML = searchArray.join(" ")
            }
        } else {
            recipesContainer.innerHTML = recipeHTMLString
        }
    }
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
    searchCard.classList.toggle("active")
}

// Fermeture des cards ouvertes
function closeCard(searchCard) {
    if (searchCard.classList.contains("active")) {
        searchCard.classList.remove("active")
    }
}