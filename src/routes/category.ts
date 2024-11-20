import express, { Router } from "express";
const router: Router = express.Router();
const categoryController = require("../controllers/category");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */
router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);

router.patch("/:slug/", categoryController.updateCategory)
router.get("/:slug/", categoryController.getCategorytDetail)
module.exports = router;