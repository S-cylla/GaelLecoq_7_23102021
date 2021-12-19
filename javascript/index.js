// DOM
const searchbarInput = document.getElementById("search"); // Input de la barre de recherche
const chevron = document.querySelectorAll(".fa-chevron-down"); // Chevrons des boutons
const searchCard = document.querySelectorAll(".search-card"); // Search-cards Ingrédients, Appareil, Ustensiles
const itemFilters = document.querySelectorAll(".item-filters"); // Div où apparaissent les items cliqués
const filters = document.getElementById("filters"); // Résultat de la recherche d'ingrédient
const filteredAppliance = document.getElementById("filtered-appliance"); // Résultat de la recherche d'appareils
const filteredUstensil = document.getElementById("filtered-ustensil"); // Résultat de la recherche d'ustensiles
const ingredientsInput = document.getElementById("ingredients"); // Input de la search-card "Ingredients"
const appliancesInput = document.getElementById("appareil"); // Input de la search-card "Appareil"
const ustensilsInput = document.getElementById("ustensiles"); // Input de la search-card "Ustensiles"
const listContainer = document.querySelectorAll(".list-container"); // Containers
const ingredientsUl = document.getElementById("ingredients-ul"); // Container des ingrédients
const appliancesUl = document.getElementById("appliances-ul"); // Container des appareils
const ustensilsUl = document.getElementById("ustensils-ul"); // Container des ustensiles
const recipesContainer = document.getElementById("recipes-container"); // Container des recettes

// Variables
let ingredientsHTMLString = ""
let appliancesHTMLString = ""
let ustensilsHTMLString = ""

let selectedTags = []


// Récupération des recettes  
const recipesFile = async function() {
    let response = await fetch ("javascript/recipes.js")
    if (response.ok) {
        let recipes = await response.json()
        getRecipes(recipes)
    } else {
        console.error(`Retour du serveur :`, response.status);
    }
}
recipesFile()

