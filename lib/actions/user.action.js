"use server"

import User from "../models/user.model"
import { connectToDatabase } from "../database/db"

export async function createUser(user) {
    try {
        await connectToDatabase();
        const newUser = await User.create(user)
        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        console.log(error);
    }
}