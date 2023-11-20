import db from "../infrastructure/db";

export async function addCourse(ownerUserId: number, title: string, about: string) {
    const dbResponse = await db.query('INSERT INTO courses (owner_user_id, title, about) VALUES ($1,$2,$3) RETURNING id',
        [ownerUserId, title, about])
    return dbResponse.rowCount ? dbResponse.rows[0].id as number : false
}