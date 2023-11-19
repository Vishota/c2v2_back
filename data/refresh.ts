import { randomBytes } from "crypto";
import db from "../infrastructure/db";

export async function makeRefresh(userId: number): Promise<string> {
    let token = '';
    let tokenResolve: Function;
    let tokenCreated = new Promise(resolve => tokenResolve = resolve)

    // 48 is token length (maybe, should be moved to env)
    randomBytes(48 / 2, (err: any, buffer: any) => {
        token = buffer.toString('hex');
        tokenResolve();
    });

    await tokenCreated;

    const dbResponse = await db.query('INSERT INTO refresh ("user_id", "token") VALUES ($1, $2)', [userId, token])
    if (dbResponse.rowCount != 1) throw 'Refresh not inserted'
    return token
}

export async function deleteRefresh(userId: number, refresh: string) {
    const dbResponse = await db.query('DELETE FROM refresh WHERE user_id=$1 AND token=$2', [userId, refresh])
    return dbResponse.rowCount == 1
}