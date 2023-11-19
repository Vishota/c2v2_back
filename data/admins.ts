import db from "../infrastructure/db";

export async function makeAdmin(userId: number): Promise<boolean> {
    try {
        const dbResponse = await db.query('INSERT INTO admins ("user_id") VALUES ($1)', [userId])
        return dbResponse.rowCount == 1
    }
    catch {
        return false
    }
}
export async function removeAdmin(userId: number): Promise<boolean> {
    try {
        const dbResponse = await db.query('DELETE FROM admins WHERE user_id=$1 AND is_prime=FALSE', [userId])
        return dbResponse.rowCount == 1
    }
    catch {
        return false
    }
}
export async function isAdmin(userId: number): Promise<false | { admin: true, prime: boolean }> {
    const dbResponse = await db.query('SELECT is_prime FROM admins WHERE user_id=$1', [userId])
    return dbResponse.rowCount != 0 ? {
        admin: true,
        prime: dbResponse.rows[0].is_prime
    } : false
}