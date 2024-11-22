const multer = require('multer')
const storage = multer.memoryStorage();
import express, { Router } from "express";
const router: Router = express.Router();
const bookController = require("../controllers/book").default;
const {upload} = require('../config/cloudinary')

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */
router.post('/',
    upload,
    bookController.createBook
)
router.get('/', bookController.getBooks)
router.delete('/:slug/', bookController.deleteBook)
router.patch('/:slug/',upload, bookController.updateBook)
router.get('/:slug/', bookController.getBookDetail)
module.exports = router;