import { test, expect } from '@playwright/test';

test.describe('API 3, 4: Brand API Tests', () => {

    test('API 3: Get All Brands List', async ({ request }) => {
        const response = await request.get('/api/brandsList');
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.brands).toBeDefined();
        expect(body.brands.length).toBeGreaterThan(0);
    });

    test('API 4: PUT To All Brands List', async ({ request }) => {
        const response = await request.post('/api/brandsList', {
            headers: {
                'X-HTTP-Method-Override': 'PUT'
            }
        });
        // Note: The site usually just takes any non-GET as non-supported or specifically checks methods.
        // The API list says PUT is not supported.
        const putResp = await request.put('/api/brandsList');
        expect(putResp.status()).toBe(200);
        
        const body = await putResp.json();
        expect(body.responseCode).toBe(405);
        expect(body.message).toBe('This request method is not supported.');
    });
});
