  import { Request, Response } from "express";
  const Author = require("../model/Author");
  const cloudinary = require('../config/cloudinary').cloudinary;

  //Type Defined
  type AuthorNameType = {
    name: string;
  };
  type AuthorType = {
    name:string,
    avatar: string,
    _id: string,
    slug: string
  }
  type ResAuthorType = {
    message: string,
    author: AuthorType
  };
  
  type ResAuthorsType = AuthorType[];
  
  type ExceptionType = {
    message: string
  }

  type SlugType = {
    slug: string
  }
  //Class Controller
  class AuthorController {
    /**
     * @swagger
     * /authors/:
     *   post:
     *     summary: Create a new author
     *     tags:
     *        - Authors
     *     description: Create a new author in the database
     *     requestBody:
     *       required: true
     *       content:
     *         form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               avatar:
     *                 type: file
     *     responses:
     *       201:
     *         description: Author created successfully
     *       500:
     *         description: Server error
     */
    public async createAuthor(
      req: Request<{}, ResAuthorType, AuthorNameType, {}>,
      res: Response<ResAuthorType|ExceptionType>
    ) {
      try {
        const { name } = req.body;
        if (!name) {
           res
            .status(403)
            .json({ message: "Please filled out the author name!" });
        }
        //
        let avatar = "";
        if (req.file) {
          await cloudinary.uploader
            .upload_stream(
              { resource_type: "auto" },
              async (error: any, result: any) => {
                if (error) {
                   res.status(400).json({ message: "Can not upload file" });
                }
                avatar = result.secure_url;

                const author = new Author({
                  name: name,
                  avatar: avatar,
                });
                
                try {
                  await author.save();
                   res.status(201).json({message:'Author created successfully', author});
                } catch (ex: any) {
                   res.status(500).send(ex.message);
                }
              }
            )
            .end(req.file.buffer);
        } else {
          const newAuthor = new Author({
            name: name,
            avatar: avatar,
          });
          
          await newAuthor.save();
          const successResponse:ResAuthorType = {
            message : 'Created Successfully',
            author:{
              _id: newAuthor._id,
              avatar: newAuthor.avatar,
              name: newAuthor.name,
              slug: newAuthor.slug
            }
          }
           res
            .status(201)
            .json(successResponse);
        }
      } catch (ex) {
        if (ex instanceof Error) {
           res.status(500).json({ message: ex.message });
        } else {
           res.status(500).json({ message: "Unknown Error!" });
        }
      }
    }

    /**
    * @swagger
    * /authors/:
    *   get:
    *     summary: Get all authors
    *     tags:
    *        - Authors
    *     description: Retrieve a list of all authors
    *     responses:
    *       200:
    *         description: A list of authors
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
    public async getAuthors(req: Request, res: Response<ResAuthorsType | ExceptionType>) {
      try {
        const authors = await Author.find({});
         res.status(200).json(authors);
      } catch (ex) {
        if (ex instanceof Error) {
           res.status(500).json({ message: ex.message });
        } else {
           res.status(500).json({ message: "Unknown Error!" });
        }
      }
    }

    /**
 * @swagger
 * /authors/{slug}:
 *   get:
 *     summary: Get author details by slug
 *     tags:
 *        - Authors
 *     description: Retrieve detailed information of an author by their slug
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: The slug of the author to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get Author Successfully"
 *                 author:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6734204a12567691df2d37e6"
 *                     name:
 *                       type: string
 *                       example: "Dale Carnegie"
 *                     avatar:
 *                       type: string
 *                       example: "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731469385/h3qk9vo7yv8whergfvqf.jpg"
 *                     slug:
 *                       type: string
 *                       example: "dale-carnegie"
 *       404:
 *         description: Author not found for the given slug
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
    public async getAuthorDetail(req:Request<SlugType,{},{},{}>, res: Response<ResAuthorType | ExceptionType>){
      try{
        const {slug} = req.params
        const author = await Author.findOne({slug: slug})
        if(author){
          const successResponse : ResAuthorType = {
            message: 'Get Author Successfully',
            author: {
              name:author.name,
              avatar: author.avatar,
              _id: author._id,
              slug: author.slug
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
 * /authors/{slug}:
 *   patch:
 *     summary: Update an existing author's information
 *     tags:
 *        - Authors
 *     description: Update the name and/or avatar of an author
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: The slug of the author to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
    public async updateAuthor(req: Request<SlugType, {}, AuthorNameType, {}>, res: Response<ResAuthorType | ExceptionType>) {
      try {
        const { slug } = req.params;
        const { name } = req.body;
  
        const author = await Author.findOne({ slug });
  
        if (!author) {
           res.status(404).json({ message: "Author not found" });
        }
        if (name) {
          author.name = name;
        }
  
        if (req.file) {
          const avatarUrl = await new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { resource_type: "auto" },
              (error: any, result: any) => {
                if (error) {
                  reject("Can not upload file");  
                } else {
                  resolve(result.secure_url); 
                }
              }
            ).end(req?.file?.buffer); 
          });
  
          author.avatar = avatarUrl; 
        }
  
        
        await author.save();
        const successResponse : ResAuthorType = {
          message : 'Author updated successfully',
          author:{
            _id: author._id,
            avatar: author.avatar,
            name: author.name,
            slug:author.slug
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

  export default new AuthorController();
