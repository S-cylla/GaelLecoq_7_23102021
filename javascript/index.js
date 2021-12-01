// DOM
const searchbarInput = document.getElementById("search"); // Input de la barre de recherche
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const searchCard = document.querySelectorAll(".search-card"); // Search-cards Ingrédients, Appareil, Ustensiles
const itemFilters = document.querySelectorAll(".item-filters"); // Div où apparaissent les items cliqués
const filteredIngredient = document.getElementById("filtered-ingredient"); // Résultat de la recherche d'ingrédient
const filteredAppliance = document.getElementById("filtered-appliance"); // Résultat de la recherche d'appareils
const filteredUstensil = document.getElementById("filtered-ustensil"); // Résultat de la recherche d'ustensiles
const closeButton = document.querySelectorAll(".close-button"); // Croix de fermeture des items filtrés
const ingredientsInput = document.getElementById("ingredients"); // Input de la search-card "Ingredients"
const appliancesInput = document.getElementById("appareil"); // Input de la search-card "Appareil"
const ustensilsInput = document.getElementById("ustensiles"); // Input de la search-card "Ustensiles"
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
    
function getRecipes(recipes) {
    // Affichage des ingrédients dans la card
    function getIngredients(item) {
        return `<span class="ingredient">${item.ingredient}</span>: ${item.quantity || ""} ${item.unit || ""} <br>`;
    }

    //Affichage des recettes sur la page
    const recipeArray = recipes.map( recipe => { return `
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
    
    
    // Filtrage des recettes avec la search-bar
    function getIngredientsList(item) {
        return `<li class="ingredients-result">${item.ingredient}</li>`
    }

    searchbarInput.addEventListener("input", recipeFilter)
    function recipeFilter() {
        if (searchbarInput.value.length >= 3) { // À partir de 3 caractères
            let searchArray = [] // Crée un tableau
            recipeArray.forEach(element => {
                let research = searchbarInput.value.toLowerCase() // Récupère le résultat de la recherche
                if (element.toLowerCase().includes(research)) {
                    searchArray.push(element) // Insère la recette dans le tableau créé
                }
            })
            if (searchArray.length === 0) { // Si aucune recette n'a été mise dans le tableau
                recipesContainer.innerHTML = "Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.";
            } else { // Sinon (si au moins une recette correspond)
                recipesContainer.innerHTML = searchArray.join(" ")
                console.log(searchArray[0]);
            }
        } else { // Si l'input comprend moins de 3 caractères
            recipesContainer.innerHTML = recipeHTMLString // Affichage de toutes les recettes
        }
    }

    // Affichage des ingrédients pour la search-card "Ingrédients"
    const ingredientsArray = recipes.reduce((ingredientsArray, recipe)=>{
        return [...ingredientsArray, ...recipe.ingredients.map(getIngredientsList)]
    }, [])
    let ingredientsFilteredArray = ingredientsArray.filter((e,i)=>ingredientsArray.indexOf(e) == i)
    let ingredientsHTMLString = ingredientsFilteredArray.join("")
    ingredientsUl.innerHTML = ingredientsHTMLString || "" 
    
    //Filtrage des ingredients
    ingredientsInput.addEventListener("input", ingredientsFilter) 
    function ingredientsFilter() {
        if (ingredientsInput.value.length >= 3) { // À partir de 3 caractères
            if (!searchCard[0].classList.contains("active")) { // Si la liste n'est pas affichée
                searchCard[0].classList.add("active") // Ouvre la liste
            }
            let newIngredientsFilterArray = [] // Crée un tableau
            ingredientsFilteredArray.forEach(element => { // Itère sur les éléments du tableau des ingrédients
                let research = ingredientsInput.value.toLowerCase() // Récupère le résultat de la recherche
                if (element.toLowerCase().includes(research)) { // Si un élément correspond à la recherche
                    newIngredientsFilterArray.push(element) // Insère l'élément dans le tableau créé
                }
            })
            ingredientsUl.innerHTML = newIngredientsFilterArray.join(" ") // Affiche les résultats de la recherche
        } else { // Si la recherche comprend moins de 3 caractères
            ingredientsUl.innerHTML = ingredientsHTMLString || "" // Affichage complet de la liste
        }
    }


    // Affichage de l'ingrédient sélectionné
    function addFilteredIngredient() {
        const ingredientsResult = document.querySelectorAll(".ingredients-result") // Ingrédients de la liste
        /* for (let i = 0; i < ingredientsResult.length; i++) {
            ingredientsResult[i].addEventListener("click", addItem)
            function addItem(ingredient) {
                itemFilters[0].classList.add("active")
                let itemString = ingredient.target.outerText
                filteredIngredient.innerHTML = itemString
                closeCard(searchCard[0])
            }
        } */
        ingredientsResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(ingredient) {
                itemFilters[0].classList.add("active")
                let itemString = ingredient.target.outerText
                filteredIngredient.innerHTML = itemString
                closeCard(searchCard[0])
            }
        })
    }
    addFilteredIngredient()
    
    // Affichage des appareils dans la search-card "Appareils"
    const appliancesArray = recipes.map(recipe =>{
        return `<li class="appliances-result">${recipe.appliance}</li>`
    })
    let appliancesFilteredArray = appliancesArray.filter((e,i)=>appliancesArray.indexOf(e) == i)
    const appliancesHTMLString = appliancesFilteredArray.join(" ")
    appliancesUl.innerHTML = appliancesHTMLString || ""

    // Affichage de l'appareil sélectionné
    function addFilteredAppliance() {
        const appliancesResult = document.querySelectorAll(".appliances-result") // Appareils de la liste
        /* for (let i = 0; i < appliancesResult.length; i++) {
            appliancesResult[i].addEventListener("click", addItem)
            function addItem(appliance) {
                itemFilters[1].classList.add("active")
                let itemString = appliance.target.outerText
                filteredAppliance.innerHTML = itemString
                closeCard(searchCard[1])
            }
        } */
        appliancesResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(appliance) {
                itemFilters[1].classList.add("active")
                let itemString = appliance.target.outerText
                filteredAppliance.innerHTML = itemString
                closeCard(searchCard[1])
            }
        })
    }
    addFilteredAppliance()
    
    //Filtrage des appareils
    appliancesInput.addEventListener("input", appliancesFilter) 
    function appliancesFilter() {
        if (appliancesInput.value.length >= 3) { // À partir de 3 caractères
            if (!searchCard[1].classList.contains("active")) { // Si la liste n'est pas affichée
                searchCard[1].classList.add("active") // Ouvre la liste
            }
            let newAppliancesFilterArray = [] // Crée un tableau
            /* for (let i = 0; i < appliancesFilteredArray.length; i++) { // Boucle sur les éléments du tableau des appareils
                const element = appliancesFilteredArray[i]; // Pour chaque élément
                let research = appliancesInput.value.toLowerCase() // Mot-clé de la recherche
                if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                    newAppliancesFilterArray.push(element) // Insère l'élément dans le tableau
                }
            } */
            appliancesFilteredArray.forEach(element => {
                let research = appliancesInput.value.toLowerCase() // Mot-clé de la recherche
                if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                    newAppliancesFilterArray.push(element) // Insère l'élément dans le tableau
                }
            })
            appliancesUl.innerHTML = newAppliancesFilterArray.join(" ") // Affiche les résultats de la recherche
        } else { // Si la recherche comprend moins de 3 caractères
            appliancesUl.innerHTML = appliancesHTMLString || "" // Affichage complet de la liste
        }
    }
    
    // Affichage des ustensiles dans la search-card "Ustensiles"
    const ustensilsArray = recipes.reduce((ustensilsArray, recipe)=>{
        return [...ustensilsArray, ...recipe.ustensils]
    }, [])
    let ustensilsFilteredArray = ustensilsArray.filter((e,i)=>ustensilsArray.indexOf(e) == i)
    let ustensilsHTMLString = ustensilsFilteredArray.map(item =>{
        return `<li class="ustensils-result">${item}</li>`
    }).join("")
    ustensilsUl.innerHTML = ustensilsHTMLString || ""

    // Affichage de l'ustensile sélectionné
    function addFilteredUstensil() {
        const ustensilsResult = document.querySelectorAll(".ustensils-result") //Ustensiles de la liste
        /* for (let i = 0; i < ustensilsResult.length; i++) {
            ustensilsResult[i].addEventListener("click", addItem)
            function addItem(ustensil) {
                itemFilters[2].classList.add("active")
                let itemString = ustensil.target.outerText
                filteredUstensil.innerHTML = itemString
                closeCard(searchCard[2])
            }
        } */
        ustensilsResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(ustensil) {
                itemFilters[2].classList.add("active")
                let itemString = ustensil.target.outerText
                filteredUstensil.innerHTML = itemString
                closeCard(searchCard[2])
            }
        })
    }
    addFilteredUstensil()

    //Filtrage des ustensils
    ustensilsInput.addEventListener("input", ustensilsFilter) 
    function ustensilsFilter() {
        if (ustensilsInput.value.length >= 3) { // À partir de 3 caractères
            if (!searchCard[2].classList.contains("active")) { // Si la liste n'est pas affichée
                searchCard[2].classList.add("active") // Ouvre la liste
            }
            let newUstensilsFilterArray = [] // Crée un tableau
            /* for (let i = 0; i < ustensilsFilteredArray.length; i++) { // Boucle sur les éléments du tableau des ustensiles
                const element = ustensilsFilteredArray[i]; // Pour chaque élément
                let research = ustensilsInput.value.toLowerCase() // Mot-clé de la recherche
                if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                    newUstensilsFilterArray.push(element) // Insère l'élément dans le tableau
                }
            } */
            ustensilsFilteredArray.forEach(element => {
                let research = ustensilsInput.value.toLowerCase() // Mot-clé de la recherche
                if (element.toLowerCase().includes(research)) { // Isole l'élément correspondant à la recherche
                    newUstensilsFilterArray.push(element) // Insère l'élément dans le tableau
                }
            })
            ustensilsUl.innerHTML = newUstensilsFilterArray.join(" ") // Affiche les résultats de la recherche
        } else { // Si la recherche comprend moins de 3 caractères
            ustensilsUl.innerHTML = ustensilsHTMLString || "" // Affichage complet de la liste
        }
    }
}

// Affichage des ingrédients au clic sur le bouton
chevron[0].addEventListener("click", showIngredientsList) 
function showIngredientsList() {
    if (searchCard[0].classList.contains("active")) {
        ingredientsInput.placeholder = "Ingrédients"
    } else {
        ingredientsInput.placeholder = "Rechercher un ingrédient"
    }
    openCard(searchCard[0])
    closeCard(searchCard[1])
    appliancesInput.placeholder = "Appareil"
    closeCard(searchCard[2])
    ustensilsInput.placeholder = "Ustensiles"
}
    
// Affichage des appareils au clic sur le bouton
chevron[1].addEventListener("click", showAppliancesList) 
function showAppliancesList() {
    if (searchCard[1].classList.contains("active")) {
        appliancesInput.placeholder = "Appareil"
    } else {
        appliancesInput.placeholder = "Rechercher un appareil"
    }
    openCard(searchCard[1]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = "Ingrédients"
    closeCard(searchCard[2])
    ustensilsInput.placeholder = "Ustensiles"
}

// Affichage des ustensiles au clic sur le bouton
chevron[2].addEventListener("click", showUstensilsList) 
function showUstensilsList() {
    if (searchCard[2].classList.contains("active")) {
        ustensilsInput.placeholder = "Ustensiles"
    } else {
        ustensilsInput.placeholder = "Rechercher un ustensile"
    }
    openCard(searchCard[2]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = "Ingrédients"
    closeCard(searchCard[1])
    appliancesInput.placeholder = "Appareil"
}

// Fermeture des div des items filtrés
closeButton[0].addEventListener("click", closeIngredientDiv)
function closeIngredientDiv() {
    itemFilters[0].classList.remove("active")
}
closeButton[1].addEventListener("click", closeApplianceDiv)
function closeApplianceDiv() {
    itemFilters[1].classList.remove("active")
}
closeButton[2].addEventListener("click", closeUstensilDiv)
function closeUstensilDiv() {
    itemFilters[2].classList.remove("active")
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
