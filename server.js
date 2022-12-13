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

app.get("/pizzas", async (req, res) => {
  res.send(fs.readFileSync(filePath).toString())
})

app.get("/pizzas/list", async (req, res) => {
  res.send(fs.readFileSync("./frontend/pizzas/pizzas.html").toString())
})

app.get("/api/allergens", async(req, res) => {
  res.send(fs.readFileSync("./allergens.json").toString())
})

app.use(express.static('./frontend'))
app.listen(port, () => {
    console.log(`The pizza ordering is online! Go to http://localhost:${port}`)
  })