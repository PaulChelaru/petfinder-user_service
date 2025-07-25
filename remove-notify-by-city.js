#!/usr/bin/env node

/**
 * Migration script to remove notifyByCity field from user documents
 * Run this script to clean up existing user data
 */

import mongoose from 'mongoose';

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petfinder';

async function removeNotifyByCityField() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        console.log('🔍 Checking for users with notifyByCity field...');
        
        // Count documents with notifyByCity field
        const usersWithField = await usersCollection.countDocuments({
            notifyByCity: { $exists: true }
        });
        
        console.log(`📊 Found ${usersWithField} users with notifyByCity field`);

        if (usersWithField > 0) {
            console.log('🗑️  Removing notifyByCity field from all users...');
            
            // Remove the notifyByCity field from all documents
            const result = await usersCollection.updateMany(
                {},
                { $unset: { notifyByCity: "" } }
            );
            
            console.log(`✅ Successfully updated ${result.modifiedCount} user documents`);
            
            // Verify the field was removed
            const remainingUsersWithField = await usersCollection.countDocuments({
                notifyByCity: { $exists: true }
            });
            
            if (remainingUsersWithField === 0) {
                console.log('🎉 Migration completed successfully! notifyByCity field removed from all users.');
            } else {
                console.log(`⚠️  Warning: ${remainingUsersWithField} users still have the notifyByCity field`);
            }
        } else {
            console.log('✅ No users found with notifyByCity field. Migration not needed.');
        }

        // Get sample of user documents to verify
        console.log('🔍 Sampling user documents to verify migration...');
        const sampleUsers = await usersCollection.find({}, { 
            projection: { 
                userId: 1, 
                email: 1, 
                notifyByEmail: 1, 
                notifyBySms: 1, 
                notifyByCity: 1 
            } 
        }).limit(3).toArray();
        
        console.log('📋 Sample user documents after migration:');
        sampleUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. User ${user.userId}:`);
            console.log(`      - Email: ${user.email}`);
            console.log(`      - notifyByEmail: ${user.notifyByEmail}`);
            console.log(`      - notifyBySms: ${user.notifyBySms}`);
            console.log(`      - notifyByCity: ${user.notifyByCity || 'undefined'}`);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('📔 Disconnected from MongoDB');
    }
}

// Run the migration
console.log('🚀 Starting notifyByCity field removal migration...');
console.log('=' .repeat(60));

removeNotifyByCityField()
    .then(() => {
        console.log('=' .repeat(60));
        console.log('🏁 Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });
