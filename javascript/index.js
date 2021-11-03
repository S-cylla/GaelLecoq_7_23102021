// Retournement du chevron des cards au clic
const chevron = document.querySelectorAll(".search-card-button");
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
}

// Récupération et affichage des recettes
fetch ("javascript/recipes.js")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        value.map(getRecipes);
    })
    .catch(function(err) {
        console.log(err)
    })

    function getRecipes(data) {
        let recipesContainer = document.getElementById("recipes-container");
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("recipe-card");
        let h1 = document.createElement('h1');
        let span = document.createElement("span");
        span.classList.add("time")
        let article = document.createElement("article");
        let aside = document.createElement("aside");
        h1.innerHTML = data.name;
        span.innerHTML = data.time + ` min`;
        article.innerHTML = data.description;
        let ingredients = data.ingredients;
        aside.innerHTML = ingredients.map(getIngredients)
        function getIngredients(item) {
            return [item.ingredient, item.quantity, item.unit].join(" ");
        }

        recipesContainer.appendChild(cardDiv);
        cardDiv.appendChild(h1);
        cardDiv.appendChild(span);
        cardDiv.appendChild(article);
        cardDiv.appendChild(aside);
    }

/*
fetch ("javascript/recipes.js")
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        appendData(value);
    })
    .catch(function(err) {
        console.log(err)
    })

function appendData(value) {
    let recipesContainer = document.getElementById("recipes-container");
    for (let i = 0; i < value.length; i++) {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("recipe-card");
        let h1 = document.createElement('h1');
        let span = document.createElement("span");
        let article = document.createElement("article");
        let aside = document.createElement("aside");
        h1.innerHTML = value[i].name + " " + value[i].servings + " " + value[i].ingredients + " " + value[i].appliance + " " + value[i].ustensils;
        span.innerHTML = value[i].time + " min";
        article.innerHTML = value[i].description;
        for (let j = 0; j < value[i].ingredients.length; j++) {
            const element = value[i].ingredients[j];
            aside.innerHTML = element
        }

        recipesContainer.appendChild(cardDiv);
        cardDiv.appendChild(h1);
        cardDiv.appendChild(span);
        cardDiv.appendChild(article);
        cardDiv.appendChild(aside);
    }
}
*/
