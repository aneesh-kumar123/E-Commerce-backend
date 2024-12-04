const { HttpStatusCode } = require("axios");
const UserService = require("../service/user");
const { createUUID, validateUUID } = require("../../../utils/uuid.js");
const { setXTotalCountHeader } = require("../../../utils/response.js");
const Logger = require("../../../utils/logger.js");
const badRequest = require("../../../errors/badRequest.js");
const NotFoundError = require("../../../errors/notFoundError.js");
const bcrypt = require("bcrypt");

const {
  validateFirstName,
  validateLastName,
  validateEmail,
  validateDob,
  validateParameter,
} = require("../../../utils/validation.js");
const { newPayload } = require("../../../middleware/authService.js");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Login Operation
  async login(req, res, next) {
    try {
      Logger.info("Login controller started");
      const { username, password } = req.body;
      
      if (typeof username !== "string") throw new badRequest("Invalid username type");
      if (typeof password !== "string") throw new badRequest("Invalid password type");

      const user = await this.userService.findUser(username);
      if (!user) throw new NotFoundError("User does not exist...");

      if (await bcrypt.compare(password, user.password)) {
        let payload = newPayload(user.id, user.isAdmin);
        let token = payload.signPayload();
        res.cookie("auth", `Bearer ${token}`);
        res.set("auth", `Bearer ${token}`);
        Logger.info("Login controller ended...");
        res.status(200).send(token);
      } else {
        res.status(403).json({ message: "Password incorrect" });
      }
    } catch (error) {
      next(error);
    }
  }

  // Create User (Admin User)
  async createAdmin(req, res, next) {
    try {
      Logger.info("Create admin controller started...");
      const { firstName, lastName, username, password, email, dateOfBirth } = req.body;
      
      validateFirstName(firstName);
      validateLastName(lastName);
      validateEmail(email);
      validateDob(dateOfBirth);

      if (firstName === lastName) throw new badRequest("First name and last name cannot be the same.");
      if (typeof username !== "string") throw new badRequest("Invalid username type");
      if (typeof password !== "string") throw new badRequest("Invalid password type");

      let id = createUUID();
      let response = await this.userService.createUser(
        id, firstName, lastName, username, password, email, dateOfBirth, true
      );
      
      Logger.info("Create admin controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Create Regular User
  async createUser(req, res, next) {
    try {
      Logger.info("Create user controller started...");
      const { firstName, lastName, username, password, email, dateOfBirth, address, city, profileImage } = req.body;

      validateFirstName(firstName);
      validateLastName(lastName);
      validateEmail(email);
      validateDob(dateOfBirth);

      if (typeof username !== "string") throw new badRequest("Invalid username type");
      if (typeof password !== "string") throw new badRequest("Invalid password type");

      let id = createUUID();
      let response = await this.userService.createUser(
        id, firstName, lastName, username, password, email, dateOfBirth, false, address, city, profileImage
      );
      
      Logger.info("Create user controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get All Users
  async getAllUsers(req, res, next) {
    try {
      Logger.info("Get all users controller called...");
      const { count, rows } = await this.userService.getAllUsers(req.query);
      setXTotalCountHeader(res, count);
      
      res.status(HttpStatusCode.Ok).json({
        data: rows,
        total: count,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get User by ID
  async getUserById(req, res, next) {
    try {
      Logger.info("Get user by ID controller called...");
      const { userId } = req.params;
      if (!validateUUID(userId)) {
        throw new badRequest("Invalid user ID...");
      }

      const response = await this.userService.getUserById(userId,req.query);
      // console.log("the response here is",response);
      Logger.info("Get user by ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update User
  async updateUserById(req, res, next) {
    try {
      Logger.info("Update user by ID controller called...");
      const { userId } = req.params;
      const { parameter, value } = req.body;

      if (!validateUUID(userId)) {
        throw new badRequest("Invalid user ID...");
      }

      validateParameter(parameter);

      const response = await this.userService.updateUserById(
        userId, parameter, value
      );
      if (!response) throw new NotFoundError("User not found or update failed.");
      
      res.status(HttpStatusCode.Ok).json({ message: `User with ID ${userId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

  // Delete User
  async deleteUserById(req, res, next) {
    try {
      Logger.info("Delete user by ID controller called...");
      const { userId } = req.params;
      if (!validateUUID(userId)) {
        throw new badRequest("Invalid user ID...");
      }

      const response = await this.userService.deleteUserById(userId);
      if (!response) throw new NotFoundError("User not found or deletion failed.");
      
      res.status(HttpStatusCode.Ok).json({ message: `User with ID ${userId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
module.exports = userController;
