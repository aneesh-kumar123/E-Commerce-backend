const productConfig = require("../../../model-config/product-config");
// const categoryConfig = require("../../../model-config/category-config");
const orderItemConfig = require("../../../model-config/order-item-config");
const cartItemConfig = require("../../../model-config/cart-item-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, commit, rollBack } = require("../../../utils/transaction");
const { parseLimitAndOffset, parseFilterQueries, parseSelectFields } = require("../../../utils/request");

class ProductService {
  // Association Map
  #associationMap = {
    orderItem: {
      model: orderItemConfig.model,
      required: true,
    },
    cartItem: {
      model: cartItemConfig.model,
      required: true,
    },
    // category: {
    //   model: categoryConfig.model,
    //   required: true,
    // },
  };

  // Create associations
  #createAssociations(includeQuery) {
    const associations = [];
    
    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }

    if (includeQuery?.includes("orderItem")) {
      associations.push(this.#associationMap.orderItem);
    }

    if (includeQuery?.includes("cartItem")) {
      associations.push(this.#associationMap.cartItem);
    }

   

    return associations;
  }

  // Create Product
  async createProduct(id, categoryId, name, description, price, stockQuantity, image, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create product service started...");
      const product = await productConfig.model.create(
        {
          id,
          categoryId,
          name,
          description,
          price,
          stockQuantity,
          image,
        },
        { transaction: t }
      );

      await commit(t);
      Logger.info("Create product service ended...");
      return product;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Get All Products
  async getAllProducts(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get all products service started...");
      let selectArray = parseSelectFields(query, productConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(productConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = this.#createAssociations(includeQuery);

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, productConfig.filters),
        include: association,
      };

      const { count, rows } = await productConfig.model.findAndCountAll(arg);
      await commit(t);
      Logger.info("Get all products service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Get Product by ID
  async getProductById(productId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get product by ID service started...");
      let selectArray = parseSelectFields(query, productConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(productConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = this.#createAssociations(includeQuery);

      const arg = {
        attributes: selectArray,
        where: { id: productId },
        transaction: t,
        include: association,
      };

      const product = await productConfig.model.findOne(arg);
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      await commit(t);
      Logger.info("Get product by ID service ended...");
      return product;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Update Product
  async updateProduct(productId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update product service started...");
      const product = await productConfig.model.findByPk(productId, { transaction: t });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      product[parameter] = value;
      await product.save({ transaction: t });
      await commit(t);

      Logger.info("Update product service ended...");
      return product;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Delete Product
  async deleteProduct(productId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Delete product service started...");
      const product = await productConfig.model.findByPk(productId, { transaction: t });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      await product.destroy({ transaction: t });
      await commit(t);
      Logger.info("Delete product service ended...");
      return product;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = ProductService;
