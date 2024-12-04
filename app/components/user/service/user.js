const userConfig = require("../../../model-config/user-config.js");
const Logger = require("../../../utils/logger.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../../../utils/email");
const { createUUID } = require("../../../utils/uuid");
const NotFoundError = require("../../../errors/notFoundError.js");
const orderConfig = require("../../../model-config/order-config.js");
const cartConfig = require("../../../model-config/cart-config.js");
// const { createUUID ,validateUUID} = require("../../../utils/uuid.js");
const {
  transaction,
  rollBack,
  commit,
} = require("../../../utils/transaction.js");
const {
  parseLimitAndOffset,
  parseFilterQueries,
  parseSelectFields,
} = require("../../../utils/request.js");

class UserService {
  // Define associations related to Orders and Cart
  #associationMap = {
    order: {
      model: orderConfig.model,
      required: true,
    },
    cart: {
      model: cartConfig.model,
      required: true,
    },
  };

  // Create associations (orders and cart)
  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }

    if (includeQuery?.includes(userConfig.association.order)) {
      associations.push(this.#associationMap.order);
    }

    if (includeQuery?.includes(userConfig.association.cart)) {
      associations.push(this.#associationMap.cart);
    }

    return associations;
  }

  // Find user by username (to be used for login, etc.)
  async findUser(username, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Find user by username service started...");
      const user = await userConfig.model.findOne(
        {
          where: { username },
        },
        { t }
      );
      commit(t);
      Logger.info("Find user by username service ended...");
      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  // Create User
  async createUser(
    id,
    firstName,
    lastName,
    username,
    password,
    email,
    dateOfBirth,
    isAdmin,
    address,
    city,
    profileImage,
    t
  ) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create user service started...");

      let fullName = `${firstName} ${lastName}`;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in the database
      const user = await userConfig.model.create(
        {
          id,
          firstName,
          lastName,
          fullName,
          username,
          password: hashedPassword,
          email,
          dateOfBirth,
          isAdmin,
          address,
          city,
          profileImage,
        },
        { t }
      );

      // Send email after successful registration
      // await sendEmail(
      //   email,
      //   "Registration successful",
      //   `Hi ${firstName}, Your registration is successful. Your username is: ${username}. Please visit the website to login.`
      // );

      // Optionally create cart for the user
      await cartConfig.model.create(
        { id:createUUID(),
          userId: id },
        { transaction: t }
      );

      // Commit transaction after user creation and email sending
      await commit(t);
      Logger.info("Create user service ended...");
      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  // Get all users with filters and pagination
  async getAllUsers(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get all users service started...");
      let selectArray = parseSelectFields(query, userConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(userConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, userConfig.filters),
        include: association,
      };

      const { count, rows } = await userConfig.model.findAndCountAll(arg);
      commit(t);
      Logger.info("Get all users service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  // Get user by ID
  async getUserById(userId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get user by ID service started...");
      let selectArray = parseSelectFields(query, userConfig.fieldMapping);
      console.log("the selected array is",selectArray);
      if (!selectArray) {
        selectArray = Object.values(userConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        where: { id: userId },
        transaction: t,
        include: association,
      };

      const response = await userConfig.model.findOne(arg);
      await commit(t);
      Logger.info("Get user by ID service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  // Update user information by ID (e.g., update address, profile image)
  async updateUserById(userId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update user by ID service called...");
      const user = await userConfig.model.findByPk(userId, { transaction: t });

      if (!user) {
        throw new NotFoundError(`User with ID ${userId} does not exist.`);
      }

      user[parameter] = value;

      await user.save({ transaction: t });
      commit(t);

      Logger.info("Update user by ID service ended...");
      return user;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Delete user by ID
  async deleteUserById(userId, t) {
    if (!t) {
      t = await transaction(t);
    }

    try {
      Logger.info("Delete user by ID service started...");

      const rowsDeleted = await userConfig.model.destroy({
        where: { id: userId },
        transaction: t,
      });

      if (rowsDeleted === 0) {
        throw new NotFoundError(`User with ID ${userId} does not exist.`);
      }

      await commit(t);
      Logger.info("Delete user by ID service ended...");
      return rowsDeleted;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
}

module.exports = UserService;
