import { Request, Response } from "express";
import { Types } from "mongoose";
const cloudinary = require("../config/cloudinary").cloudinary;
const Book = require("../model/Book");
const Author = require("../model/Author");
const Category = require("../model/Category");
const {MulterFile} = require('multer')
//Type Defined
type AuthorType = {
  _id: Types.ObjectId,
  name: string,
  slug: string
}
type CategoryType = {
  _id: Types.ObjectId,
  name: string,
  slug: string
}
type BookType = {
  _id: string;
  name: string;
  categories: CategoryType[]; // mảng các ID của category
  images: string[]; // mảng các URL của ảnh
  release: string; // định dạng ngày dưới dạng chuỗi ISO
  authors: AuthorType[]; // mảng các ID của author
  description: string; // mô tả cuốn sách
  slug: string; // slug của sách
  // cover?: string[]; // nếu có thuộc tính cover trong response
}
type SlugType = {
  slug: string
}
type BookResponseType = {
  message: string;
  book: BookType
};

type BookRequestType = {
  name: string;
  categories: string[];
  release: Date;
  authors: string[];
  description: string;
};
type ExceptionType = {
  message: string;
};
type ResBookType = {
  message: string,
  book: BookType
}

//Type for update book
type MulterFile = {
  fieldname: string; // Tên trường (ví dụ: 'images' hoặc 'cover')
  originalname: string; // Tên file ban đầu
  encoding: string; // Kiểu mã hóa
  mimetype: string; // Kiểu MIME (ví dụ: 'image/jpeg')
  size: number; // Kích thước file (byte)
  path: string; // Đường dẫn tới file (nếu lưu trên Cloudinary, chứa URL)
  buffer?: Buffer; // Dữ liệu file (nếu dùng bộ nhớ tạm)
}
type UpdateBookBody = {
  name?: string;
  release?: string; // Hoặc Date nếu bạn xử lý trước
  description?: string;
  slug?: string;
  categories?: string[] | string;
  authors?: string[] | string;
  replaceIndexes?: number[] | string;
}
type UpdateBookParams = {
  slug: string;
}
type UpdateBookFiles = {
  images?: MulterFile[]; // File upload từ Multer
}
type UpdateBookTypeRequest = Request & {
  body: UpdateBookBody;
  params: UpdateBookParams;
  files?: UpdateBookFiles;
}
class BookController {
  /**
   * @swagger
   * /books/:
   *   post:
   *     summary: Create a new book
   *     description: Create a new book in the database.
   *     tags:
   *       - Books
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Book's name
   *                 example: "The Great Gatsby"
   *               category:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: A list categories of this book
   *                 example: ["Fiction", "Drama"]
   *               release:
   *                 type: string
   *                 format: date
   *                 description: The release of this book
   *                 example: "2024-11-01"
   *               author:
   *                 type: string
   *                 description: The author's name
   *                 example: "F. Scott Fitzgerald"
   *               description:
   *                 type: string
   *                 description: Description about this book
   *                 example: "A novel about the American dream and the moral decay of society."
   *               cover:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uri
   *                 description: Covers of this book
   *                 example: ["https://res.cloudinary.com/.../cover1.jpg", "https://res.cloudinary.com/.../cover2.jpg"]
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uri
   *                 description: Images regarding of this book
   *                 example: ["https://res.cloudinary.com/.../image1.jpg", "https://res.cloudinary.com/.../image2.jpg"]
   *     responses:
   *       201:
   *         description: Created book successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Created Successfully"
   *                 book:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                       example: "The Great Gatsby"
   *                     category:
   *                       type: array
   *                       items:
   *                         type: string
   *                       example: ["Fiction", "Drama"]
   *                     release:
   *                       type: string
   *                       format: date
   *                       example: "2024-11-01"
   *                     author:
   *                       type: string
   *                       example: "F. Scott Fitzgerald"
   *                     description:
   *                       type: string
   *                       example: "A novel about the American dream and the moral decay of society."
   *                     cover:
   *                       type: array
   *                       items:
   *                         type: string
   *                         format: uri
   *                       example: ["https://res.cloudinary.com/.../cover1.jpg"]
   *                     images:
   *                       type: array
   *                       items:
   *                         type: string
   *                         format: uri
   *                       example: ["https://res.cloudinary.com/.../image1.jpg"]
   *       400:
   *         description: Lack of something fields for the submission
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lack of information"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Something wrong"
   */
  public async createBook(
    req: Request<{}, BookResponseType, BookRequestType, {}>,
    res: Response
  ) {
    try {
      let { name, categories, release, authors, description } = req.body;

      if (!name) {
       res.status(400).json({ message: "Lack of information" });
      }

      // const coverUrls: string[] = [];
      const imageUrls: string[] = [];

      // Check and process "cover" and "images"
      // if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })['cover']) {
      //   for (const file of (req.files as { [fieldname: string]: Express.Multer.File[] })['cover']) {
      //     coverUrls.push(file.path);  // `file.path` đã được tự động lấy từ CloudinaryStorage
      //   }
      // }

      if (
        req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })["images"]
      ) {
        for (const file of (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        )["images"]) {
          imageUrls.push(file.path); // `file.path` đã được tự động lấy từ CloudinaryStorage
        }
      }

