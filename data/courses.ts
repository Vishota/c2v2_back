import db from "../infrastructure/db";

export async function addCourse(ownerUserId: number, title: string, about: string) {
    const dbResponse = await db.query('INSERT INTO courses (owner_user_id, title, about) VALUES ($1,$2,$3) RETURNING id',
        [ownerUserId, title, about])
    return dbResponse.rowCount ? dbResponse.rows[0].id as number : false
}
export async function getCourse(courseId: number, as: number | 'ADMIN' | null) {
    const dbResponse = as == 'ADMIN' ? 
        await db.query('SELECT * FROM courses WHERE id=$1', [courseId])
        :
        await db.query('SELECT * FROM courses WHERE id=$1 AND (accessible=TRUE OR owner_user_id=$2)', [courseId, as]);
    return dbResponse.rowCount ? dbResponse.rows[0] : false
}
export async function setCourseAccessible(contentId: number, accessible: boolean, as: number|'ADMIN'): Promise<boolean> {
    // possible if either user has rights or he is the owner
    if(as == 'ADMIN') {
        const dbResponse = await db.query('UPDATE courses SET accessible=$2 WHERE id=$1',
            [contentId, accessible])
        return dbResponse.rowCount != 0
    }
    const dbResponse = await db.query('UPDATE courses SET accessible=$2 WHERE id=$1 AND owner_user_id=$3',
        [contentId, accessible, as])
    return dbResponse.rowCount != 0
}