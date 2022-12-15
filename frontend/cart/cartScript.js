
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
            container.innerHTML = "Cart is Empty! Go to Pizzas to add Pizza to Cart"
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
      Address:  <input id="formInputAddress" type="adress" name="adress" placeholder="1234 Street City, ST Zip">
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
    const cart = await (await fetch("http://localhost:3000/api/cart")).json();
    createOrderForm(cart)
    
    //const msg = await fetch()
}

function createOrderForm(cart) {
    const FName = document.querySelector("#formInputFName").value
    const LName = document.querySelector("#formInputLName").value
    const Address = document.querySelector("#formInputAddress").value
    const Email = document.querySelector("#formInputEmail").value
    const Gluten = document.querySelector("#formInputGluten").value
    const Lactose = document.querySelector("#formInputLactose").value
    const Comms = document.querySelector("#formInputComms").value

    let pizzaList = []
    for (let pizza of cart.cart[0].cartContent) {
        console.log("asd")
        const amount = document.getElementById(`quantityInput${pizza.id}`).value
        console.log(amount)
        console.log(Gluten)
        pizzaList.push[{"id": pizza.id, "amount": amount, "specials": [Gluten, Lactose]}]
    }
    console.log(pizzaList)



    const formData = {
        "id": 0,
        "pizzas": [ {"id": 1, "amount": 2, "specials": []}, {"id": 2, "amount": 1, "specials": []} ],
        "date": {
            "year": 2022,
            "month": 6,
            "day": 7,
            "hour": 18,
            "minute": 47
          },
          "customer": {
            "name": "John Doe",
            "email": "jd@example.com",
            "address": {
            "city": "Palermo",
            "street": "Via Appia 6"
            }
          }
    }
}