const paymentConfig = require("../../../model-config/payment-config");
const orderConfig = require("../../../model-config/order-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");

class PaymentService {
  async createPayment(orderId, paymentMethod, amount, paymentStatus, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create payment service started...");
     
      const order = await orderConfig.model.findByPk(orderId, { transaction: t });
      if (!order) {
        throw new NotFoundError("Order not found");
      }

      
      const payment = await paymentConfig.model.create(
        {
          orderId,
          paymentMethod,
          amount,
          paymentStatus,
        },
        { transaction: t }
      );

      await commit(t);
      Logger.info("Create payment service ended...");
      return payment;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  
  async getPaymentByOrderId(orderId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get payment by Order ID service started...");
      const payment = await paymentConfig.model.findOne({
        where: { orderId },
        transaction: t,
      });

      if (!payment) {
        throw new NotFoundError("Payment not found");
      }

      await commit(t);
      Logger.info("Get payment by Order ID service ended...");
      return payment;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async updatePaymentStatus(paymentId, paymentStatus, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update payment status service started...");
      const payment = await paymentConfig.model.findByPk(paymentId, { transaction: t });
      if (!payment) {
        throw new NotFoundError("Payment not found");
      }

      payment.paymentStatus = paymentStatus;
      await payment.save({ transaction: t });

      await commit(t);
      Logger.info("Update payment status service ended...");
      return payment;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = PaymentService;
