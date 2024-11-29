import request from 'supertest';
import app from '../index';

describe('Category API', () => {
  it('should return a list of categories', async () => {
    const res = await request(app).get('/categories/');
    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((category: any) => {
        expect(category).toHaveProperty('_id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('__v');

      });

    
  });

  it('should return a category based on specific slug', async() => {
    const res = await request(app).get('/categories/tam-li');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.category).toEqual(
        {
            "name": "Tâm Lí",
            "slug": "tam-li"
        }
    )
})

});
