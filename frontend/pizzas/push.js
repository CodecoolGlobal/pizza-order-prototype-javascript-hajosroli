init()
let selections = {};

function createEventListeners() {
    const filterInput = document.querySelectorAll(".filter")
    for (var i = 0; i < filterInput.length; i++) {
        filterInput[i].addEventListener("click", displayCheck);
    }
}

function displayCheck(input) {
    if (input.target.checked) {
        selections[input.target.id] = {
            name: input.target.name,
            id: input.target.value
        };
    }
    else {
        delete selections[input.target.id];
    }
    let filter = []
    for (let i = 0; i < Object.keys(selections).length; i++) {
        filter.push(parseInt(Object.values(selections)[i].id))
    }
    init(filter);
}

async function init(filter) {
    const list = await fetch("http://localhost:3000/pizzas")
    const allergens = await fetch("http://localhost:3000/api/allergens")
    const convertedAllergens = await allergens.json();
    const convertedList = await list.json()
    if (filter) {
        const filteredList = makeListFiltered(convertedList, filter)
        pushOnlyPizzasToClient(filteredList, convertedAllergens.allergens)
    }
    else {
        pushDataToClient(convertedList, convertedAllergens.allergens)
    }

}

function pushDataToClient(obj, allergens) {
    const frame = document.querySelector(".frame")
    const cardsHTML = createCards(obj, allergens);
    const filterHTML = createFilter(allergens);
    const container = document.createElement("div");
    const filterTool = document.querySelector(".filterMenu");
    container.classList.add("container");
    container.innerHTML = cardsHTML;
    filterTool.innerHTML += filterHTML;
    createEventListeners();
    frame.appendChild(container);
}

function pushOnlyPizzasToClient(obj, allergens) {
    const container = document.querySelector(".container")
    deletePrevious(container)
    const cardsHTML = createCards(obj, allergens);
    container.innerHTML = cardsHTML;
}

function createCards(obj, allergens) {
    let cardsHTML = ""
    for (let pizza of obj.pizzas) {
        const ingredientsList = getInfoAboutElement(pizza.ingredients);
        const allergensList = getInfoAboutElement(pizza.allergens);
        const allergensListWithTitles = makeAllergensTitled(pizza.allergens, allergens)
        const cardTemplate = ` 
    <div class="cards" id="${pizza.alt_name}">
        <img src="./pictures/pizza-${pizza.alt_name}.jpg" alt="${pizza.name} pizza" class="img">
        <div class="overlay">
        <div id="order">
            <button id="orderButton" onclick="sendItemToCart(${pizza.id})"><strong>Order</strong></button>
            </div>
            <div id="name"><strong>${pizza.name}</strong>
            </div> <br>
            <div id="ingredients"><strong>Ingredients:</strong> <br>
            <b>${ingredientsList}</b>
            </div> <br>
            <div id="allergens"><strong>Allergens:</strong> <br>
            <b>${allergensListWithTitles}</b>
            </div>
            
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
    return stringedList.slice(0, stringedList.length - 2);
}

function makeAllergensTitled(list, allergens) {
    let allergensList = ""
    for (let element of allergens) {
        for (let index of list) {
            if (element.id === index) allergensList += `<div class="allergens" title="${element.name}">${element.id},</div>`;
        }
    }
    return allergensList.slice(0, allergensList.length - 7) + "</div>";
}


function makeListFiltered(obj, filter) {
    let newObj = { pizzas: [] };
    for (let element of obj.pizzas) newObj.pizzas.push(element)
    // console.log(JSON.stringify(newObj, null, 2))
    let shouldItBeOnTheList = true;
    for (let allergen of filter) {
        for (let element of obj.pizzas) {
            for (let id of element.allergens) {
                if (id === allergen) shouldItBeOnTheList = false;
            }
            if (!shouldItBeOnTheList) {
                newObj.pizzas = newObj.pizzas.filter(entry => entry.id !== element.id)
                shouldItBeOnTheList = true;
            }
        }
    }
    return newObj;
}

const deletePrevious = (parentElement) => {
    let e = parentElement;
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

function createFilter(obj) {
    let filterHTML = "<ul class='filterList'>";
    for (let allergen of obj) {
        filterHTML += `
        <li><input type="checkbox" class="filter" id="${allergen.name}" name="${allergen.name}" value="${allergen.id}">
        <label for="${allergen.name}">${allergen.name}</label>
        </li>
        `
    }

    return filterHTML + "</ul>";
}

function sendItemToCart(itemID) {
    fetch(`http://localhost:3000/cart/additem/${itemID}`)
}