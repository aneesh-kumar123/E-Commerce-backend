const categoryConfig = require("../../../model-config/category-config");
const productConfig = require("../../../model-config/product-config");
const Logger = require("../../../utils/logger");
const NotFoundError = require("../../../errors/notFoundError");
const { transaction, rollBack, commit } = require("../../../utils/transaction");
const { parseLimitAndOffset, parseFilterQueries,parseSelectFields } = require("../../../utils/request");
const { createUUID } = require("../../../utils/uuid");


class CategoryService {
  
  #associationMap = {
    product: {
      model: productConfig.model,
      required: true,
    },
  };

  
  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }

    if (includeQuery?.includes(categoryConfig.association.product)) {
      associations.push(this.#associationMap.product);
    }

    return associations;
  }


  async createCategory(id,name, description, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Create category service started...");
      let response = await categoryConfig.model.create(
        { id,
          name,
          description,
        },
        { transaction: t }
      );

      await commit(t);
      Logger.info("Create category service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }


  async getAllCategories(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get all categories service started...");
      let selectArray = Object.values(categoryConfig.fieldMapping);
      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, categoryConfig.filters),
      };

      const { count, rows } = await categoryConfig.model.findAndCountAll(arg);
      await commit(t);
      Logger.info("Get all categories service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

 
  async getCategoryById(categoryId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Get category by ID service started...");
      let selectArray = parseSelectFields(query, categoryConfig.fieldMapping);
      console.log("the selected array is",selectArray);
      if (!selectArray) {
        selectArray = Object.values(categoryConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      // console.log("the association is",association);
      // console.log("the selected array is",selectArray);

      const arg = {
        attributes: selectArray,
        where: { id: categoryId },
        transaction: t,
        include: association,
      };

      console.log("the arg is",arg);
      
      const category = await categoryConfig.model.findOne(arg);
      await commit(t);
      Logger.info("Get category by ID service ended...");
      return category;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Update Category
  async updateCategory(categoryId, parameter, value, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Update category service started...");
      const category = await categoryConfig.model.findByPk(categoryId, { transaction: t });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      // category.name = name || category.name;
      // category.description = description || category.description;
      category[parameter] = value;

      await category.save({ transaction: t });
      await commit(t);

      Logger.info("Update category service ended...");
      return category;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  // Delete Category
  async deleteCategory(categoryId, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("Delete category service started...");
      const category = await categoryConfig.model.findByPk(categoryId, { transaction: t });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      await category.destroy({ transaction: t });
      await commit(t);
      Logger.info("Delete category service ended...");
      return category;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }

  async addMultipleCategory(category, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Add multiple category service started...");

      const categoryPromise = category.map(async (category) => {
        await categoryConfig.model.create(
          {
            ...category,
            id: createUUID(), // Ensure each employee gets a unique ID
          },
          { transaction: t }
        );
      });

      await Promise.all(categoryPromise);

      await commit(t);

      Logger.info("Add multiple employees service ended...");
      return category;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = CategoryService;
