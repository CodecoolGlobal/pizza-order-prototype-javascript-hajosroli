const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const express = require('express')
const app = express()
const path = require("path");
const fs = require("fs");
const filePath = path.join(`${__dirname}/pizza.json`);
const port = 3000;

app.use(express.json());
app.get('/', (req, res) => {
  console.log(req.url)
  res.send((fs.readFileSync('./frontend/index.html').toString()))
})

app.get('/api/pizza', (req, res) => {
  res.send((fs.readFileSync(filePath).toString()))
})

app.get('/api/cart', (req, res) => {
  res.send((fs.readFileSync("./cart.json").toString()))
})

app.get('/api/orders', (req, res) => {
  res.send((fs.readFileSync("./orders.json").toString()))
})

app.post('/api/orders', async(req, res) => {
  const data = req.body;
  addOrderToFile(data)
  res.send((fs.readFileSync("./frontend/cart/cart.html").toString()))
})

app.delete('/api/:target/:itemID', async (req, res) => {
  const itemID = parseInt(req.params.itemID)
  const target = req.params.target
  if(itemID === undefined) console.log("success")
  executeDeletion(target, itemID)
  res.send("DONE")
})

app.get('/cart', (req, res) => {
  res.send((fs.readFileSync("./frontend/cart/cart.html").toString()))
})

app.get('/orders', (req, res) => {
  res.send((fs.readFileSync("./frontend/orders/orders.html").toString()))
})

app.get('/cart/additem/:itemID', async (req, res) => {
  const items = await JSON.parse(fs.readFileSync("./pizza.json"))
  let data = await JSON.parse(fs.readFileSync("./cart.json"))
  const itemID = parseInt(req.params.itemID)
  data.cart[0].cartContent.push(items.pizzas[itemID - 1])
  fs.writeFileSync("./cart.json", JSON.stringify(data, null, 2))
  res.send("DONE")
})

app.get("/pizzas", async (req, res) => {
  res.send(fs.readFileSync(filePath).toString())
})

app.get("/pizzas/list", async (req, res) => {
  res.send(fs.readFileSync("./frontend/pizzas/pizzas.html").toString())
})

app.get("/api/allergens", async (req, res) => {
  res.send(fs.readFileSync("./allergens.json").toString())
})
app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('./frontend'))
app.listen(port, () => {
  console.log(`The pizza ordering is online! Go to http://localhost:${port}`)
})

function executeDeletion(target, itemID) {
  switch (target) {
    case "cart":
      deleteFromCart(itemID)
      break;

    case "orders":
      deleteFromOrders(itemID)
      break;
  }
}

async function deleteFromCart(itemID) {
  let data = await JSON.parse(fs.readFileSync("./cart.json"))
  data.cart[0].cartContent = await data.cart[0].cartContent.filter(element => element.id !== itemID)
  fs.writeFileSync("./cart.json", JSON.stringify(data, null, 2))
}
async function deleteFromOrders(orderID) {
  let data = await JSON.parse(fs.readFileSync("./orders.json"))
  data.orders[0].orderContent = await data.orders[0].orderContent.filter(element => element.id !== itemID)
}

async function addOrderToFile(order) {
  let data = await JSON.parse(fs.readFileSync("./orders.json"))
  data.orders.push(order);
  fs.writeFileSync("./orders.json", JSON.stringify(data, null, 2))
}
