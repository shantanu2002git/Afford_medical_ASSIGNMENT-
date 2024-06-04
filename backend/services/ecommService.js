const axios = require('axios');
const { log } = require('console');
const crypto = require('crypto');

const API_BASE_URL = 'http://20.244.56.144/test/companies';
const TOKEN = process.env.ACCESS_TOKEN; // Store your token in .env file


const getProducts = async (category, top, minPrice, maxPrice, page, sort, order) => {
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
    const limit = Math.min(top, 10);
    const offset = (page - 1) * limit;

    try {
        const requests = companies.map(company => 
            axios.get(`${API_BASE_URL}/${company}/categories/${category}/products`, {
                params: {
                    top,
                    minPrice,
                    maxPrice
                },
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })
        );

        const responses = await Promise.all(requests);
        console.log(responses.data);
        let products = responses.flatMap(response => response.data);
        // Add unique IDs to each product
        products = products.map(product => ({
            ...product,
            uniqueId: generateUniqueId(product)
        }));

        // Sorting logic
        if (sort) {
            products.sort((a, b) => {
                if (order === 'desc') {
                    return b[sort] - a[sort];
                }
                return a[sort] - b[sort];
            });
        }

        // Pagination logic
        const paginatedProducts = products.slice(offset, offset + limit);

        return paginatedProducts;
    } catch (error) {
        throw new Error('Error fetching products');
    }
};

const getProductById = async (id) => {
    try {
        const requests = companies.map(company => 
            axios.get(`${API_BASE_URL}/${company}/categories/Laptop/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`
                }
            })
        );
        console.log(requests);
        const responses = await Promise.all(requests);
        const product = responses.find(response => response.data.uniqueId === id);
        return product.data;
    } catch (error) {
        throw new Error('Error fetching product by ID');
    }
};

// Generate a unique identifier for each product
const generateUniqueId = (product) => {
    return crypto.createHash('md5').update(JSON.stringify(product)).digest('hex');
};

module.exports = {
    getProducts,
    getProductById
};
