#!/usr/bin/env node
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Connection string - update if needed
const MONGO_URI = 'mongodb://petfinder:petfinder123@localhost:27017/petfinder';

async function migrateUsersToUUID() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        const credentialsCollection = db.collection('credentials');

        // Find users that don't have a userId field
        const usersWithoutUUID = await usersCollection.find({ userId: { $exists: false } }).toArray();
        
        console.log(`📊 Found ${usersWithoutUUID.length} users without UUID`);
        
        if (usersWithoutUUID.length === 0) {
            console.log('✅ All users already have UUIDs');
            await mongoose.disconnect();
            return;
        }

        // Create mapping of ObjectId to UUID for credential updates
        const idMapping = {};

        // Update each user to add UUID
        for (const user of usersWithoutUUID) {
            const uuid = uuidv4();
            idMapping[user._id.toString()] = uuid;
            
            console.log(`🔄 Updating user ${user.email} with UUID: ${uuid}`);
            
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { userId: uuid } }
            );
        }

        // Update credentials to use new UUIDs
        console.log('🔄 Updating credentials with new UUIDs...');
        
        for (const [objectId, uuid] of Object.entries(idMapping)) {
            const result = await credentialsCollection.updateMany(
                { userId: objectId },
                { $set: { userId: uuid } }
            );
            
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} credential(s) for ObjectId ${objectId} to UUID ${uuid}`);
            }
        }

        console.log('✅ Migration completed successfully!');
        
        // Verify the migration
        const usersWithUUID = await usersCollection.countDocuments({ userId: { $exists: true } });
        const totalUsers = await usersCollection.countDocuments();
        
        console.log(`📊 Verification: ${usersWithUUID}/${totalUsers} users now have UUIDs`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the migration
migrateUsersToUUID()
    .then(() => {
        console.log('🎉 Migration script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration script failed:', error);
        process.exit(1);
    });
