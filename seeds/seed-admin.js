import createSupabaseClient from "../utils/create-supabase-client.js";
import {randomBytes} from "node:crypto";

// import dotenv from 'dotenv';

// dotenv.config();


function generatePassword() {
    return randomBytes(18).toString('base64url');
}

async function seedAdmin() {
    const password = generatePassword();
    const ADMIN_EMAIL = "admin@example.com";

    const client = await createSupabaseClient();
    
    const {data, error} = await client.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password,
        email_confirm: true, // no need for email confirmation
        app_metadata: {role: 'admin'}
    });

    if(error) {
        const alreadyExists = error.code === 'email_exists';

        if(alreadyExists) {
            console.log(`Admin user already exists(${ADMIN_EMAIL}) - skipping`);
            return;
        }
        throw error;
    }

    console.log("\n==========================");
    console.log(" Admin user created successfully");
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${password}`)
    console.log(`User ID: ${data.user.id}`)

    console.log("\n==========================");
    console.log("Save the password now, it will not be stored anywhere!")
}

seedAdmin().catch((err) => {
    console.error("Failed to seed admin", err.message);
    process.exit(1);
})