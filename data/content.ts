import db from "../infrastructure/db";

export async function addContent(
    ownerUserId: number,
    title: string,
    content: string
): Promise<number | false> {
    const dbResponse = await db.query('INSERT INTO content ("owner_user_id", "title", "content") VALUES ($1,$2,$3) RETURNING id',
        [ownerUserId, title, content]);

    return dbResponse.rowCount == 1 ? dbResponse.rows[0].id : false
}
