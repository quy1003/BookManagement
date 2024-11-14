import express, { Router } from "express";
const router: Router = express.Router();
const authorController = require("../controllers/author");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */
router.post("/create-author/", upload.single('avatar'), authorController.createAuthor);
router.get("/", authorController.getAuthors);
router.patch("/update-author/:slug/", upload.single('avatar'), authorController.updateAuthor)

router.get("/:slug/", authorController.getAuthorDetail)

module.exports = router;