/** This file seeds the database with rules and permission  */
import {Db, MongoClient} from 'mongodb';
import {User} from './types/user';
const allRoles = ['user','admin']
const permissions = ['read.devices','remove.users']


const seedDatabaseWithRules = async (db: Db) => {
    const data:User = {
        name: 'admin',
        email:'random',
        created_at: Date.now(),
        password : 'admin123',
        roles:[allRoles[1]],
        permissions: permissions
    }
    await db.collection('users').insertOne(data)
}

export const seed = async () =>{
    const client = new MongoClient(process.env.MONGO_URI  || 'mongodb://localhost:27017/praan');
    try {
        const db = client.db('praan');
        await db.collection('users').deleteOne({
            roles:['admin']
        })
        await seedDatabaseWithRules(db)
        console.log("DB seeded")
    }catch(error) {
        console.error(error)
    } finally {
        await client.close();
    }
}
