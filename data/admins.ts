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
export async function isAdmin(userId: number):Promise<boolean> {
    return (await db.query('SELECT 0 as "whatever" FROM admins WHERE user_id=$1', [userId])).rowCount != 0
}
(async()=>{
await removeAdmin(1).then(r=>console.log(r))
await isAdmin(1).then(o=>console.log(o));
})()