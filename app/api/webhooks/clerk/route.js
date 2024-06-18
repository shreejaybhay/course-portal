import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createUser } from "@/lib/actions/user.action";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
}

export default async function handler(req, res) {
    try {
        // Get the headers
        const headerPayload = headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
        }

        // Get the body
        const payload = await req.json();
        const body = JSON.stringify(payload);

        // Create a new Svix instance with your secret.
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt;

        // Verify the payload with the headers
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err) {
            console.error('Error verifying webhook:', err);
            return NextResponse.json({ error: 'Error verifying webhook' }, { status: 400 });
        }

        // Log the webhook event
        const { id } = evt.data;
        const eventType = evt.type;
        console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
        console.log('Webhook body:', body);

        // Handle user creation
        if (eventType === 'user.created') {
            const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
            const user = {
                clerkId: id,
                email: email_addresses[0].email,
                username: username,
                firstName: first_name,
                lastName: last_name,
                photo: image_url,
            };

            // Create user in your database
            const newUser = await createUser(user);

            // Check if user creation was successful
            if (newUser) {
                // Update Clerk user metadata
                await clerkClient.users.updateUserMetadata(id, {
                    publicMetadata: {
                        userId: newUser._id.toString(), // Ensure this is correct based on your createUser function
                    }
                });
            } else {
                console.error('Failed to create user in database');
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }

            // Return response indicating success
            return NextResponse.json({ message: "New user created" }, { status: 200 });
        }

        return NextResponse.json({ message: "Unhandled event type" }, { status: 200 });
    } catch (error) {
        console.error('Error in webhook handler:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
