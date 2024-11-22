import { Request, Response } from "express";
const Category = require('../model/Category');

type CategoryNameType = {
  name: string;
}
type CategoryType = {
  name: string,
  slug: string
}
type SlugType = {
  slug: string
}
type ResCategoryType = {
  message: string,
  category: CategoryType
}
type ExceptionType = {
  message: string
}

class CategoryController {
  /**
   * @swagger
   * /categories/:
   *   post:
   *     summary: Create a new category
   *     tags:
   *       - Categories
   *     description: Create a new category in the database
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the category to be created
   *                 example: "Fiction"
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Insert New Category Successfully!"
   *                 category:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       example: "5f2a9cb3f1c9c6a84ed4323a"
   *                     name:
   *                       type: string
   *                       example: "Fiction"
   *       400:
   *         description: Bad request, invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Category name is required"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Unknown Error!"
   */
  public async createCategory(req: Request<{}, ResCategoryType, CategoryNameType, {}>, res: Response<ResCategoryType | ExceptionType>) {
    try {
      const { name } = req.body;
      const category = new Category({
        name: name,
      });

      await category.save();
       res.status(201).json({ message: 'Insert New Category Successfully!', category });
    }
    catch (ex) {
      if (ex instanceof Error) {
         res.status(500).json({ message: ex.message });
      } else {
         res.status(500).json({ message: 'Unknown Error!' });
      }
    }
  }

  /**
   * @swagger
   * /categories/:
   *   get:
   *     summary: Get all categories
   *     tags:
   *         - Categories
   *     description: Retrieve a list of all categories
   *     responses:
   *       200:
   *         description: A list of categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *       500:
   *         description: Server error
   */
  public async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find({});
       res.status(200).json(categories);
    }
    catch (ex) {
      if (ex instanceof Error) {
         res.status(500).json({ message: ex.message });
      } else {
         res.status(500).json({ message: 'Unknown Error!' });
      }
    }
  }

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get details of a specific category
 *     description: Retrieve the details of a category based on the provided slug.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the category to retrieve details for.
 *         schema:
 *           type: string
 *           example: "trinh-tham"
 *     responses:
 *       200:
 *         description: Successfully fetched the category details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get Category Successfully"
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Trinh thám"
 *                     slug:
 *                       type: string
 *                       example: "trinh-tham"
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nothing to show"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unknown Error!"
 */

  public async getCategorytDetail(req:Request<SlugType,ResCategoryType,{},{}>, res: Response<ResCategoryType | ExceptionType>){
      try{
        const {slug} = req.params
        const category = await Category.findOne({slug: slug})
        if(category){
          const successResponse : ResCategoryType = {
            message: 'Get Category Successfully',
            category:{
              name: category.name,
              slug: category.slug
            }
            
          }
           res.status(200).json(successResponse)
        }
        else{
           res.status(200).json({message: "Nothing to show"})
        }
      }
      catch(ex){
        if (ex instanceof Error) {
           res.status(500).json({ message: ex.message });
        } else {
           res.status(500).json({ message: "Unknown Error!" });
        }
      }
    }

/**
 * @swagger
 * /categories/{slug}:
 *   patch:
 *     summary: Update an existing category
 *     description: Update the name of a category based on the provided slug.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the category to update.
 *         schema:
 *           type: string
 *           example: "tam-ly"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category.
 *                 example: "Tâm Lý"
 *     responses:
 *       200:
 *         description: Successfully updated the category details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category updated successfully"
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tâm Lí"
 *                     slug:
 *                       type: string
 *                       example: "tam-li"
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category not found"
 *       400:
 *         description: Invalid request or bad data format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unknown Error!"
 */

    public async updateCategory(req: Request<SlugType,{}, CategoryNameType, {}>, res: Response<ResCategoryType | ExceptionType>) {
      try {
        const { slug } = req.params;
        const { name } = req.body;
  
        const category = await Category.findOne({ slug });
  
        if (!category) {
           res.status(404).json({ message: "Category not found" });
        }
        if (name) {
          category.name = name;
        }
  
        await category.save();
        const successResponse : ResCategoryType = {
          message : 'Category updated successfully',
          category:{
            name: category.name,
            slug: category.slug
          }
        }
         res.status(200).json(successResponse);
      } catch (ex) {
        if (ex instanceof Error) {
           res.status(500).json({ message: ex.message });
        } else {
           res.status(500).json({ message: "Unknown Error!" });
        }
      }
    }
}

module.exports = new CategoryController();
