const PaymentService = require("../service/payment");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const { validateUUID } = require("../../../utils/uuid");

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

 
  async createPayment(req, res, next) {
    try {
      Logger.info("Create payment controller started...");
      const { orderId, paymentMethod, amount, paymentStatus } = req.body;
      validateUUID(orderId);

      const response = await this.paymentService.createPayment(orderId, paymentMethod, amount, paymentStatus);
      Logger.info("Create payment controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

 
  async getPaymentByOrderId(req, res, next) {
    try {
      Logger.info("Get payment by Order ID controller called...");
      const { orderId } = req.params;
      validateUUID(orderId);

      const response = await this.paymentService.getPaymentByOrderId(orderId);
      if (!response) throw new NotFoundError("Payment not found");

      Logger.info("Get payment by Order ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }


  async updatePaymentStatus(req, res, next) {
    try {
      Logger.info("Update payment status controller called...");
      const { paymentId } = req.params;
      const { paymentStatus } = req.body;

      validateUUID(paymentId);

      const response = await this.paymentService.updatePaymentStatus(paymentId, paymentStatus);
      if (!response) throw new NotFoundError("Payment not found");

      Logger.info("Update payment status controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Payment with ID ${paymentId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const paymentController = new PaymentController();
module.exports = paymentController;
