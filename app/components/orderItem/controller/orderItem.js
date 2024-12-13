const OrderItemService = require("../service/orderItem");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const { validateUUID } = require("../../../utils/uuid");
const {createUUID} = require("../../../utils/uuid");

class OrderItemController {
  constructor() {
    this.orderItemService = new OrderItemService();
  }
  async getOrderItemsByOrderId(req, res, next) {
    try {
      Logger.info("Get order items by Order ID controller called...");
      const { orderId } = req.params;
      validateUUID(orderId);

      const response = await this.orderItemService.getOrderItemsByOrderId(orderId);
      if (!response) throw new NotFoundError("Order items not found");

      Logger.info("Get order items by Order ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }


  async createOrderItem(req, res, next) {
    try {
      Logger.info("Create order item controller started...");
      const { userId}= req.params;
      const {  productId, quantity, priceAtOrder } = req.body;
      // validateUUID(orderId);
      validateUUID(productId);
      const id = createUUID();
    

      const response = await this.orderItemService.createOrderItem(id,userId, productId, quantity, priceAtOrder);
      Logger.info("Create order item controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }


  async updateOrderItem(req, res, next) {
    try {
      Logger.info("Update order item controller started...");
      const { orderItemId } = req.params;
      const { parameter, value } = req.body;

      validateUUID(orderItemId);
      const response = await this.orderItemService.updateOrderItem(orderItemId, parameter, value);
      if (!response) throw new NotFoundError("Order item not found");

      Logger.info("Update order item controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Order item with ID ${orderItemId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

 
  async deleteOrderItem(req, res, next) {
    try {
      Logger.info("Delete order item controller started...");
      const { orderItemId } = req.params;
      validateUUID(orderItemId);

      const response = await this.orderItemService.deleteOrderItem(orderItemId);
      if (!response) throw new NotFoundError("Order item not found");

      Logger.info("Delete order item controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Order item with ID ${orderItemId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const orderItemController = new OrderItemController();
module.exports = orderItemController;
