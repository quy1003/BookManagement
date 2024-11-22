import express, { Router } from "express";
const router: Router = express.Router();
import authorController from '../controllers/author'
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */
router.post("/", upload.single('avatar'), authorController.createAuthor);
router.get("/", authorController.getAuthors);
router.patch("/:slug/", upload.single('avatar'), authorController.updateAuthor)

router.get("/:slug/", authorController.getAuthorDetail)

module.exports = router;