const CategoryService = require("../service/category");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const badRequest = require("../../../errors/badRequest");
const { createUUID, validateUUID } = require("../../../utils/uuid.js");
const { setXTotalCountHeader } = require("../../../utils/response.js");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  // Create Category
  async createCategory(req, res, next) {
    try {
      Logger.info("Create category controller started...");
      const { name, description } = req.body;

      if (typeof name !== "string") {
        throw new badRequest("Invalid category name type");
      }
      let id = createUUID();
      let response = await this.categoryService.createCategory(id,name, description);
      Logger.info("Create category controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get All Categories
  async getAllCategories(req, res, next) {
    try {
      Logger.info("Get all categories controller called...");
      const { count, rows } = await this.categoryService.getAllCategories(req.query);
      setXTotalCountHeader(res, count);
      res.status(HttpStatusCode.Ok).json({
        data: rows,
        total: count,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Category by ID
  async getCategoryById(req, res, next) {
    try {
      Logger.info("Get category by ID controller called...");
      const { categoryId } = req.params;


      if (!validateUUID(categoryId)) {
        throw new badRequest("Invalid category ID...");
      }

      const response = await this.categoryService.getCategoryById(categoryId, req.query);
      if (!response) throw new NotFoundError("Category not found");

      Logger.info("Get category by ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update Category
  async updateCategory(req, res, next) {
    try {
      Logger.info("Update category controller started...");
      const { categoryId } = req.params;
      const { parameter, value } = req.body;

      if (!validateUUID(categoryId)) {
        throw new badRequest("Invalid category ID...");
      }

      let response = await this.categoryService.updateCategory(categoryId, parameter, value);
      if (!response) throw new NotFoundError("Category not found");

      Logger.info("Update category controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Category with ID ${categoryId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

  // Delete Category
  async deleteCategory(req, res, next) {
    try {
      Logger.info("Delete category controller started...");
      const { categoryId } = req.params;

      if (!validateUUID(categoryId)) {
        throw new badRequest("Invalid category ID...");
      }

      let response = await this.categoryService.deleteCategory(categoryId);
      if (!response) throw new NotFoundError("Category not found");

      Logger.info("Delete category controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Category with ID ${categoryId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const categoryController = new CategoryController();
module.exports = categoryController;