import { app, sequelize } from "../express";
import request from 'supertest';

describe('E2E test for products', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const response = await request(app).post('/products').send({
      type: 'a',
      name: 'Product 1',
      price: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Product 1');
    expect(response.body.price).toBe(10);
  });

  it('should not create a product with invalid data', async () => {
    const response = await request(app).post('/products').send({
      type: 'a',
    });

    expect(response.status).toBe(500);
  });

  it('should list all products', async () => {
    const response1 = await request(app).post('/products').send({
      type: 'a',
      name: 'Product 1',
      price: 10,
    });
    expect(response1.status).toBe(200);

    const response2 = await request(app).post('/products').send({
      type: 'a',
      name: 'Product 2',
      price: 20,
    });
    expect(response2.status).toBe(200);

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
  });

  it('should find a product by id', async () => {
    const response1 = await request(app).post('/products').send({
      type: 'a',
      name: 'Product 1',
      price: 10,
    });
    expect(response1.status).toBe(200);

    const response2 = await request(app).post('/products').send({
      type: 'a',
      name: 'Product 2',
      price: 20,
    });
    expect(response2.status).toBe(200);

    const response = await request(app).get(`/products/${response1.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Product 1');
    expect(response.body.price).toBe(10);
  });
});
