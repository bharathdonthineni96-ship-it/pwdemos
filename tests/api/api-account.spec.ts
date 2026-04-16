import { test, expect } from '@playwright/test';

test.describe('API 11, 12, 13, 14: User Account Lifecycle API Tests', () => {
    test.describe.configure({ mode: 'serial' });
    const timestamp = Date.now();
    const email = `apiuser${timestamp}@example.com`;
    const name = `API User ${timestamp}`;
    const password = 'password123';

    test('API 11: POST To Create/Register User Account', async ({ request }) => {
        const response = await request.post('/api/createAccount', {
            form: {
                name: name,
                email: email,
                password: password,
                title: 'Mr',
                birth_date: '10',
                birth_month: 'May',
                birth_year: '1990',
                firstname: 'API',
                lastname: 'Test',
                company: 'Tech Corp',
                address1: '123 API St',
                address2: 'Suite 100',
                country: 'United States',
                zipcode: '10001',
                state: 'New York',
                city: 'New York',
                mobile_number: '1234567890'
            }
        });
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(201);
        expect(body.message).toBe('User created!');
    });

    test('API 14: GET User Account Detail by Email', async ({ request }) => {
        const response = await request.get('/api/getUserDetailByEmail', {
            params: {
                email: email
            }
        });
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.user.email).toBe(email);
        expect(body.user.name).toBe(name);
    });

    test('API 13: PUT To Update User Account', async ({ request }) => {
        const updatedName = `${name} Updated`;
        const response = await request.put('/api/updateAccount', {
            form: {
                name: updatedName,
                email: email,
                password: password,
                title: 'Mr',
                birth_date: '10',
                birth_month: 'May',
                birth_year: '1990',
                firstname: 'API',
                lastname: 'Updated',
                company: 'Tech Corp',
                address1: '123 Updated St',
                address2: 'Suite 100',
                country: 'United States',
                zipcode: '10001',
                state: 'New York',
                city: 'New York',
                mobile_number: '0000000000'
            }
        });
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User updated!');
    });

    test('API 12: DELETE To Delete User Account', async ({ request }) => {
        const response = await request.delete('/api/deleteAccount', {
            form: {
                email: email,
                password: password
            }
        });
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('Account deleted!');
    });
});