      const newBook = new Book({
        name,
        release: release || new Date(),
        description: description || "",
        // cover: coverUrls,  // Save URLs for Cover
        images: imageUrls, // Save URLs for Images
      });

      if (categories) {
        if (typeof categories === "string") {
          // Chuyển đổi chuỗi JSON thành mảng
          categories = JSON.parse(categories);
        }
        const validCategories = await Category.find({
          _id: { $in: categories },
        });
        if (validCategories.length !== categories.length) {
          res.status(404).json({ message: "Some categories did not exist" });
        }
        const addCategories = newBook.categories;
        addCategories.push(...categories);
      }
      if (authors) {
        if (typeof authors === "string") {
          authors = JSON.parse(authors);
        }
        const validAuthors = await Author.find({ _id: { $in: authors } });
        if (validAuthors.length !== authors.length) {
          res.status(404).json({ message: "Some author dit not exist" });
        }
        const addAuthor = newBook.authors;
        addAuthor.push(...authors);
      }
      await newBook.save();
      const response: BookResponseType = {
        message: "Created Successfully",
        book: {
          _id: newBook._id,
          name: newBook.name,
          categories: newBook.categories,
          images: newBook.images,
          release: newBook.release,
          authors: newBook.authors,
          description: newBook.description,
          slug: newBook.slug,
        },
      };
      res.status(201).json(response);
    } catch (ex) {
      console.error(ex);
      res.status(500).json({ message: "Something wrong" });
    }
  }

  /**
 * @swagger
 * /books/:
 *   get:
 *     summary: Get a list of all books
 *     description: Retrieve a list of all books available in the database.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get books successfully"
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "67345eebc0f0b8b95edbb6e5"
 *                       name:
 *                         type: string
 *                         example: "Đắc Nhân Tâm"
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["673433778e7468b82b9f1ecb"]
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: uri
 *                         example: ["https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/zanhq2fbcvvs8vmk7zij.jpg"]
 *                       release:
 *                         type: string
 *                         format: date
 *                         example: "2021-11-10T00:00:00.000Z"
 *                       authors:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["6734204a12567691df2d37e6"]
 *                       description:
 *                         type: string
 *                         example: "A detailed book about the art of winning people over, building relationships, and mastering self-discipline."
 *                       slug:
 *                         type: string
 *                         example: "dac-nhan-tam"
 *       400:
 *         description: No books available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nothing to show"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
  public async getBooks(req:Request, res:Response){
    try{
      const books = await Book.find().populate('authors', '_id name').populate('categories','_id name')
      if(books){
         res.status(200).json({
          message: 'Get books successfully',
          books
        })
      }
      else{
         res.status(400).json({message: 'Nothing to show'})
      }
    }
    catch(ex){
       res.status(500).json({message:'Something wrong'})
    }
  }
  /**
 * @swagger
 * /books/{slug}:
 *   get:
 *     summary: Get details of a book by its slug
 *     tags:
 *       - Books
 *     description: Retrieve detailed information about a book using its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the book to retrieve details for
 *         schema:
 *           type: string
 *           example: "dac-nhan-tam"
 *     responses:
 *       200:
 *         description: Successfully retrieved book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get Book Successfully"
 *                 book:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67345eebc0f0b8b95edbb6e5"
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6734204a12567691df2d37e6"]
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["673433778e7468b82b9f1ecb"]
 *                     description:
 *                       type: string
 *                       example: "Nói một cách tổng quát thì Đắc Nhân Tâm là cuốn sách hay nên đọc chia sẻ về nghệ thuật thu phục lòng người, cách làm những người xung quanh yêu quý mình hơn. Cuốn sách dành cho tất cả mọi người, không phân biệt lứa tuổi..."
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       example: [
 *                         "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/zanhq2fbcvvs8vmk7zij.jpg",
 *                         "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485419/images/camamlvmxdaxwvoz0oka.jpg"
 *                       ]
 *                     name:
 *                       type: string
 *                       example: "Đắc Nhân Tâm"
 *                     release:
 *                       type: string
 *                       format: date
 *                       example: "2021-11-10"
 *                     slug:
 *                       type: string
 *                       example: "dac-nhan-tam"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nothing to show"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unknown Error!"
 */
  public async getBookDetail(req:Request<SlugType,{},{},{}>, res: Response<ResBookType|ExceptionType>){
    try{
      const {slug} = req.params
      const book = await Book.findOne({slug: slug}).populate('authors', '_id name avatar').populate('categories','_id name')
      if(book){
        const successResponse : ResBookType = {
          message: 'Get Book Successfully',
          book: {
            _id: book._id,
            authors: book.authors,
            categories: book.categories,
            description: book.description,
            images: book.images,
            name: book.name,
            release: book.release,
            slug: book.slug
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
 * /books/{slug}:
 *   patch:
 *     summary: Update book information
 *     tags:
 *       - Books
 *     description: Update the title, description, categories, authors, and images of a book based on the book's slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the book to update.
 *         schema:
 *           type: string
 *           example: "dac-nhan-tam"
 *       - in: query
 *         name: replaceIndexes
 *         required: false
 *         description: Array of indexes of images that need to be replaced in the book’s image array.
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *           example: [0, 1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the book.
 *                 example: "The Art of People"
 *               release:
 *                 type: string
 *                 format: date
 *                 description: The release date of the book.
 *                 example: "2024-11-20"
 *               description:
 *                 type: string
 *                 description: A description of the book.
 *                 example: "A book about the art of influencing people and understanding relationships."
 *               slug:
 *                 type: string
 *                 description: The slug of the book, used as the URL.
 *                 example: "dac-nhan-tam"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The list of categories associated with the book.
 *                 example: ["fiction", "self-help"]
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The list of authors of the book.
 *                 example: ["author-id-1", "author-id-2"]
 *               replaceIndexes:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: The indexes of the images that need to be replaced.
 *                 example: [0, 1]
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 book:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6473b7b74a0e63e0b9d217a3"
 *                     name:
 *                       type: string
 *                       example: "The Art of People"
 *                     release:
 *                       type: string
 *                       format: date
 *                       example: "2024-11-20"
 *                     description:
 *                       type: string
 *                       example: "A book about the art of influencing people and understanding relationships."
 *                     slug:
 *                       type: string
 *                       example: "dac-nhan-tam"
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["fiction", "self-help"]
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["author-id-1", "author-id-2"]
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       example: [
 *                         "https://res.cloudinary.com/example/image/upload/v1234567890/images/example1.jpg",
 *                         "https://res.cloudinary.com/example/image/upload/v1234567891/images/example2.jpg"
 *                       ]
 *       400:
 *         description: Invalid or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Book not found or some categories/authors do not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found or some categories/authors do not exist"
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

  public async updateBook(req: UpdateBookTypeRequest, res: Response<ResBookType|ExceptionType>) {
    try {
      const slug = req.params.slug;
      const updateData = req.body;
      const newImageUrls: string[] = [];
  
      // Kiểm tra sự tồn tại của Book
      const book = await Book.findOne({slug:slug});
      if (!book) {
         res.status(404).json({ message: "Book not found" });
      }
  
      // Cập nhật các trường đơn giản
      if (updateData.name) book.name = updateData.name;
      if (updateData.release) book.release = new Date(updateData.release);
      if (updateData.description) book.description = updateData.description;
      if (updateData.slug) book.slug = updateData.slug;
  
      // Cập nhật categories nếu có
      if (updateData.categories) {
        let categories = updateData.categories;
        if (typeof categories === "string") {
          categories = JSON.parse(categories);
        }
        const validCategories = await Category.find({
          _id: { $in: categories },
        });
        if (validCategories.length !== categories.length) {
           res.status(404).json({ message: "Some categories did not exist" });
        }
        book.categories = categories;
      }
  
      // Cập nhật authors nếu có
      if (updateData.authors) {
        let authors = updateData.authors;
        if (typeof authors === "string") {
          authors = JSON.parse(authors);
        }
        const validAuthors = await Author.find({ _id: { $in: authors } });
        if (validAuthors.length !== authors.length) {
           res.status(404).json({ message: "Some authors did not exist" });
        }
        book.authors = authors;
      }
      
      // Parse `replaceIndexes` từ chuỗi JSON nếu cần
      let replaceIndexes: number[] = [];
      if (updateData.replaceIndexes) {
        if (typeof updateData.replaceIndexes === "string") {
          replaceIndexes = JSON.parse(updateData.replaceIndexes);
        } else {
          replaceIndexes = updateData.replaceIndexes;
        }
      }
  
      // Cập nhật images nếu có
      if (replaceIndexes.length > 0 && req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })["images"]) {
        for (const file of (req.files as { [fieldname: string]: Express.Multer.File[] })["images"]) {
          newImageUrls.push(file.path);
        }
  
        const currentImages = book.images;
        replaceIndexes.forEach((index, i) => {
          if (index < currentImages.length && i < newImageUrls.length) {
            currentImages[index] = newImageUrls[i]; // Thay thế ảnh cũ bằng ảnh mới
          }
        });
  
        // Thêm ảnh mới nếu còn dư
        if (newImageUrls.length > replaceIndexes.length) {
          currentImages.push(...newImageUrls.slice(replaceIndexes.length));
        }
  
        book.images = currentImages;
      }
  
      // Lưu cập nhật Book
      await book.save();
  
      res.status(200).json({
        message: "Book updated successfully",
        book: {
          _id: book._id,
          name: book.name,
          categories: book.categories,
          images: book.images,
          release: book.release,
          authors: book.authors,
          description: book.description,
          slug: book.slug,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  

  /**
 * @swagger
 * /books/{slug}:
 *   delete:
 *     summary: Delete a book by its slug
 *     tags:
 *       - Books
 *     description: Remove a book from the database using its slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the book to delete
 *         schema:
 *           type: string
 *           example: "dac-nhan-tam"
 *     responses:
 *       200:
 *         description: Successfully deleted the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 error:
 *                   type: object
 */

  public async deleteBook(req: Request<{ slug: string }>, res: Response) {
    try {
      const { slug } = req.params;

      // Tìm và xóa sách dựa trên slug
      const book = await Book.findOneAndDelete({ slug });
      if (!book) {
         res.status(404).json({ message: "Book not found" });
      }

      // Xóa thành công
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  }

}

export default new BookController();
