const express = require("express"); // Pull in the express package to use 
const app = express();              // Initialise the express app
const Joi = require("joi");         // pull joi package, for validation 
app.use(express.json());            // tells the server we are using JSON data 
const port = 3333;                  // Define a port for this app to run on 

app.get("/", (req, res) => {     // A simple route to check it works 
    res.send("shopping cart");

});


app.listen(port, () => {            // Make sure the app can be accessed 
    console.log("App is listing on port: " +port);
});
let carts = []; // array used to story users
let next_id = 1;

// return a list of all items in the cart 
app.get ("/cart", (req, res) => {
    return res.status(200).send(carts);

})

// adds a new item to the cart 
app.post("/cart", (req, res) => {
    // validation process 
    const schema = Joi.object({
        item_name: Joi.string().required(),
        item_price: Joi.number().required(),
        quantity: Joi.number().required()

    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }


    let cart = { // object to add to array, data is pulled out of the body of the request stored in req.body
        item_id: next_id,
        item_name: req.body.item_name,
        item_price: req.body.item_price,
        quantity: req.body.quantity
    };
    carts.push(cart);
    next_id = next_id + 1;
    return res.status(201).send(cart);

})

// gets a single item from the cart 
app.get("/cart/:id", (req, res) => {
    let id = parseInt(req.params.id);
    const cart = carts.find (temp => temp.item_id === id); 
    if(!cart) return res.status(404).send("No item found");

    return res.status(200).send(cart);

})

// updates a single item within the list( only quantity)
app.patch("/cart/:id", (req, res) => {
    let id = parseInt(req.params.id);
    const quantToUpdate = carts.find((cart) => cart.item_id === id);
  
    if (!quantToUpdate) {
      return res.status(404).send("No item found");
    }
  
    // Update specific properties of the user based on request body
    const updatedProps = req.body; // Assuming your request body contains the properties to update
  
    if (updatedProps.quantity) {
        quantToUpdate.quantity = updatedProps.quantity;
    }
  
    return res.status(200).send(quantToUpdate); // Send the updated user object
  });

// deletes an item from the list 
app.delete("/cart/:id", (req, res) => { // path parameter 

    let id = parseInt(req.params.id);// id from parameters of request
    const cart = carts.find (temp => temp.item_id === id); // same as function below 
    
    if(!cart) return res.status(404).send("No item found"); // if user is not found 404 sent

    const index = carts.indexOf(cart); // gets the index of the user 
    carts.splice(index,1); // JS function to remove user, first parameter is index, and second is how many to remove so just 1

    return res.status(200).send(cart.item_name +" deleted");

})
