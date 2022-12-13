//script.js
const pizzaList = document.querySelector("#pizzaList")

pizzaList.addEventListener("click", async() => {
    console.log("works")
    const list = await fetch("http://localhost:3000/pizzas/list")
    const convertedList = await list.json()
    console.log(convertedList)
})