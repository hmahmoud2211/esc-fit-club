const Product = require('./models/Product');
require('dotenv').config();
const sequelize = require('./config/database');

const sampleProducts = [
    {
        name: "ESC Fitness T-Shirt",
        description: "High-quality workout t-shirt made with moisture-wicking fabric for maximum comfort and performance during any workout session.",
        price: 29.99,
        stock: 50,
        images: ["https://via.placeholder.com/500x500?text=ESC+Tshirt"],
        category: "Apparel",
        featured: true
    },
    {
        name: "ESC Training Shorts",
        description: "Comfortable and flexible training shorts perfect for any type of workout. Features quick-dry technology and hidden pockets.",
        price: 34.99,
        stock: 35,
        images: ["https://via.placeholder.com/500x500?text=ESC+Shorts"],
        category: "Apparel",
        featured: false
    },
    {
        name: "ESC Protein Powder - Chocolate",
        description: "Premium protein powder with 25g of protein per serving. Made with high-quality ingredients for optimal muscle recovery.",
        price: 49.99,
        stock: 100,
        images: ["https://via.placeholder.com/500x500?text=ESC+Protein"],
        category: "Supplements",
        featured: true
    },
    {
        name: "ESC Resistance Bands Set",
        description: "Set of 5 resistance bands with different resistance levels. Perfect for home workouts or on-the-go fitness routines.",
        price: 24.99,
        stock: 75,
        images: ["https://via.placeholder.com/500x500?text=ESC+Bands"],
        category: "Equipment",
        featured: true
    },
    {
        name: "ESC Workout Gloves",
        description: "Premium workout gloves with wrist support for weightlifting and cross-training. Provides excellent grip and palm protection.",
        price: 19.99,
        stock: 60,
        images: ["https://via.placeholder.com/500x500?text=ESC+Gloves"],
        category: "Accessories",
        featured: false
    }
];

const createSampleProducts = async () => {
    try {
        await sequelize.sync();
        
        // Check if products already exist
        const existingProducts = await Product.findAll();
        if (existingProducts.length > 0) {
            console.log(`${existingProducts.length} products already exist in the database.`);
            console.log('Do you want to add more sample products? (y/n)');
            // In a real script, you would wait for user input here
            // For simplicity, we'll continue adding products
        }

        console.log('Adding sample products to the database...');
        
        // Create products one by one
        for (const product of sampleProducts) {
            const [newProduct, created] = await Product.findOrCreate({
                where: { name: product.name },
                defaults: product
            });
            
            if (created) {
                console.log(`Created new product: ${newProduct.name}`);
            } else {
                console.log(`Product already exists: ${newProduct.name}`);
            }
        }
        
        console.log('Sample products added successfully!');
    } catch (err) {
        console.error('Error creating sample products:', err);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    createSampleProducts();
}

module.exports = createSampleProducts; 