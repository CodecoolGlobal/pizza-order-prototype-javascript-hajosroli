
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
    const formContainer = document.createElement("div")
    //const formHtml = createForm();

    container.classList.add("container");
    formContainer.classList.add("formContainer")
    container.innerHTML = cardsHTML;
    formContainer.innerHTML = checkCart(container);
    //formContainer.innerHTML = formHtml;
    frame.appendChild(container);
    frame.appendChild(formContainer)
    const orderButton = document.querySelector("#formInput")
    orderButton.addEventListener("click", ()=> sendOrder())
}


function createCards(obj, allergens) {
    let cardsHTML = ""
    console.log(obj)
    for (let pizza of obj.cartContent) {
        console.log(pizza.alt_name)
        const ingredientsList = getInfoAboutElement(pizza.ingredients);
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
            <button onclick="deleteRequests(${pizza.id}, 'cart', '${pizza.alt_name}')">Remove</button>
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

async function deleteRequests(itemID, target, id) {
    console.log("id:" + id)
    const HTMLElement = document.querySelector(`#${id}`)
    const formContainer = document.querySelector(".formContainer")
    console.log(HTMLElement)
    const container = document.querySelector(".container")
    const msg = await fetch(`http://localhost:3000/api/${target}/${itemID}`, {
        method: "DELETE"
    })
    if (target == "cart") {
        deleteElementsFromHTML(container, HTMLElement)
        console.log(container.innerHTML )
        console.log(container.lastElementChild)
        if (container.lastElementChild === null) {
            formContainer.innerHTML = checkCart(container)
            container.innerHTML = "Cart is Empty! Go to Pizzas to add pizza to Cart!"
    }
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

function createForm() { //enctype="application/json"
    const formTemplate = `
    <div id="wrapper">
    <div id="inputs">
    <center><div class="form">
    <h1>Order</h1>
    First name: <input id="formInputFName" type="text" name="firstname" placeholder="John"><br/>
    Last name: <input id="formInputLName" type="text" name="lastname" placeholder="Smith"><br/>
    City:   <input id="formInputCity" type="address" name="address" placeholder="Los Angeles"><br/>
    Address:  <input id="formInputAddress" type="address" name="address" placeholder="1592 Mulholland Drive">
   <br/>
    E-mail:  <input id="formInputEmail" type="email" name="email" placeholder="pizza@email.com">
   <br/>
      <p>Special requests (You can check both)</p>
      <input id="formInputGluten" type='checkbox'>Gluten-free
      <input id="formInputLactose" type='checkbox'>Lactose-free
      <p>Comments:</br></p>
        <textarea id="formInputComms"></textarea>
        <p></p>
    <button id="formInput" onclick:"sendOrder()">Order</button>
  </div>
  </div>`;

    return formTemplate;
}

function checkCart(element){
    const formHtml = createForm();
    console.log(element.lastElementChild)
    if(element.lastElementChild == null){
        return "";
    }
    else return formHtml;
}

async function sendOrder() {
    console.log("works")
    const prevOrders = await (await fetch("http://localhost:3000/api/orders")).json();
    const cart = await (await fetch("http://localhost:3000/api/cart")).json();
    const form = JSON.stringify(createOrderForm(cart, prevOrders));
    
    const msg = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: form
    });
}

function createOrderForm(cart, prevOrders) {
    const FName = document.querySelector("#formInputFName").value
    const LName = document.querySelector("#formInputLName").value
    const City = document.querySelector("#formInputCity").value
    const Address = document.querySelector("#formInputAddress").value
    const Email = document.querySelector("#formInputEmail").value
    const GlutenBox = document.querySelector("#formInputGluten").checked
    const LactoseBox = document.querySelector("#formInputLactose").checked
    const Comms = document.querySelector("#formInputComms").value
    const orderID = prevOrders.orders.length

    let pizzaList = [];
    for (let pizza of cart.cart[0].cartContent) {
        let Gluten = "Gluten-free";
        let Lactose = "Lactose-free";
        if (!GlutenBox) Gluten = "-";
        if (!LactoseBox) Lactose = "-";
        const amount = document.getElementById(`quantityInput${pizza.id}`).value
        pizzaList.push({"id": pizza.id, "amount": amount, "specials": [Gluten, Lactose]})
    }
    const date = getDateNow();
    const formData = {
        "id": orderID,
        "pizzas": pizzaList,
        "date": {
            "year": date.year,
            "month": date.month,
            "day": date.day,
            "hour": date.hour,
            "minute": date.minute
          },
        "customer": {
            "name": `${FName} ${LName}`,
            "email": Email,
            "address": {
            "city": City,
            "street": Address
            }
          },
        "comments": Comms
    }
    return formData;
}

function getDateNow() {
const date = new Date;
return {year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes()}    
}