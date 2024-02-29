// routes/products.js
const express = require("express");
const { requireAuth } = require("../middleware/authentication.js");
const data = require("../data.json");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { Product } = require("../models/index.js");
const productRoutes = express.Router();

module.exports = productRoutes;

//get all products
productRoutes.get("/products", (req, res) => {
  const { pageNo, pageSize, sort } = req.query;

  let sortedData = [...data.products];

  // Check for sorting query parameter
  if (sort === "asc") {
    sortedData = sortedData.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    sortedData = sortedData.sort((a, b) => b.price - a.price);
  }

  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = pageNo * pageSize;

  const paginatedData = sortedData.slice(startIndex, endIndex);

  res.json({
    message: "Returned products successfully!",
    data: paginatedData,
    currentPage: Number(pageNo),
    pagesReturned: paginatedData.length,
    totalProducts: sortedData.length,
    totalPages: Math.ceil(sortedData.length / pageSize),
  });
});

//get a single product by ID
productRoutes.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  const product = await Product.findAll({
    where: {
      id: productId,
    },
  });
  console.log(product);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
  } else {
    res.json(product);
  }
});
//creating a new product
productRoutes.post("/products", requireAuth, async (req, res) => {
  try {
    console.log("POST request received");
    const newProduct = req.body;

    const createdProduct = await Product.create(newProduct);

    res.status(201).json({
      id: createdProduct.id,
      name: createdProduct.name,
      price: createdProduct.price,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//update a product by ID
productRoutes.put("/products/:id", requireAuth, (req, res) => {
  console.log("PUT request received");
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = data.products.findIndex((p) => p.id === productId);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
  } else {
    data.products[index] = { ...data.products[index], ...updatedProduct };
    res.json(data.products[index]);
  }
});
//deleting a product by Id
productRoutes.delete("/products/:id", requireAuth, async (req, res) => {
  console.log("DELETE request received");
  const productId = parseInt(req.params.id);

  try {
    // Find the product by ID
    const product = data.products.find((p) => p.id === productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      // Soft delete by marking as "isDeleted: true"
      product.isDeleted = true;
      fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
      console.log(data, "ggghghghgh");
      res.json({ id: productId, message: "Soft deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Patch operation to partially update a product by ID
productRoutes.patch("/products/:id", (req, res) => {
  console.log("PATCH request received");
  const productId = parseInt(req.params.id);
  const updatedFields = req.body;

  const index = data.products.findIndex((p) => p.id === productId);

  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
  } else {
    // Update only the specified fields
    data.products[index] = { ...data.products[index], ...updatedFields };
    res.json({
      message: "Updated the product successfully!",
      data: data.products[index],
    });
  }
});
// Purchase a product by ID
productRoutes.post("/products/:id/purchase", async (req, res) => {
  console.log("PURCHASE request received");
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;

  try {
    // Find the product by ID
    const product = data.products.find((p) => p.id === productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      // Check if there is enough quantity available
      if (product.quantity >= quantity) {
        // Update the quantity and save the change
        product.quantity -= quantity;

        await saveProducts(data.products);
        res.json({
          id: productId,
          message: "Purchase successful",
          remainingQuantity: product.quantity,
        });
      } else {
        res.status(400).json({ error: "Not enough stock available" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
