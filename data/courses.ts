import db from "../infrastructure/db";

export async function addCourse(ownerUserId: number, title: string, about: string, price: number) {
    if(price < 0) throw 'invalid price'
    const dbResponse = await db.query('INSERT INTO courses (owner_user_id, title, about, price) VALUES ($1,$2,$3,$4) RETURNING id',
        [ownerUserId, title, about, price])
    return dbResponse.rowCount ? dbResponse.rows[0].id as number : false
}
export async function getCourse(courseId: number, as: number | 'ADMIN' | null) {
    const dbResponse = as == 'ADMIN' ?
        await db.query('SELECT * FROM courses WHERE id=$1', [courseId])
        :
        await db.query('SELECT * FROM courses WHERE id=$1 AND (accessible=TRUE OR owner_user_id=$2)', [courseId, as]);
    return dbResponse.rowCount ? dbResponse.rows[0] : false
}
export async function setCourseAccessible(courseId: number, accessible: boolean, as: number | 'ADMIN'): Promise<boolean> {
    // possible if either user has rights or he is the owner
    if (as == 'ADMIN') {
        const dbResponse = await db.query('UPDATE courses SET accessible=$2 WHERE id=$1',
            [courseId, accessible])
        return dbResponse.rowCount != 0
    }
    const dbResponse = await db.query('UPDATE courses SET accessible=$2 WHERE id=$1 AND owner_user_id=$3',
        [courseId, accessible, as])
    return dbResponse.rowCount != 0
}
export async function search(prompt: string): Promise<{ id: number; rank: number; }[]> {
    console.log(prompt);

    const dbResponse = await db.query(`SELECT id, ts_rank(to_tsvector(replace_special_chars(title || ' ' || about)), plainto_tsquery(replace_special_chars($1))) as rank
        FROM courses
        WHERE accessible = TRUE AND
        to_tsvector(replace_special_chars(title || ' ' || about)) @@ plainto_tsquery(replace_special_chars($1))
        ORDER BY ts_rank(to_tsvector(replace_special_chars(title || ' ' || about)), plainto_tsquery(replace_special_chars($1))) DESC;`,
        [prompt])
    console.log(dbResponse);

    return dbResponse.rows;
}
export async function getOwnedBy(teacherId: number): Promise<number[]> {
    const dbResponse = await db.query(`SELECT id FROM courses WHERE accessible = TRUE AND owner_user_id=$1`, [teacherId]);
    return dbResponse.rows.map(row => row.id);
}
export async function getAccesedBy(accountId: number): Promise<number[]> {
    const dbResponse = await db.query(`SELECT course_id FROM account_course_access WHERE account_id=$1`, [accountId]);
    return dbResponse.rows.map(row => row.course_id);
}