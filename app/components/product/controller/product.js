const ProductService = require("../service/product");
const Logger = require("../../../utils/logger");
const { HttpStatusCode } = require("axios");
const NotFoundError = require("../../../errors/notFoundError");
const badRequest = require("../../../errors/badRequest");
const { createUUID ,validateUUID} = require("../../../utils/uuid.js");
const { setXTotalCountHeader } = require("../../../utils/response.js");
const {
 validatePrice,validateStockQuantity
} = require("../../../utils/validation.js");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // Create Product
  async createProduct(req, res, next) {
    try {
      Logger.info("Create product controller started...");
      const { categoryId } = req.params; // categoryId from req.params
      const { name, description, price, stockQuantity, image } = req.body;

      // Validate categoryId
      if (!validateUUID(categoryId)) {
        throw new badRequest("Invalid categoryId");
      }
      console.log("the price is",price);
      console.log("the stock quantity is",stockQuantity);
      console.log("the type of price is",typeof price);
      
      // if(!validatePrice(price))
      // {
      //   throw new badRequest("Invalid price");
      // }

      // if(!validateStockQuantity(stockQuantity))
      // {
      //   throw new badRequest("Invalid stock quantity");
      // }
      validatePrice(price);
      validateStockQuantity(stockQuantity);

      let id = createUUID();
      let response = await this.productService.createProduct(id, categoryId, name, description, price, stockQuantity, image);
      
      Logger.info("Create product controller ended...");
      res.status(HttpStatusCode.Created).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get All Products
  async getAllProducts(req, res, next) {
    try {
      Logger.info("Get all products controller called...");
      const { count, rows } = await this.productService.getAllProducts(req.query); // Pass req.query to the service
      setXTotalCountHeader(res, count);
      res.status(HttpStatusCode.Ok).json({
        data: rows,
        total: count,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Product by ID
  async getProductById(req, res, next) {
    try {
      Logger.info("Get product by ID controller called...");
      const { productId } = req.params;  // Fetch productId from URL params
      
      if (!validateUUID(productId)) {
        throw new badRequest("Invalid productId");
      }
      const response = await this.productService.getProductById(productId,req.query); // Pass productId to the service
      if (!response) throw new NotFoundError("Product not found");

      Logger.info("Get product by ID controller ended...");
      res.status(HttpStatusCode.Ok).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Update Product
  async updateProduct(req, res, next) {
    try {
      Logger.info("Update product controller started...");
      const { productId } = req.params;  // Fetch productId from URL params
      const { parameter, value } = req.body;
      if (!validateUUID(productId)) {
        throw new badRequest("Invalid productId");
      }


      let response = await this.productService.updateProduct(productId, parameter, value);
      if (!response) throw new NotFoundError("Product not found");

      Logger.info("Update product controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Product with ID ${productId} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

  // Delete Product
  async deleteProduct(req, res, next) {
    try {
      Logger.info("Delete product controller started...");
      const { productId } = req.params;  // Fetch productId from URL params
      if (!validateUUID(productId)) {
        throw new badRequest("Invalid productId");
      }
      let response = await this.productService.deleteProduct(productId);
      if (!response) throw new NotFoundError("Product not found");

      Logger.info("Delete product controller ended...");
      res.status(HttpStatusCode.Ok).json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
module.exports = productController;