chevron[0].addEventListener("click", showIngredientsList) // Affichage des ingrédients au clic sur le bouton
chevron[1].addEventListener("click", showAppliancesList) // Affichage des appareils au clic sur le bouton
chevron[2].addEventListener("click", showUstensilsList) // Affichage des ustensiles au clic sur le bouton

    
function getRecipes(recipes) {

    // *******************************************************************************
    // ********************************** FONCTIONS **********************************
    // *******************************************************************************

    searchbarInput.addEventListener("input", function (event) {
        recipeFilter(event)
    }) // Filtrage des recettes avec la search-bar

    addIngredientsList(recipes) // Affichage des ingrédients pour la search-card "Ingrédients"
    ingredientsInput.addEventListener("input", ingredientsFilter) //Filtrage des ingredients
    addFilteredIngredient() // Affichage de l'ingrédient sélectionné


    addAppliancesList(recipes) // Affichage des appareils dans la search-card "Appareils"
    addFilteredAppliance() // Affichage de l'appareil sélectionné
    appliancesInput.addEventListener("input", appliancesFilter) //Filtrage des appareils

    addUstensilslist(recipes) // Affichage des ustensiles dans la search-card "Ustensiles"
    addFilteredUstensil() // Affichage de l'ustensile sélectionné
    ustensilsInput.addEventListener("input", ustensilsFilter) //Filtrage des ustensiles


    // ****************************************************************************
    // ********************************* RECETTES *********************************
    // ****************************************************************************

    // Affichage des ingrédients dans la card recette
    function getIngredients(item) {
        return `<span class="ingredient">${item.ingredient}</span>: ${item.quantity || ""} ${item.unit || ""} <br>`;
    }

    //Affichage des recettes sur la page
    const recipeArray = recipes.map( recipe => { 
        return { recipe: recipe, html: `
        <div class="recipe-card" data-id="${recipe.id}">
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
        `
        }
    })
    let recipeHTMLString = ""
    recipeArray.forEach((recipe) => (recipeHTMLString += recipe.html))
    recipesContainer.innerHTML = recipeHTMLString

    // ****************************************************************************
    // ****************************** INGRÉDIENTS *********************************
    // ****************************************************************************

    // Affichage des ingrédients pour la search-card "Ingrédients"
    function addIngredientsList(recipes) {
        ingredientsUl.innerHTML = ""
        const ingredientsArray = recipes.reduce((ingredientsArray, recipe)=>{
            return [...ingredientsArray, ...recipe.ingredients.map(getIngredientsList)]
        }, [])
        ingredientsFilteredArray = ingredientsArray.filter((e,i)=>ingredientsArray.indexOf(e) == i)
        ingredientsHTMLString = ingredientsFilteredArray.join("")
        ingredientsUl.innerHTML = ingredientsHTMLString || "" 
    }
    function getIngredientsList(item) {
        return `<li class="ingredients-result">${item.ingredient}</li>`
    }

    //Filtrage des ingredients
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
        addFilteredIngredient()
    }


    // Affichage de l'ingrédient sélectionné
    function addFilteredIngredient() {
        const ingredientsResult = document.querySelectorAll(".ingredients-result") // Ingrédients de la liste
        /* for (let i = 0; i < ingredientsResult.length; i++) {
            ingredientsResult[i].addEventListener("click", addItem)
            function addItem(ingredient) {
                itemFilters[0].classList.add("active")
                let itemString = ingredient.target.innerText
                filters.innerHTML = itemString
                closeCard(searchCard[0])
            }
        } */
        ingredientsResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(eventIngredient) {
                let itemString = eventIngredient.target.innerText // Crée une variable contenant le texte de l'item cliqué
                let ingredientsFilter = document.createElement("div") // Crée la div du filtre
                ingredientsFilter.classList.add("item-filters") // Ajoute les classes
                ingredientsFilter.classList.add("ingredients-filter")
                ingredientsFilter.classList.add("active")
                ingredientsFilter.innerHTML = `
                <div class="filtered-item">${itemString}</div>
                <i class="far fa-times-circle close-button"></i>
                `
                filters.appendChild(ingredientsFilter) // Insère le filtre dans sa div
                selectedTags.push(itemString)
                recipeFilter(eventIngredient, "tag")
                closeFilter()
                closeCard(searchCard[0])
                ingredientsInput.placeholder = `Ingrédients`
            }
        })
    }

    // *******************************************************************************
    // ********************************** APPAREILS **********************************
    // *******************************************************************************

    // Affichage des appareils dans la search-card "Appareils"
    function addAppliancesList(recipes) {
        appliancesUl.innerHTML = ""
        const appliancesArray = recipes.map(recipe =>{
            return `<li class="appliances-result">${recipe.appliance}</li>`
        })
        const appliancesFilteredArray = appliancesArray.filter((e,i)=>appliancesArray.indexOf(e) == i)
        appliancesHTMLString = appliancesFilteredArray.join(" ")
        appliancesUl.innerHTML = appliancesHTMLString || ""    
    }   
        
    //Filtrage des appareils
    function appliancesFilter() {
        if (appliancesInput.value.length >= 3) { // À partir de 3 caractères
            if (!searchCard[1].classList.contains("active")) { // Si la liste n'est pas affichée
                searchCard[1].classList.add("active") // Ouvre la liste
            }
            addAppliancesList(recipes)
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
        addFilteredAppliance()
    }
 

    // Affichage de l'appareil sélectionné
    function addFilteredAppliance() {
        const appliancesResult = document.querySelectorAll(".appliances-result") // Appareils de la liste
        /* for (let i = 0; i < appliancesResult.length; i++) {
            appliancesResult[i].addEventListener("click", addItem)
            function addItem(appliance) {
                itemFilters[1].classList.add("active")
                let itemString = appliance.target.innerText
                filteredAppliance.innerHTML = itemString
                closeCard(searchCard[1])
            }
        } */
        appliancesResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(eventAppliance) {
                let itemString = eventAppliance.target.innerText // Crée une variable contenant le texte de l'item cliqué
                let appliancesFilter = document.createElement("div") // Crée la div du filtre
                appliancesFilter.classList.add("item-filters") // Ajoute les classes
                appliancesFilter.classList.add("appliances-filter")
                appliancesFilter.classList.add("active")
                appliancesFilter.innerHTML = `
                <div class="filtered-item">${itemString}</div>
                <i class="far fa-times-circle close-button"></i>
                `
                filters.appendChild(appliancesFilter) // Insère le filtre dans sa div
                selectedTags.push(itemString)
                recipeFilter(eventAppliance, "tag")
                closeFilter()
                closeCard(searchCard[1])
                appliancesInput.placeholder = `Appareils`
            }
        })
    }

    // ********************************************************************************
    // ********************************** USTENSILES **********************************
    // ********************************************************************************

    // Affichage des ustensiles dans la search-card "Ustensiles"
    function addUstensilslist(recipes) {
        ustensilsUl.innerHTML = ""
        const ustensilsArray = recipes.reduce((ustensilsArray, recipe)=>{
            return [...ustensilsArray, ...recipe.ustensils]
        }, [])
        let ustensilsFilteredArray = ustensilsArray.filter((e,i)=>ustensilsArray.indexOf(e) == i)
        let ustensilsHTMLString = ustensilsFilteredArray.map(item =>{
            return `<li class="ustensils-result">${item}</li>`
        })
        ustensilsUl.innerHTML = ustensilsHTMLString.join(" ") || "" 
        return ustensilsHTMLString
    }
    
    //Filtrage des ustensiles
    function ustensilsFilter() {
        if (ustensilsInput.value.length >= 3) { // À partir de 3 caractères
            if (!searchCard[2].classList.contains("active")) { // Si la liste n'est pas affichée
                searchCard[2].classList.add("active") // Ouvre la liste
            }
            const ustensilsFilteredArray = addUstensilslist(recipes)
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
                    newUstensilsFilterArray.push(element) // Insère l'élément dans le tableau créé
                }
            })
            ustensilsUl.innerHTML = newUstensilsFilterArray.join(" ") // Affiche les résultats de la recherche
        } else { // Si la recherche comprend moins de 3 caractères
            const ustensilsHTMLString = addUstensilslist(recipes)
            ustensilsUl.innerHTML = ustensilsHTMLString.join(" ") || ""  // Affichage complet de la liste
        }
        addFilteredUstensil()
    }


    // Affichage de l'ustensile sélectionné
    function addFilteredUstensil() {
        const ustensilsResult = document.querySelectorAll(".ustensils-result") //Ustensiles de la liste
        /* for (let i = 0; i < ustensilsResult.length; i++) {
            ustensilsResult[i].addEventListener("click", addItem)
            function addItem(ustensil) {
                itemFilters[2].classList.add("active")
                let itemString = ustensil.target.innerText
                filteredUstensil.innerHTML = itemString
                closeCard(searchCard[2])
            }
        } */
        ustensilsResult.forEach(element => {
            element.addEventListener("click", addItem)
            function addItem(eventUstensil) {
                let itemString = eventUstensil.target.innerText // Crée une variable contenant le texte de l'item cliqué
                let ustensilsFilter = document.createElement("div") // Crée la div du filtre
                ustensilsFilter.classList.add("item-filters") // Ajoute les classes
                ustensilsFilter.classList.add("ustensils-filter")
                ustensilsFilter.classList.add("active")
                ustensilsFilter.innerHTML = `
                <div class="filtered-item">${itemString}</div>
                <i class="far fa-times-circle close-button"></i>
                `
                filters.appendChild(ustensilsFilter) // Insère le filtre dans sa div
                selectedTags.push(itemString)
                recipeFilter(eventUstensil, "tag")
                closeFilter()
                closeCard(searchCard[2])
                ustensilsInput.placeholder = `Ustensiles`
            }
        })
    }

    // *******************************************************************************
    // ********************************** SEARCHBAR **********************************
    // *******************************************************************************

    // Filtrage des recettes avec la search-bar
    function recipeFilter(event, mode = "search") {
        const input = event.currentTarget
        if (mode == "search") {
            searchbarResearch(input)
        } else if (mode == "tag") {
            console.log(`mode = "tag"`);
            console.log(`tags sélectionnés : `,selectedTags);
            if (selectedTags.length != 0) {
                let tagArray = [] // Crée un tableau
                let tagRecipes = []
                recipeArray.forEach(element => {
                    console.log(element.html.toLowerCase());
                    if (element.html.toLowerCase().includes(selectedTags.join("").toLowerCase())) {
                        console.log(`recette trouvée`);
                        tagArray.push(element.html) // Insère la recette dans le tableau créé
                        tagRecipes.push(element.recipe) // Insère la recette dans le tableau créé
                        console.log(tagRecipes);
                    }
                })
                if (tagArray.length === 0) { // Si aucune recette n'a été mise dans le tableau
                    recipesContainer.innerHTML = `Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.`;
                } else { // Sinon (si au moins une recette correspond)
                    recipesContainer.innerHTML = tagArray.join(" ")
                }
                addIngredientsList(tagRecipes)
                addAppliancesList(tagRecipes)
                addUstensilslist(tagRecipes)
            } else {
                searchbarResearch(input)
            }
        } else if (mode == "ustensilsTag") {
            console.log(`mode = "ustensilsTag"`);
            if (selectedTags.length != 0) {
                let ustensilsTagArray = []
                let ustensilsTagRecipes = []
                const ustensilsArray = addUstensilslist(recipes) 
                ustensilsArray.forEach(element => {
                    if (element.toLowerCase().includes(selectedTags.join("").toLowerCase())) {
                        console.log(`ustensile :`, element);
                        ustensilsTagArray.push(element)
                    }
                })
                if (ustensilsTagArray === 0) {
                    recipesContainer.innerHTML = `Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.`; 
                } else {
                    recipesContainer.innerHTML = ustensilsTagArray.join(" ")
                }
            }
        }
        addFilteredIngredient()
        addFilteredAppliance()
        addFilteredUstensil()
    }    

    function searchbarResearch(input) {
        console.log(input.value);
        if (input.value.length >= 3) { // À partir de 3 caractères
            let searchArray = [] // Crée un tableau
            let searchRecipes = []
            recipeArray.forEach(element => {
                let research = input.value.toLowerCase() // Récupère le résultat de la recherche
                if (element.html.toLowerCase().includes(research)) {
                    searchArray.push(element.html) // Insère la recette dans le tableau créé
                    searchRecipes.push(element.recipe) // Insère la recette dans le tableau créé
                }
            })
            if (searchArray.length === 0) { // Si aucune recette n'a été mise dans le tableau
                recipesContainer.innerHTML = `Aucune recette ne correspond à votre critère... Vous pouvez chercher  « tarte aux pommes », « poisson », etc.`;
            } else { // Sinon (si au moins une recette correspond)
                recipesContainer.innerHTML = searchArray.join(" ")
            }
            addIngredientsList(searchRecipes)
            addAppliancesList(searchRecipes)
            addUstensilslist(searchRecipes)
        } else { // Si l'input comprend moins de 3 caractères
            recipesContainer.innerHTML = recipeHTMLString // Affichage de toutes les recettes
            addIngredientsList(recipes)
            addAppliancesList(recipes)
            addUstensilslist(recipes)
        }
    }
    
    function closeFilter() {
        // Fermeture des div des items filtrés
        const closeButton = document.querySelectorAll(".close-button"); // Croix de fermeture des items filtrés
        closeButton.forEach(element => {
            element.addEventListener("click", removeActive)
        })
        function removeActive(button) {
            let icon = button.target
            icon.parentElement.classList.remove("active") 
            let item = icon.previousElementSibling.innerHTML
            selectedTags = selectedTags.filter (element => element!== item)
            recipeFilter(event, mode = "tag")
        }
    }

}

