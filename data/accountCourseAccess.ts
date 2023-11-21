import db from "../infrastructure/db";

export async function giveAccess(accountId: number, courseId: number, as: 'ADMIN' | number): Promise<boolean> {
    const dbResponse = as == 'ADMIN' ?
        await db.query('INSERT INTO account_course_access (account_id, course_id) VALUES ($1, $2)', [accountId, courseId]) :
        await db.query(`INSERT INTO account_course_access (account_id, course_id)
        SELECT $1, $2
        WHERE EXISTS (
            SELECT 1 FROM courses WHERE id=$2 AND owner_user_id=$3
        );`, [accountId, courseId, as])

    return dbResponse.rowCount != 0
}

export async function removeAccess(accountId: number, courseId: number, as: 'ADMIN' | number): Promise<boolean> {
    const dbResponse = as == 'ADMIN' ?
        await db.query('DELETE FROM account_course_access WHERE account_id=$1 AND course_id=$2', [accountId, courseId]) :
        await db.query(`DELETE FROM account_course_access
        WHERE account_id=$1 AND course_id=$2 AND EXISTS (
            SELECT 1 FROM courses WHERE id=$2 AND owner_user_id=$3
        );`, [accountId, courseId, as])

    return dbResponse.rowCount != 0
}