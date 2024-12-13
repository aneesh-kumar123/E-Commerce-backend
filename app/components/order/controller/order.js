const OrderService = require("../service/order");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const badRequest = require("../../../errors/badRequest");
const { createUUID,validateUUID } = require("../../../utils/uuid.js");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  
  async createOrder(req, res, next) {
    try {
      Logger.info("Create order controller started...");
      const { userId } = req.params; 
      const { orderStatus, paymentStatus, paymentMethod,} = req.body;
      
      
      validateUUID(userId);
      
     let id=createUUID();
      const response = await this.orderService.createOrder(id,userId, orderStatus, paymentStatus, paymentMethod);
      Logger.info("Create order controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

 
  async getAllOrders(req, res, next) {
    try {
      Logger.info("Get all orders controller started...");
      const { count, rows } = await this.orderService.getAllOrders(req.query);
      res.status(HttpStatusCode.Ok).json({ data: rows, total: count });
    } catch (error) {
      next(error);
    }
  }

 
  async getOrderById(req, res, next) {
    try {
      Logger.info("Get order by ID controller started...");
      const { userId} = req.params;
      // validateUUID(orderId);

      const response = await this.orderService.getOrderById(userId,req.query);
      if (!response) throw new NotFoundError("Order not found");

      Logger.info("Get order by ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

 
  async updateOrder(req, res, next) {
    try {
      Logger.info("Update order controller started...");
      const { orderId } = req.params;
      const { parameter, value } = req.body;
      validateUUID(orderId);

      const response = await this.orderService.updateOrder(orderId, parameter, value);
      if (!response) throw new NotFoundError("Order not found");

      Logger.info("Update order controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Order with ID ${orderId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

 
  async deleteOrder(req, res, next) {
    try {
      Logger.info("Delete order controller started...");
      const { orderId } = req.params;
      validateUUID(orderId);

      const response = await this.orderService.deleteOrder(orderId);
      if (!response) throw new NotFoundError("Order not found");

      Logger.info("Delete order controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Order with ID ${orderId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();
module.exports = orderController;
