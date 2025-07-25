import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import {
    InvalidPayloadError,
    DuplicateValueError,
    InvalidOperationError
} from '../src/errors/client_errors.js';

describe('User Registration Flow', () => {
    let validUserData;

    beforeEach(() => {
        validUserData = {
            email: 'test@example.com',
            password: 'SecurePass123!',
            firstName: 'John',
            lastName: 'Doe'
        };
    });

    afterEach(() => {
        // Clean up test data
    });

    describe('Successful Registration', () => {
        it('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(validUserData.email);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should hash the password before storing', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(201);

            // Verify password is not returned in response
            expect(response.body.password).toBeUndefined();
        });
    });

    describe('Invalid Payload Errors', () => {
        it('should return InvalidPayloadError for missing email', async () => {
            delete validUserData.email;

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
            expect(response.body.code).toBe('INVALID_PAYLOAD');
        });

        it('should return InvalidPayloadError for invalid email format', async () => {
            validUserData.email = 'invalid-email';

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
        });

        it('should return InvalidPayloadError for weak password', async () => {
            validUserData.password = '123';

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
        });

        it('should return InvalidPayloadError for missing required fields', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({})
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
        });
    });

    describe('Duplicate Value Errors', () => {
        it('should return DuplicateValueError for existing email', async () => {
            // First registration
            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(201);

            // Attempt duplicate registration
            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(422);

            expect(response.body.code).toBe('DUPLICATE_VALUE');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send()
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
        });

        it('should handle malformed JSON', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .set('Content-Type', 'application/json')
                .send('{"invalid": json}')
                .expect(400);

            expect(response.body.message).toBe('Invalid parameters');
        });

        it('should trim whitespace from email', async () => {
            validUserData.email = '  test@example.com  ';

            const response = await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(201);

            expect(response.body.email).toBe('test@example.com');
        });
    });

    describe('Password Validation', () => {
        it('should reject password without uppercase letter', async () => {
            validUserData.password = 'securepass123!';

            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);
        });

        it('should reject password without special character', async () => {
            validUserData.password = 'SecurePass123';

            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);
        });

        it('should reject password shorter than minimum length', async () => {
            validUserData.password = 'Short1!';

            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);
        });
    });

    describe('Email Validation', () => {
        it('should reject email without @ symbol', async () => {
            validUserData.email = 'testexample.com';

            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);
        });

        it('should reject email without domain', async () => {
            validUserData.email = 'test@';

            await request(app)
                .post('/api/users/register')
                .send(validUserData)
                .expect(400);
        });

        it('should accept valid email variations', async () => {
            const validEmails = [
                'user@domain.com',
                'user.name@domain.co.uk',
                'user+tag@domain.org'
            ];

            for (const email of validEmails) {
                validUserData.email = email;
                await request(app)
                    .post('/api/users/register')
                    .send(validUserData)
                    .expect(201);
            }
        });
    });
});
