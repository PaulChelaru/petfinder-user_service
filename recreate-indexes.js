import mongoose from 'mongoose';
import User from './src/models/User.js';

async function recreateIndexes() {
    try {
        await mongoose.connect('mongodb://petfinder:petfinder123@localhost:27017/petfinder');
        console.log('Connected to MongoDB');
        
        // Check current indexes
        const indexes = await User.collection.getIndexes();
        console.log('Current indexes:', Object.keys(indexes));
        
        // Ensure indexes are created (this will create the username unique index)
        await User.ensureIndexes();
        console.log('Indexes ensured');
        
        // Check indexes again
        const newIndexes = await User.collection.getIndexes();
        console.log('Indexes after ensure:', Object.keys(newIndexes));
        
        // Test uniqueness by trying to create two users with same username
        console.log('\nTesting username uniqueness...');
        
        // Clean up any existing test users
        await User.deleteMany({ email: { $in: ['test1@example.com', 'test2@example.com'] } });
        
        try {
            // Create first user
            const user1 = new User({
                username: 'testuser',
                firstName: 'Test',
                lastName: 'User1',
                email: 'test1@example.com',
                city: 'New York',
                role: 'user'
            });
            await user1.save();
            console.log('✅ First user created successfully');
            
            // Try to create second user with same username
            const user2 = new User({
                username: 'testuser', // Same username
                firstName: 'Test',
                lastName: 'User2',
                email: 'test2@example.com',
                city: 'Los Angeles',
                role: 'user'
            });
            await user2.save();
            console.log('❌ Second user created - uniqueness constraint failed!');
            
        } catch (error) {
            if (error.code === 11000) {
                console.log('✅ Username uniqueness constraint working - duplicate rejected');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        // Clean up test users
        await User.deleteMany({ email: { $in: ['test1@example.com', 'test2@example.com'] } });
        console.log('Test users cleaned up');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

recreateIndexes();
