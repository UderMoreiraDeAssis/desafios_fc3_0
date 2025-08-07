import { app, sequelize } from "../express";
import request from 'supertest';

describe('E2E test for costumers', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    const response = await request(app).post('/customers').send({
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: 10,
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '00000-000',
      }
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.address.street).toBe('Main Street');
    expect(response.body.address.number).toBe(10);
    expect(response.body.address.city).toBe('Sao Paulo');
    expect(response.body.address.state).toBe('SP');
    expect(response.body.address.zipCode).toBe('00000-000');
  });

  it('should not create a customer with invalid data', async () => {
    const response = await request(app).post('/customers').send({
      name: 'John Doe',
    });

    expect(response.status).toBe(500);
  });

  it('should list all customers', async () => {
    const response1 = await request(app).post('/customers').send({
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: 10,
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '00000-000',
      }
    });
    expect(response1.status).toBe(200);

    const response2 = await request(app).post('/customers').send({
      name: 'Jane Doe',
      address: {
        street: 'Secondary Street',
        number: 20,
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '11111-111',
      }
    });
    expect(response2.status).toBe(200);

    const response = await request(app).get('/customers');

    expect(response.status).toBe(200);
    expect(response.body.customers.length).toBe(2);

    const customer1 = response.body.customers[0];
    const customer2 = response.body.customers[1];

    expect(customer1.name).toBe('John Doe');
    expect(customer1.address.street).toBe('Main Street');

    expect(customer2.name).toBe('Jane Doe');
    expect(customer2.address.street).toBe('Secondary Street');
  });

  it('should find a customer by id', async () => {
    const response1 = await request(app).post('/customers').send({
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: 10,
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '00000-000',
      }
    });
    expect(response1.status).toBe(200);

    const response2 = await request(app).post('/customers').send({
      name: 'Jane Doe',
      address: {
        street: 'Secondary Street',
        number: 20,
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '11111-111',
      }
    });
    expect(response2.status).toBe(200);

    const response = await request(app).get(`/customers/${response1.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.address.street).toBe('Main Street');
  });

  it('should not find a customer by id', async () => {
    const response = await request(app).get(`/customers/1`);

    expect(response.status).toBe(500);
  });

  it('should get customer xml', async () => {
    const response1 = await request(app).post('/customers').send({
      name: 'John Doe',
      address: {
        street: 'Main Street',
        number: 10,
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '00000-000',
      }
    });
    expect(response1.status).toBe(200);

    const response2 = await request(app).post('/customers').send({
      name: 'Jane Doe',
      address: {
        street: 'Secondary Street',
        number: 20,
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '11111-111',
      }
    });
    expect(response2.status).toBe(200);

    const response = await request(app).get('/customers').set('Accept', 'application/xml');

    expect(response.status).toBe(200);
    expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');

    expect(response.text).toContain('<customers>');
    expect(response.text).toContain('<customer>');
    expect(response.text).toContain('<name>John Doe</name>');
    expect(response.text).toContain('<street>Main Street</street>');
    expect(response.text).toContain('<number>10</number>');
    expect(response.text).toContain('<city>Sao Paulo</city>');
    expect(response.text).toContain('<state>SP</state>');
    expect(response.text).toContain('<zipCode>00000-000</zipCode>');
    expect(response.text).toContain('</customer>');
    expect(response.text).toContain('<customer>');
    expect(response.text).toContain('<name>Jane Doe</name>');
    expect(response.text).toContain('<street>Secondary Street</street>');
    expect(response.text).toContain('<number>20</number>');
    expect(response.text).toContain('<city>Rio de Janeiro</city>');
    expect(response.text).toContain('<state>RJ</state>');
    expect(response.text).toContain('<zipCode>11111-111</zipCode>');
    expect(response.text).toContain('</customer>');
    expect(response.text).toContain('</customers>');
  });
});
