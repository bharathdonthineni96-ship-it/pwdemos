import { test, expect } from '@playwright/test';

test.describe('API 1, 2, 5, 6: Product API Tests', () => {

    test('API 1: Get All Products List', async ({ request }) => {
        const response = await request.get('/api/productsList');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.products).toBeDefined();
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 2: POST To All Products List', async ({ request }) => {
        const response = await request.post('/api/productsList');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });

    test('API 5: POST To Search Product', async ({ request }) => {
        const response = await request.post('/api/searchProduct', {
            form: {
                search_product: 'top'
            }
        });
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.products).toBeDefined();
        expect(body.products.length).toBeGreaterThan(0);
    });

    test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
        const response = await request.post('/api/searchProduct');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(400);
        expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });
});
