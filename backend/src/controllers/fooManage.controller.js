const foodModel = require("../models/foodManage.model");
const jwt = require("jsonwebtoken");
const buyModel = require("../models/buyModel");
const cartModel = require("../models/cartModel");

const getFoodDetails = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.status(200).json(food);
    } catch (error) {

    console.log(error.message + " server error from getFoodDetails");
    res.status(500).json({ message: "Server error" });
  } 
};

const buyFood = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    const totalPrice = food.price * quantity;

    const buy = await buyModel.create({
      userId,
      foodId,
      quantity,
      totalPrice,
    });

    await cartModel.deleteOne({ foodId })

    res.status(201).json({
      message: "Food bought successfully",
      buy,
    });
  }
    catch (error) {
    console.log(error.message || "server error from buyFood");
    res.status(500).json({ message: "Server error" });
  }
};

const addToCart = async (req, res) => {
  try {

    const { foodId } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const existingItem = await cartModel.findOne({ userId, foodId });

    // agar item pehle se cart me hai
    if (existingItem) {

      existingItem.quantity += 1;
      await existingItem.save();

      return res.status(200).json({
        message: "Quantity increased",
        cartItem: existingItem
      });

    }

    const cartItem = await cartModel.create({
      userId,
      foodId,
      quantity: 1
    });

    res.status(201).json({
      message: "Item added to cart",
      cartItem
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const decreaseCart = async (req, res) => {
  try {

    const { foodId } = req.body;
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const item = await cartModel.findOne({ userId, foodId });

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity -= 1;

    // agar quantity 0 ho jaye
    if (item.quantity < 1) {

      await cartModel.deleteOne({ _id: item._id });

      return res.status(200).json({
        message: "Item removed from cart"
      });

    }

    await item.save();

    res.status(200).json({
      message: "Quantity decreased",
      cartItem: item
    });

  } catch (error) {

    console.log(error.message);
    res.status(500).json({ message: "Server error" });

  }
};

const getCart = async (req, res) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cartItems = await cartModel
      .find({ userId })
      .populate("foodId");   // food details lene ke liye

    res.status(200).json({
      message: "Cart fetched successfully",
      cartItems
    });

  } catch (error) {

    console.log(error.message || "Server error from getCart");

    res.status(500).json({
      message: "Server error"
    });

  }
};

const removeCartItem = async (req, res) => {
  try {
    const { foodId } = req.body; // For DELETE, body is accessible
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const item = await cartModel.findOne({ userId, foodId });

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    await cartModel.deleteOne({ _id: item._id });

    res.status(200).json({
      message: "Item removed from cart successfully"
    });

  } catch (error) {
    console.log(error.message || "Server error from removeCartItem");
    res.status(500).json({
      message: "Server error"
    });
  }
};
const buyAllFood = async (req, res) => {
  try {
    const { items } = req.body; // [{ foodId, quantity }]
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let orders = [];

    for (let item of items) {
      const food = await foodModel.findById(item.foodId);

      if (!food) continue; // skip invalid food

      if (item.quantity < 1) continue;

      const totalPrice = food.price * item.quantity;

      const order = await buyModel.create({
        userId,
        foodId: item.foodId,
        quantity: item.quantity,
        totalPrice,
      });

      orders.push(order);
    }

    // ✅ Cart clear karo after purchase
    await cartModel.deleteMany({ userId });

    res.status(201).json({
      message: "All items purchased successfully",
      orders,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyOrders= async (req,res)=>{

  try {
    
    const token = req.cookies.token;
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const userId = decoded.id;
    const orders = await buyModel.find({userId}).populate("foodId").sort({createdAt: -1});
  
    res.status(200).json({orders})
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message:"server error"
    })
  }

}
module.exports = { getFoodDetails, buyFood, addToCart,decreaseCart,getCart,removeCartItem,buyAllFood,getMyOrders };