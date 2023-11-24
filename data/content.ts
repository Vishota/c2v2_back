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
export async function setContentAccessible(contentId: number, accessible: boolean, as: number|'ADMIN'): Promise<boolean> {
    // possible if either user has rights or he is the owner
    if(as == 'ADMIN') {
        const dbResponse = await db.query('UPDATE content SET accessible=$2 WHERE id=$1',
            [contentId, accessible])
        return dbResponse.rowCount != 0
    }
    const dbResponse = await db.query('UPDATE content SET accessible=$2 WHERE id=$1 AND owner_user_id=$3',
        [contentId, accessible, as])
    return dbResponse.rowCount != 0
}
export async function getContent(contentId: number, asAdmin: boolean = false, asUser: number|null = null) {
    if(!asAdmin && !asUser) throw 'no_auth'
    const dbResponse = asAdmin ?
        await db.query(`SELECT * FROM content WHERE id=$1`, [contentId]) :
        await db.query(`SELECT * FROM content WHERE id=$1 AND (accessible=TRUE AND EXISTS (
            SELECT 1 FROM course_content_attachments JOIN account_course_access
            ON course_content_attachments.course_id=account_course_access.course_id
            AND course_content_attachments.content_id=$1
            AND account_course_access.account_id=$2
        ) OR owner_user_id=$2)`, [contentId, asUser])
    return dbResponse.rowCount ? dbResponse.rows[0] : false
}