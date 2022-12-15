

//CART SCRIPT

async function cartInit() {
    const cart = f
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
        <div id="order">
            <button id="orderButton" onclick="sendItemToCart(${pizza.id})"><strong>Order</strong></button>
            </div>
            <div id="name"><strong>${pizza.name}</strong>
            </div> <br>
            <div id="ingredients"><strong>Ingredients:</strong> <br>
            ${ingredientsList}
            </div> <br>
            <div id="allergens"><strong>Allergens:</strong> <br>
            ${allergensListWithTitles}
            </div>
            
        </div>
    </div>
    `;
        cardsHTML += cardTemplate;
    }
    return cardsHTML;
}