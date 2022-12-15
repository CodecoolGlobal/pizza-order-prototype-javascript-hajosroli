

//CART SCRIPT
orderInit();


let clickCounter = 0;
async function orderInit() {
    
    const order = await (await fetch("http://localhost:3000/api/orders")).json();      //ENDPOINT COULD BE /cart/<userID> IF WE HAD DIFFERENT CUSTOMERS
    const pizzaList = await (await fetch("http://localhost:3000/api/pizza")).json();
    console.log(pizzaList) 
    pushDataToClient(order.orders, pizzaList); 
    
    document.querySelectorAll('.orderDiv').forEach(item => {
        item.addEventListener('click', event => {
             item.innerHTML = createCards(order.orders, pizzaList)
        })
      })

}

     function pushDataToClient(obj, pizzaList) {
    console.log("works")
    const frame = document.querySelector(".frame")
    const cardsHTML = createCards(obj, pizzaList);
    const container = document.createElement("div");
    const orderButton = document.createElement("div")
    container.classList.add("container");
    orderButton.classList.add("hidden");
    orderButton.classList.add("orderButton");
   // orderButton.innerHTML = cardsHTML;
    console.log(container.innerHTML)
    
     container.innerHTML = createOrder(obj);
    frame.appendChild(container); 
}
function createOrder(obj){
    let orderHtml = "";
    for (let order of obj) {
        console.log(order)
                let customerId = order.id;
                let customerName = order.customer.name;

                const orderTemplate = `
                <button class="orderDiv" id="cl">
                <div id="orderItems"><strong>Customer ID:  </strong>${customerId}
                </div>
                <div id="orderItems"><strong>Customer's Name:  </strong>${customerName}</div>
                <div id="orderItems"><strong>Date:</strong></div> 
            </button>
                `
                orderHtml += orderTemplate;
            }
            
            return orderHtml ;
}

function createCards(obj, pizzaList) {
    
    let cardsHTML = "<div class='orderButton'>"
    console.log(obj)
    let totalPrice = 0;
    
    for (let order of obj) {
            for (let pizza of order.pizzas){
                let pizzaName = pizzaList.pizzas[parseInt(pizza.id)-1].name
                let pizzaPrice =  parseInt(pizza.amount) * parseInt(pizzaList.pizzas[parseInt(pizza.id)-1].price);
                totalPrice += pizzaPrice;
                 const cardTemplate = ` 
    <div class="order" id="${pizza.alt_name}">
        <div id="name"><strong>Customer ID:${order.id}</strong>
        </div> <br>
        <div id="customerName"><strong>Customer's Name:</strong>${order.customer.name} <br>
        <strong>E-mail: </strong>${order.customer.email}<br>
        <strong>Address:</strong>${order.customer.address.city} , ${order.customer.address.street}
        </div><br>
        <div id="pizzaName"><strong>Pizza name:</strong>${pizzaName} <br>
        <strong>Amount:</strong>${pizza.amount}<br>
        <strong>Special requests:</strong>${pizza.specials}
        </div> <br>
        <div id="price"><strong>Price: ${pizzaPrice}</strong></div><br>
        <div id="totalPrice"><strong>Total Price: ${totalPrice}</strong></div> 
    </div><br>
    `;
    cardsHTML += cardTemplate;
         } return cardsHTML + "</div>";}
    
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
    const msg = await fetch(`http://localhost:3000/api/${target}/${itemID}`, {
        method: "DELETE"
    })
    if (target == "cart") {
        deleteElementsFromHTML(container, HTMLElement)
    }
}

function deleteElementsFromHTML(parent, child) {
    parent.removeChild(child)
}