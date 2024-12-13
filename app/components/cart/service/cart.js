const cartConfig = require("../../../model-config/cart-config");
const cartItemConfig = require("../../../model-config/cart-item-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { createUUID } = require("../../../utils/uuid.js");
const { parseLimitAndOffset, parseFilterQueries, parseSelectFields } = require("../../../utils/request");

class CartService {
  #associationMap = {
    cartItem: {
      model: cartItemConfig.model,
      required: true,
    },
  };

  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }

    if (includeQuery?.includes(cartConfig.association.cartItem)) {
      associations.push(this.#associationMap.cartItem);
    }

    return associations;
  }

  async getCartByUserId(userId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get cart by User ID service started...");
      let selectArray = parseSelectFields(query, cartConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(cartConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      const associations = this.#createAssociations(includeQuery);

      console.log("the associations are", associations);
      const arg = {
        attributes: selectArray,
        where: { userId },
        include: [
          {
            model: cartItemConfig.model,
            required: false
          },
          
        ],
        transaction: t,
        // include: associations,
        
      };

      // console.log("the arg is",arg);

      const cart = await cartConfig.model.findOne(arg);

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      await commit(t);
      Logger.info("Get cart by User ID service ended...");
      return cart.cartItems;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async updateCart(userId, productId, quantity, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update cart service started...");
      const cart = await cartConfig.model.findOne({ where: { userId }, transaction: t });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      let cartItem = await cartItemConfig.model.findOne({
        where: { cartId: cart.id, productId },
        transaction: t,
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        if (cartItem.quantity <= 0) {
          await cartItem.destroy({ transaction: t });
        } else {
          await cartItem.save({ transaction: t });
        }
      } else if (quantity > 0) {
        await cartItemConfig.model.create(
          {id:createUUID(), cartId: cart.id, productId, quantity },
          { transaction: t }
        );
      }

      await commit(t);
      Logger.info("Update cart service ended...");
      return cart;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async clearCart(userId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Clear cart service started...");
      const cart = await cartConfig.model.findOne({ where: { userId }, transaction: t });

      if (!cart) {
        throw new NotFoundError("Cart not found");
      }

      await cartItemConfig.model.destroy({ where: { cartId: cart.id }, transaction: t });

      await commit(t);
      Logger.info("Clear cart service ended...");
      return cart;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = CartService;
