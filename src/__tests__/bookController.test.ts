import request from 'supertest';
import app from '../index';
import { Server } from 'http';

let server: Server;

beforeAll(() => {
  server = app.listen(0); // Lắng nghe cổng 3000
});

afterAll(() => {
  server.close(); // Đóng server sau khi tất cả các test chạy xong
});
describe('Book API', () => {
    
  it('should return a list of books', async () => {
    const res = await request(app).get('/books/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('books');
    expect(res.body.books).toEqual([
            {
                "_id": "673db9c7e4e8d7a9e061afb2",
                "name": "Dark Nhân Tâm",
                "categories": [
                    {
                        "_id": "673db947e4e8d7a9e061af93",
                        "name": "Tâm Lí"
                    }
                ],
                "images": [
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732072901/images/ofizjqad758rgrmikexw.jpg",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485419/images/camamlvmxdaxwvoz0oka.jpg",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/pztqykongcm8wezgz3bf.jpg",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/wfxdopbrhswbifvghjik.jpg"
                ],
                "release": "2021-11-10T00:00:00.000Z",
                "authors": [
                    {
                        "_id": "673db973e4e8d7a9e061af9c",
                        "name": "Dale Carnegie"
                    },
                    {
                        "_id": "673db982e4e8d7a9e061afa0",
                        "name": "Vân Tình"
                    }
                ],
                "description": "Nói một cách tổng quát thì Đắc Nhân Tâm là cuốn sách hay nên đọc chia sẻ về nghệ thuật thu phục lòng người, cách làm những người xung quanh yêu quý mình hơn. Cuốn sách dành cho tất cả mọi người, không phân biệt lứa tuổi vì đâu phải ai cũng hoàn hảo, cần có sự rèn luyện về tư duy cũng như tính cách mới được.\n\nKhi đọc Đắc Nhân Tâm bạn sẽ thấy hiểu rõ bản thân, những suy nghĩ và mong muốn của chính mình cũng như biết cách quan tâm đến những người xung quanh, khai thác thế mạnh tiềm ẩn của mọi người và giúp họ phát triển hơn cũng như mối quan hệ của bạn với họ được vững chắc hơn.\n\nXuyên suốt cuốn sách tưởng chừng \"dày cộp\" mà không ngán này là những bài học thực tế lắng đọng cho bạn đúc kết kinh nghiệm quý báu. Qua những bài học này, bạn học được nhiều thứ như cách cư xử, thái độ cũng như cải thiện kỹ năng giao tiếp. Đôi khi, đọc một lần không thể nắm được hết những giá trị mà cuốn sách mang lại, vì vậy bạn có thể đọc đi đọc lại, nghiền ngẫm để hiểu được những ý nghĩa sâu xa cũng như quy tắc vàng mà chỉ có Đắc Nhân Tâm mới đem lại cho bạn.\n\nNếu Đắc Nhân Tâm không nằm trong danh sách những cuốn sách hay thì quả thật là một thiếu sót nghiêm trọng. Đọc cuốn sách này để chúng ta biết sống tử tế hơn, cuộc đời có ý nghĩa hơn.\n\nĐể nói một lời về tác phẩm này, bản thân tôi chỉ biết đó là một đỉnh cao nghệ thuật làm người. Đắc Nhân Tâm có sức lan tỏa vô cùng rộng lớn, cho dù đi đến đâu trên thế giới đều có thể nhìn thấy tác phẩm này. Trên hết cuốn sách có tầm ảnh hưởng làm thay đổi cuộc đời của hàng triệu người.",
                "slug": "dark-nhan-tam",
                "__v": 0
            },
            {
                "_id": "673ff83a743ea732a5c0ffe2",
                "name": "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                "categories": [
                    {
                        "_id": "673db947e4e8d7a9e061af93",
                        "name": "Tâm Lí"
                    },
                    {
                        "_id": "673db95ee4e8d7a9e061af97",
                        "name": "Tình cảm"
                    }
                ],
                "images": [
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732245562/images/gtcipwt8nqn8mxucc2sc.png",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732245562/images/piz2gdx0skcxbeotwtnw.jpg",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732245562/images/a3voaz1ihdsopddbjfv1.jpg"
                ],
                "release": "2020-09-06T00:00:00.000Z",
                "authors": [
                    {
                        "_id": "673db9b9e4e8d7a9e061afad",
                        "name": "Rosie Nguyễn"
                    }
                ],
                "description": "Cuốn sách Tuổi trẻ đáng giá bao nhiêu được coi là kim chỉ nam cho giới trẻ. Qua 5 phần sách xúc tích, ngắn gọn dễ hiểu, dễ nhớ, đặc biệt là dễ thấm, cuốn sách là những câu chuyện của 1 người đã sắp đi qua thời tuổi trẻ của mình để lại những bài học quý giá trên hành trình rèn luyện bản thân, học hỏi, cống hiến. Chắc chắn cuốn sách sẽ là người bạn đồng hành không thể thiếu của những người đã đang và sắp đi qua thời trẻ.",
                "slug": "tuoi-tre-dang-gia-bao-nhieu",
                "__v": 0
            },
            {
                "_id": "673ffc83743ea732a5c101a3",
                "name": "Đọc Vị Bất Cứ Ai",
                "categories": [
                    {
                        "_id": "673db947e4e8d7a9e061af93",
                        "name": "Tâm Lí"
                    }
                ],
                "images": [
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732246659/images/fot66g9icoorkwvjojxo.png",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732246659/images/sodqswprqrertowi9kyl.jpg",
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732246659/images/kbpo69dn45cthvjgvyal.jpg"
                ],
                "release": "2023-02-15T00:00:00.000Z",
                "authors": [
                    {
                        "_id": "673db998e4e8d7a9e061afa5",
                        "name": "David J. Liebermen"
                    }
                ],
                "description": "Hãy chiếm thế thượng phong trong việc chủ động nhận biết điều cần tìm kiếm – ở bất kỳ ai bằng cách “thâm nhập vào suy nghĩ” của người khác. ĐỌC VỊ BẤT KỲ AI là cẩm nang dạy bạn cách thâm nhập vào tâm trí của người khác để biết điều người ta đang nghĩ.",
                "slug": "doc-vi-bat-cu-ai",
                "__v": 0
            },
            {
                "_id": "674008a50f70515eff4cc9ce",
                "name": "Đọc Vị Tính Cách",
                "categories": [
                    {
                        "_id": "673db947e4e8d7a9e061af93",
                        "name": "Tâm Lí"
                    },
                    {
                        "_id": "673db95ee4e8d7a9e061af97",
                        "name": "Tình cảm"
                    }
                ],
                "images": [
                    "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732249765/images/pcgh6k2oqtsnutsswaob.jpg"
                ],
                "release": "2024-11-22T00:00:00.000Z",
                "authors": [
                    {
                        "_id": "673ee1d2743ea732a5c0fdec",
                        "name": "Quý Nguyễn Thi"
                    }
                ],
                "description": "Cuốn sách cung cấp cho người đọc một góc nhìn thú vị hơn về tâm lý con người thông qua tính cách",
                "slug": "doc-vi-tinh-cach",
                "__v": 0
            }
        ]
    );
  });

  it('should return a book by slug', async () => {
    const res = await request(app).get('/books/dark-nhan-tam');
    expect(res.statusCode).toBe(200);
    expect(res.body.book).toEqual({
            "_id": "673db9c7e4e8d7a9e061afb2",
            "authors": [
                {
                    "_id": "673db973e4e8d7a9e061af9c",
                    "name": "Dale Carnegie",
                    "avatar": "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731469385/h3qk9vo7yv8whergfvqf.jpg"
                },
                {
                    "_id": "673db982e4e8d7a9e061afa0",
                    "name": "Vân Tình",
                    "avatar": "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731469678/ppbscfjlrvrkjm80vrn9.jpg"
                }
            ],
            "categories": [
                {
                    "_id": "673db947e4e8d7a9e061af93",
                    "name": "Tâm Lí"
                }
            ],
            "description": "Nói một cách tổng quát thì Đắc Nhân Tâm là cuốn sách hay nên đọc chia sẻ về nghệ thuật thu phục lòng người, cách làm những người xung quanh yêu quý mình hơn. Cuốn sách dành cho tất cả mọi người, không phân biệt lứa tuổi vì đâu phải ai cũng hoàn hảo, cần có sự rèn luyện về tư duy cũng như tính cách mới được.\n\nKhi đọc Đắc Nhân Tâm bạn sẽ thấy hiểu rõ bản thân, những suy nghĩ và mong muốn của chính mình cũng như biết cách quan tâm đến những người xung quanh, khai thác thế mạnh tiềm ẩn của mọi người và giúp họ phát triển hơn cũng như mối quan hệ của bạn với họ được vững chắc hơn.\n\nXuyên suốt cuốn sách tưởng chừng \"dày cộp\" mà không ngán này là những bài học thực tế lắng đọng cho bạn đúc kết kinh nghiệm quý báu. Qua những bài học này, bạn học được nhiều thứ như cách cư xử, thái độ cũng như cải thiện kỹ năng giao tiếp. Đôi khi, đọc một lần không thể nắm được hết những giá trị mà cuốn sách mang lại, vì vậy bạn có thể đọc đi đọc lại, nghiền ngẫm để hiểu được những ý nghĩa sâu xa cũng như quy tắc vàng mà chỉ có Đắc Nhân Tâm mới đem lại cho bạn.\n\nNếu Đắc Nhân Tâm không nằm trong danh sách những cuốn sách hay thì quả thật là một thiếu sót nghiêm trọng. Đọc cuốn sách này để chúng ta biết sống tử tế hơn, cuộc đời có ý nghĩa hơn.\n\nĐể nói một lời về tác phẩm này, bản thân tôi chỉ biết đó là một đỉnh cao nghệ thuật làm người. Đắc Nhân Tâm có sức lan tỏa vô cùng rộng lớn, cho dù đi đến đâu trên thế giới đều có thể nhìn thấy tác phẩm này. Trên hết cuốn sách có tầm ảnh hưởng làm thay đổi cuộc đời của hàng triệu người.",
            "images": [
                "https://res.cloudinary.com/dbdd85bp4/image/upload/v1732072901/images/ofizjqad758rgrmikexw.jpg",
                "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485419/images/camamlvmxdaxwvoz0oka.jpg",
                "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/pztqykongcm8wezgz3bf.jpg",
                "https://res.cloudinary.com/dbdd85bp4/image/upload/v1731485418/images/wfxdopbrhswbifvghjik.jpg"
            ],
            "name": "Dark Nhân Tâm",
            "release": "2021-11-10T00:00:00.000Z",
            "slug": "dark-nhan-tam"
    });
  });

  it('should return a book by slug', async () => {
    const res = await request(app).delete('/books/dark-nhan-tam');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message')
  });
});
