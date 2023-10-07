import 'reflect-metadata';
import request from 'supertest';
import { appProvider } from './shared/providers/app.provider';
import { describe, test, expect } from '@jest/globals';

describe('Test the APIs', () => {
  test('Test sign up"', async () => {
    const response = await request(appProvider.app).post('/sign-up').send({
      email: 'newUser@gmail.com',
      password: 'mypassword',
      firstName: 'Ta',
      lastName: 'An',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe('newUser@gmail.com');

    const errorData = [
      {
        email: 'existUser@gmail.com',
        password: 'mypassword',
        firstName: 'Ta',
        lastName: 'An',
        error: 'some error',
      },
      {
        email: 'newUsergmail.com',
        password: 'mypassword',
        firstName: 'Ta',
        lastName: 'An',
        error: 'some error',
      },
    ];

    for (const obj of errorData) {
      const response = await request(appProvider.app)
        .post('/sign-up')
        .send(obj);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    }
  });

  test('Test sign in"', async () => {
    const response = await request(appProvider.app).post('/sign-in').send({
      email: 'newUser@gmail.com',
      password: 'mypassword',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe('newUser@gmail.com');

    const errorData = [
      {
        email: 'existUser@gmail.com',
        password: 'mypassword',
        error: 'some error',
      },
      {
        email: 'newUsergmail.com',
        password: 'mypassword',
        error: 'some error',
      },
      {
        password: 'mypassword',
        error: 'some error',
      },
    ];

    for (const obj of errorData) {
      const response = await request(appProvider.app)
        .post('/sign-in')
        .send(obj);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    }
  });
});
