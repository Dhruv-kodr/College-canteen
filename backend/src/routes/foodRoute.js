const express = require('express');
const foodRouteController = require('../controllers/foodController')
const foodManageController = require('../controllers/fooManage.controller')
const uploadFoodMedia = require('../middleware/uploadFoodMedia')
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/admin.middleware')
const router = express.Router();


//Add Food Only for admin 
router.post("/add-food", protect, isAdmin, uploadFoodMedia.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 },]), foodRouteController.addFood);


router.get("/get-food", foodRouteController.getAllFoods)
router.patch(
    "/update-food/:id",
    protect,
    isAdmin,
    uploadFoodMedia.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 },]),
    foodRouteController.updateFood
);

router.delete(
    "/delete-food/:id",
    protect,
    isAdmin,
    foodRouteController.deleteFood
);

router.post("/add-cart",protect, foodManageController.addToCart);
router.post("/decrease-cart",protect, foodManageController.decreaseCart);
router.get("/get-cart",protect, foodManageController.getCart);
router.delete("/removecart",protect, foodManageController.removeCartItem);

router.post("/buy",protect, foodManageController.buyFood)
router.post("/buy-all",protect, foodManageController.buyAllFood)

router.get("/my-orders",protect,foodManageController.getMyOrders)


module.exports = router;