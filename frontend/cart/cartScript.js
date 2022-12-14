

//CART SCRIPT
cartInit();

async function cartInit(update) {
    const cart = await (await fetch("http://localhost:3000/api/cart")).json();      //ENDPOINT COULD BE /cart/<userID> IF WE HAD DIFFERENT CUSTOMERS
    const allergens = await (await fetch("http://localhost:3000/api/allergens")).json();
    pushDataToClient(cart.cart[0], allergens.allergens)    
}

function pushDataToClient(obj, allergens) {
    const frame = document.querySelector(".frame")
    const cardsHTML = createCards(obj, allergens);
    const container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML = cardsHTML;
    frame.appendChild(container);
}


function createCards(obj, allergens) {
    let cardsHTML = ""
    console.log(obj)
    for (let pizza of obj.cartContent) {
        console.log(pizza.alt_name)
        const ingredientsList = getInfoAboutElement(pizza.ingredients);
        const allergensList = getInfoAboutElement(pizza.allergens);
        const allergensListWithTitles = makeAllergensTitled(pizza.allergens, allergens)
        const cardTemplate = ` 
    <div class="cards" id="${pizza.alt_name}">
        <img src="./pictures/pizza-${pizza.alt_name}.jpg" alt="${pizza.name} pizza" class="img">
        <div class="overlay">
            <div id="name"><strong>${pizza.name}</strong>
            </div> <br>
            <div id="ingredients"><strong>Ingredients:</strong> <br>
            <b>${ingredientsList}</b>
            </div> <br>
            <div id="allergens"><strong>Allergens:</strong> <br>
            <b>${allergensListWithTitles}</b>
            </div>
            <div id="price"><strong>Price: ${pizza.price}</strong></div>
            <div id="quantity">
            <button onclick="decreaseQuantity(${pizza.id})">-</button>
            <input class="quantityInput" id="quantityInput${pizza.id}" type="number" value="1" min="1">
            <button onclick="increaseQuantity(${pizza.id})">+</button>
            <button onclick="deleteRequests(${pizza.id}, 'cart', ${pizza.alt_name})">Remove</button>
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

async function deleteRequests(itemID, target, HTMLElement) {
    const container = document.querySelector(".container")
   // const card = document.querySelector(`#${itemName}`)
    const msg = await fetch(`http://localhost:3000/api/${target}/${itemID}`, {
        method: "DELETE"
    })
    if (target == "cart") {
        deleteElementsFromHTML(container, HTMLElement)
    }
}

function increaseQuantity(id){
    const input = document.getElementById(`quantityInput${id}`)
    input.value++
}

function decreaseQuantity(id){
    const input = document.getElementById(`quantityInput${id}`)
    if(input.value > 1) input.value--
}

function deleteElementsFromHTML(parent, child) {
    parent.removeChild(child)
}