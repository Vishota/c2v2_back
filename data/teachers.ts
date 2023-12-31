import db from "../infrastructure/db"

export async function addTeacher(userId: number, data: {
    name: string,
    speciality: string,
    about: string
}) {
    const dbResponse = await db.query('INSERT INTO teachers("user_id", "name", "speciality", "about") VALUES ($1, $2, $3, $4)', [userId, data.name, data.speciality, data.about]);

    return dbResponse.rowCount == 1
}

export async function setTeacherActive(userId: number, active: boolean) {
    const dbResponse = await db.query('UPDATE teachers SET is_active=$2 WHERE user_id=$1', [userId, active]);

    return dbResponse.rowCount == 1
}

export async function getTeacherInfo(userId: number) {
    const dbResponse = await db.query('SELECT * FROM teachers WHERE user_id=$1', [userId])

    return dbResponse.rows[0] ? dbResponse.rows[0] : false
}

export async function getInactiveList():Promise<number[]> {
    const dbResponse = await db.query('SELECT user_id FROM teachers WHERE is_active=FALSE ORDER BY since DESC')

    return dbResponse.rows.map(row=>row.user_id)
}