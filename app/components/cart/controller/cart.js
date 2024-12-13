const CartService = require("../service/cart");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const badRequest = require("../../../errors/badRequest");
const { createUUID, validateUUID } = require("../../../utils/uuid.js");
const {
  validateQuantity
 } = require("../../../utils/validation.js");

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  // Get Cart by User ID
  async getCartByUserId(req, res, next) {
    try {
      Logger.info("Get cart by User ID controller called...");
      const { userId } = req.params;
      validateUUID(userId);

      const response = await this.cartService.getCartByUserId(userId,req.query);
      // setXTotalCountHeader(res, count);
      if (!response) throw new NotFoundError("Cart not found");

      Logger.info("Get cart by User ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update Cart (e.g., add/remove/update product quantity)
  async updateCart(req, res, next) {
    try {
      Logger.info("Update cart controller called...");
      const { userId } = req.params;
      const { productId, quantity } = req.body;
      validateUUID(userId);
      validateUUID(productId);
      // validateQuantity(quantity);


      // if (!productId || quantity <= 0) {
      //   throw new badRequest("Invalid productId or quantity");
      // }

      const response = await this.cartService.updateCart(userId, productId, quantity);
      if (!response) throw new NotFoundError("Cart not found");

      Logger.info("Update cart controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: "Cart updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Clear Cart (remove all items)
  async clearCart(req, res, next) {
    try {
      Logger.info("Clear cart controller called...");
      const { userId } = req.params;

      const response = await this.cartService.clearCart(userId);
      if (!response) throw new NotFoundError("Cart not found");

      Logger.info("Clear cart controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: "Cart cleared successfully" });
    } catch (error) {
      next(error);
    }
  }
}

const cartController = new CartController();
module.exports = cartController;
