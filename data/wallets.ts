import db from "../infrastructure/db";

/**
 * @param delta money amount change (if user pay 100, delta is -100)
 */
export async function pay(walletId: number, delta: number, description?: string, purchasedCourseId?: number):Promise<boolean> {
    const dbResponse = await db.query(`WITH updated as (
            UPDATE wallets
            SET balance = balance + $2
            WHERE owner_user_id = $1 AND balance >= 0-($2)
            RETURNING 1
        )
        INSERT INTO payment_operations (wallet_id, amount, is_successful, description, purchased_course_id) VALUES
        ($1, $2, EXISTS (SELECT * FROM updated), $3, $4)
        RETURNING is_successful`,
        [walletId, delta, description, purchasedCourseId])

    return dbResponse.rows[0].is_successful
}

export async function makeWallet(userId: number) {
    const dbResponse = await db.query('INSERT INTO wallets (owner_user_id) VALUES ($1)', [userId])
    return dbResponse.rowCount == 1
}

export async function getWallet(walletId: number) {
    const dbResponse = await db.query('SELECT * FROM wallets WHERE owner_user_id=$1', [walletId])
    return dbResponse.rows[0]
}