// **********************************************************************
// ************************* FILTRES ET BOUTONS *************************
// **********************************************************************

/* closeButton[0].addEventListener("click", closeIngredientDiv) // Fermeture des div des items filtrés
closeButton[1].addEventListener("click", closeApplianceDiv) // Fermeture des div des items filtrés
closeButton[2].addEventListener("click", closeUstensilDiv) // Fermeture des div des items filtrés */




// Affichage des ingrédients au clic sur le bouton
function showIngredientsList() {
    if (searchCard[0].classList.contains("active")) {
        ingredientsInput.placeholder = `Ingrédients`
    } else {
        ingredientsInput.placeholder = `Rechercher un ingrédient`
    }
    openCard(searchCard[0])
    closeCard(searchCard[1])
    appliancesInput.placeholder = `Appareil`
    closeCard(searchCard[2])
    ustensilsInput.placeholder = `Ustensiles`
}
    
// Affichage des appareils au clic sur le bouton
function showAppliancesList() {
    if (searchCard[1].classList.contains("active")) {
        appliancesInput.placeholder = `Appareil`
    } else {
        appliancesInput.placeholder = `Rechercher un appareil`
    }
    openCard(searchCard[1]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = `Ingrédients`
    closeCard(searchCard[2])
    ustensilsInput.placeholder = `Ustensiles`
}

// Affichage des ustensiles au clic sur le bouton
function showUstensilsList() {
    if (searchCard[2].classList.contains("active")) {
        ustensilsInput.placeholder = `Ustensiles`
    } else {
        ustensilsInput.placeholder = `Rechercher un ustensile`
    }
    openCard(searchCard[2]) 
    closeCard(searchCard[0])
    ingredientsInput.placeholder = `Ingrédients`
    closeCard(searchCard[1])
    appliancesInput.placeholder = `Appareil`
}
/* function closeApplianceDiv() {
    itemFilters[1].classList.remove("active")
}
function closeUstensilDiv() {
    itemFilters[2].classList.remove("active")
} */

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
