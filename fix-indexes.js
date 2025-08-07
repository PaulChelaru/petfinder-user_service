import mongoose from 'mongoose';

async function fixIndexes() {
    try {
        // Connect to MongoDB with authentication
        await mongoose.connect('mongodb://petfinder:petfinder123@localhost:27017/petfinder');
        console.log('Connected to MongoDB');
        
        // Get the users collection
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        // List all indexes
        console.log('Current indexes:');
        const indexes = await usersCollection.listIndexes().toArray();
        indexes.forEach(index => {
            console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
        });
        
        // Check if username index exists and drop it
        const usernameIndex = indexes.find(index => index.key.username);
        if (usernameIndex) {
            console.log('Dropping username index...');
            await usersCollection.dropIndex('username_1');
            console.log('Username index dropped successfully');
        } else {
            console.log('No username index found');
        }
        
        // Also clear any existing users with null usernames if needed
        const usersWithNullUsername = await usersCollection.countDocuments({ username: null });
        if (usersWithNullUsername > 0) {
            console.log(`Found ${usersWithNullUsername} users with null username`);
            // You might want to either delete them or update them
            // For now, let's just log this
        }
        
        console.log('Index cleanup completed');
        
    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.connection.close();
    }
}

fixIndexes();
