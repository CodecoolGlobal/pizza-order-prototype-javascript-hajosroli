const pizzaList = document.querySelector("#pizzaList")
init()
async function init()  {
    console.log("works")
    const list = await fetch("http://localhost:3000/pizzas")
    const allergens = await fetch("http://localhost:3000/api/allergens")
    const convertedAllergens = await allergens.json();
    const convertedList = await list.json()
    pushDataToClient(convertedList, convertedAllergens.allergens)
}

function pushDataToClient(obj, allergens) {
    const frame = document.querySelector(".frame")
    const toolbar = document.querySelector(".toolbar")
    const cardsHTML = createCards(obj, allergens);
    const container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML = cardsHTML;
    frame.appendChild(toolbar); 
    frame.appendChild(container);
}

function createCards(obj, allergens) {
    let cardsHTML = ""
        for (let pizza of obj.pizzas) {
        const ingredientsList = getInfoAboutElement(pizza.ingredients);
        const allergensList = getInfoAboutElement(pizza.allergens);
        const allergensListWithTitles = makeAllergensTitled(pizza.allergens, allergens)
        const cardTemplate = ` 
    <div class="cards" id="${pizza.name}">
        <img src="./pictures/pizza-${pizza.alt_name}.jpg" alt="${pizza.name} pizza" class="img">
        <div class="overlay">
            ${pizza.name} <br>
            Ingredients: <br>
            ${ingredientsList} <br>
            Allergens: <br>
            ${allergensListWithTitles}
        </div>
    </div>
    `;
        cardsHTML += cardTemplate;
    }
    return cardsHTML;
}

function getInfoAboutElement(list) {
    let stringedList = ""
    for (let element of list) {
        stringedList += element + ", ";
    }
    return stringedList.slice(0, stringedList.length-2);
}

function makeAllergensTitled(list, allergens) {
    let allergensList = ""
    for (let element of allergens) {
        for (let index of list) {
            if (element.id === index) allergensList += `<div class="allergens" title="${element.name}">${element.id},</div>`;
        }
    }
    return allergensList.slice(0, allergensList.length-7) + "</div>";
}