const mongoose = require('mongoose');
const Admin = require('./models/user.model');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb+srv://zainulaabid0007:Aabid9633@cluster0.anpz0gz.mongodb.net/E-Commerce-Backend?retryWrites=true&w=majority',)

const adminSeed = async () => {
    try {
        const email = 'zainulaabid0007@gmail.com'; 
        const password = '12345'; 

        const existingAdmin = await Admin.findOne({ email });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await Admin.create({
                username: 'Aabid',
                email,
                password: hashedPassword,
                phone: '6282382485',
                role: 'admin',
            });

            console.log('Admin seed data inserted successfully.');
        } else {
            console.log('Admin user already exists.');
        }

    } catch (error) {
        console.error('Error seeding admin data:', error);
    } finally {
        mongoose.connection.close();
        console.log("disconnect");
    }
};

adminSeed();
