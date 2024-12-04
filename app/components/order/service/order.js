const orderConfig = require("../../../model-config/order-config");
const userConfig = require("../../../model-config/user-config");
const orderItemConfig = require("../../../model-config/order-item-config");
const cartConfig = require("../../../model-config/cart-config");
const cartItemConfig = require("../../../model-config/cart-item-config");
const productConfig = require("../../../model-config/product-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { parseLimitAndOffset, parseFilterQueries, parseSelectFields } = require("../../../utils/request");
const { createUUID } = require("../../../utils/uuid");

class OrderService {
  #associationMap = {
    orderItem: {
      model: orderItemConfig.model,
      required: true,
    },
  };

  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }

    if (includeQuery?.includes(orderConfig.association.orderItem)) {
      associations.push(this.#associationMap.orderItem);
    }

    return associations;
  }

  
  async createOrder(id,userId, orderStatus, totalAmount, paymentStatus, paymentMethod, shippingAddress, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create order service started...");



      
      const cart = await cartConfig.model.findOne({
        where: { userId },
        include: [
          {
            model: cartItemConfig.model,
            required: true
          },
          
        ],
        // attributes:["productId", "quantity"],
        transaction: t,
      });

      // console.log("the cartIteConfig is", cartItemConfig.model);

      console.log("the cart is", cart);

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }



  
      let calculatedTotalAmount = 0;
      for (let cartItem of cart.cartItems) {
        // const product = await cartItem.product; 
        const product = await productConfig.model.findOne({ where: { id: cartItem.productId }, transaction: t });
        // console.log("the product is", product);
        if (!product) {
          throw new NotFoundError("Product not found");
        }
        calculatedTotalAmount += product.price * cartItem.quantity;
      }
        
      const user= await userConfig.model.findByPk(userId, { transaction: t });
      // console.log("the user is", user);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      const userAddress = user.address;
      // console.log("the user address is", userAddress);

   
      const response = await orderConfig.model.create(
        { id,
          userId, 
          orderStatus, 
          totalAmount: calculatedTotalAmount, 
          paymentStatus, 
          paymentMethod, 
          shippingAddress: userAddress,
        },
        { transaction: t }
      );


      console.log("the cartItem is", cart.cartItems);

      
      for (let cartItem of cart.cartItems) {
        const product = await productConfig.model.findOne({ where: { id: cartItem.productId }, transaction: t });
        await orderItemConfig.model.create(
          { id:createUUID(),
            orderId: response.id, 
            productId: cartItem.productId, 
            quantity: cartItem.quantity,
            priceAtOrder: product.price 
          },
          { transaction: t }
        );
      }

 
      await commit(t);
      Logger.info("Create order service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  
  async getAllOrders(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get all orders service started...");
      // let selectArray = Object.values(orderConfig.fieldMapping);
      let selectArray = parseSelectFields(query, orderConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(orderConfig.fieldMapping);
      }
      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, orderConfig.filters),
      };

      const { count, rows } = await orderConfig.model.findAndCountAll(arg);
      await commit(t);
      Logger.info("Get all orders service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

 
  async getOrderById(userId,orderId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get order by ID service started...");
      let selectArray = parseSelectFields(query, orderConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(orderConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        where: { id: orderId },
        transaction: t,
        include: association,
      };

      const order = await orderConfig.model.findOne(arg);
      await commit(t);
      Logger.info("Get order by ID service ended...");
      return order;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

 
  async updateOrder(orderId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update order service started...");
      const order = await orderConfig.model.findByPk(orderId, { transaction: t });

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      order[parameter] = value;

      await order.save({ transaction: t });
      await commit(t);

      Logger.info("Update order service ended...");
      return order;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async deleteOrder(orderId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Delete order service started...");
      const order = await orderConfig.model.findByPk(orderId, { transaction: t });

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      await order.destroy({ transaction: t });
      await commit(t);

      Logger.info("Delete order service ended...");
      return order;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = OrderService;
