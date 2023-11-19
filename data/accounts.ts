import db from "../infrastructure/db";
import bcrypt from 'bcrypt'
import env from "../infrastructure/env";

export async function insertUser(
    username: string,
    password: string
): Promise<number | false> {
    try {
        const dbResponse = await db.query('INSERT INTO accounts ("username", "password_hash") VALUES ($1, $2) RETURNING id', [
            username,
            await bcrypt.hash(password, parseInt(env.get('AUTH_BCRYPT_ROUNDS')))
        ])
        if (dbResponse.rowCount != 1) return false
        return dbResponse.rows[0].id
    } catch (e) {
        return false
    }
}

export async function checkUser(
    username: string,
    password: string
): Promise<number | false> {
    const dbResponse = await db.query('SELECT id, password_hash FROM accounts WHERE username=$1 AND access=TRUE', [
        username
    ])
    if (dbResponse.rowCount != 1) return false;
    return await bcrypt.compare(password, dbResponse.rows[0].password_hash) ? dbResponse.rows[0].id : false
}

export async function setUserAccess(userId: number, access: boolean, asPrime: boolean) {
    let dbResponse = asPrime ?
        // can ban anyone axcept another prime admins
        await db.query(`UPDATE accounts
        SET access = $2
        WHERE id=$1 AND NOT EXISTS (
            SELECT 1
            FROM admins
            WHERE admins.user_id = accounts.id
            AND admins.is_prime = TRUE
        );`, [userId, access])
        :
        // can ban anyone axcept another admins
        await db.query(`UPDATE accounts
        SET access = $2
        WHERE id=$1 AND NOT EXISTS (
            SELECT 1
            FROM admins
            WHERE admins.user_id = accounts.id
        );`, [userId, access]);
    
        return dbResponse.rowCount == 1
}