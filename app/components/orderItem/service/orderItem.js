const orderItemConfig = require("../../../model-config/order-item-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");

class OrderItemService {
  async getOrderItemsByOrderId(orderId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get order items by Order ID service started...");
      const orderItems = await orderItemConfig.model.findAll({
        where: { orderId },
        transaction: t,
      });

      if (!orderItems || orderItems.length === 0) {
        throw new NotFoundError("No items found for this order");
      }

      await commit(t);
      Logger.info("Get order items by Order ID service ended...");
      return orderItems;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async createOrderItem(orderId, productId, quantity, priceAtOrder, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create order item service started...");
      const orderItem = await orderItemConfig.model.create(
        {
          orderId,
          productId,
          quantity,
          priceAtOrder,
        },
        { transaction: t }
      );

      await commit(t);
      Logger.info("Create order item service ended...");
      return orderItem;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async updateOrderItem(orderItemId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update order item service started...");
      const orderItem = await orderItemConfig.model.findByPk(orderItemId, { transaction: t });

      if (!orderItem) {
        throw new NotFoundError("Order item not found");
      }

      orderItem[parameter] = value;
      await orderItem.save({ transaction: t });

      await commit(t);
      Logger.info("Update order item service ended...");
      return orderItem;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async deleteOrderItem(orderItemId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Delete order item service started...");
      const orderItem = await orderItemConfig.model.findByPk(orderItemId, { transaction: t });

      if (!orderItem) {
        throw new NotFoundError("Order item not found");
      }

      await orderItem.destroy({ transaction: t });
      await commit(t);

      Logger.info("Delete order item service ended...");
      return orderItem;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = OrderItemService;
