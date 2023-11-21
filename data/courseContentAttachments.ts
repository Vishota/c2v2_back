import db from "../infrastructure/db";

export async function attach(contentId: number, courseId: number, as: 'ADMIN' | number): Promise<boolean> {
    const dbResponse = as == 'ADMIN' ?
        await db.query('INSERT INTO course_content_attachments (content_id, course_id) VALUES ($1, $2)', [contentId, courseId]) :
        await db.query(`INSERT INTO course_content_attachments (content_id, course_id)
        SELECT $1, $2
        WHERE EXISTS (
            SELECT 1 FROM content JOIN courses
            ON content.id = $1 AND courses.id = $2 AND content.owner_user_id = $3 AND courses.owner_user_id = $3
        );`, [contentId, courseId, as])

    return dbResponse.rowCount != 0
}

export async function detach(contentId: number, courseId: number, as: 'ADMIN' | number): Promise<boolean> {
    const dbResponse = as == 'ADMIN' ?
        await db.query('DELETE FROM course_content_attachments WHERE content_id=$1 AND course_id=$2', [contentId, courseId]) :
        await db.query(`DELETE FROM course_content_attachments
        WHERE content_id=$1 AND course_id=$2 AND EXISTS (
            SELECT 1 FROM content JOIN courses
            ON content.id = $1 AND courses.id = $2 AND content.owner_user_id = $3 AND courses.owner_user_id = $3
        );`, [contentId, courseId, as])

    return dbResponse.rowCount != 0
}