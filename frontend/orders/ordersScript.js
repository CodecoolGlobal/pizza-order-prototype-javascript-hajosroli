

//CART SCRIPT
orderInit();


let clickCounter = 0;
async function orderInit() {

    const order = await (await fetch("http://localhost:3000/api/orders")).json();      //ENDPOINT COULD BE /cart/<userID> IF WE HAD DIFFERENT CUSTOMERS
    const pizzaList = await (await fetch("http://localhost:3000/api/pizza")).json();
    pushDataToClient(order.orders, pizzaList);

    document.querySelectorAll('.orderDiv').forEach(item => {
        item.addEventListener('click', () => {
            if (item.childElementCount === 3) {
                const orderID = parseInt(item.id[item.id.length - 1]);
                item.innerHTML = createCards(order.orders, pizzaList, orderID);
            } else {
                const orderID = parseInt(item.id[item.id.length - 1]);
                item.innerHTML =  createOrder(order.orders, true, orderID);
            } 

        })
    })

}

function pushDataToClient(obj, pizzaList) {
    const frame = document.querySelector(".frame")
    //const cardsHTML = createCards(obj, pizzaList);
    const container = document.createElement("div");
    const orderButton = document.createElement("div")
    container.classList.add("container");
    orderButton.classList.add("hidden");
    orderButton.classList.add("orderButton");
    // orderButton.innerHTML = cardsHTML;

    container.innerHTML = createOrder(obj);
    frame.appendChild(container);
}
function createOrder(obj, onlyDetails, orderID) {
    let orderHtml = "";
    if (!onlyDetails) {
        for (let order of obj) {
            const customerId = order.id;
            const customerName = order.customer.name;
            const date = `${order.date.year}-${order.date.month}-${order.date.day}`

            const orderTemplate = `
                <button class="orderDiv" id="order:${order.id}">
                    <div class="orderItems"><strong>Order ID:  </strong>${customerId}</div>
                    <div class="orderItems"><strong>Customer's Name:  </strong>${customerName}</div>
                    <div class="orderItems"><strong>Date: </strong>${date}</div> 
                </button>
                `
            orderHtml += orderTemplate;
        }
    } else {
            const order = obj[orderID]
            const customerId = order.id;
            const customerName = order.customer.name;
            const date = `${order.date.year}-${order.date.month}-${order.date.day}`

            const orderTemplate = `
                <div class="orderItems"><strong>Order ID:  </strong>${customerId}</div>
                <div class="orderItems"><strong>Customer's Name:  </strong>${customerName}</div>
                <div class="orderItems"><strong>Date: </strong>${date}</div> 
                `
            orderHtml += orderTemplate;
    }

    return orderHtml;
}

function createCards(obj, pizzaList, orderID) {
    let totalPrice = 0;
    let order = obj[orderID];

    let cardTemplate = `
        <center><div class="order" id="${order.id}">
            <div id="name">
                <strong>Order ID: ${order.id}</strong>
            </div> <br>
            <div id="customerName">
                <strong>Customer's Name:</strong> ${order.customer.name} <br>
                <strong>E-mail: </strong> ${order.customer.email}<br>
                <strong>Address:</strong> ${order.customer.address.city}, ${order.customer.address.street}
            </div><br>
        </div><br>
        `
    for (let pizza of order.pizzas) {
        let pizzaName = pizzaList.pizzas[parseInt(pizza.id) - 1].name
        let pizzaPrice = parseInt(pizza.amount) * parseInt(pizzaList.pizzas[parseInt(pizza.id) - 1].price);
        totalPrice += pizzaPrice;
        cardTemplate += `
        <div id="pizzaName"><strong>Pizza name:</strong>${pizzaName} <br>
        <strong>Amount:</strong>${pizza.amount}<br>
        <strong>Special requests:</strong>${pizza.specials}
        </div> <br>
        <div id="price"><strong>Price: ${pizzaPrice}</strong></div><br>
    `;

    }
    return cardTemplate + `
            <div id="totalPrice"><strong>Total Price: ${totalPrice}</strong></div> 
        `;
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