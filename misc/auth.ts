import { Handler } from 'express'
import { checkTokens } from '../logics/auth'
import { Response } from 'express'
import env from '../infrastructure/env'
import { isAdmin } from '../data/admins'

async function getAuth(...[req, res]: Parameters<Handler>): Promise<number | false> {
    if (!(req.cookies.access && req.cookies.refresh)) {
        return false
    }
    const [id, refresh] = req.cookies.refresh.split('>')
    const auth = await checkTokens(parseInt(id), req.cookies.access, refresh);
    if (!auth) return false;
    if (auth.tokens) {
        setAuthCookie(res, auth)
    }
    return auth ? auth.id : false
}
async function checkAdmin(...[req, res, next]: Parameters<Handler>): Promise<{
    id?: number; isAdmin: false | {
        admin: true
        prime: boolean
    }
}> {
    const id = await getAuth(req, res, next);
    if (!id) return { isAdmin: false };
    return {
        id,
        isAdmin: await isAdmin(id)
    }
}

function setAuthCookie(res: Response, info: { id: number, tokens?: { access?: string, refresh?: string } }) {
    if (info.tokens?.access) {
        res.cookie('access', info.tokens.access, {
            maxAge: parseInt(env.get('ACCESS_ALIVE_MS')),
            httpOnly: true
        });

    }
    if (info.tokens?.refresh) {
        res.cookie('refresh', info.id + '>' + info.tokens.refresh, {
            maxAge: parseInt(env.get('REFRESH_ALIVE_MS')),
            httpOnly: true
        });
    }
}

async function getAuth_fake_true(...[req, res]: Parameters<Handler>): Promise<number | false> {
    return 1
}

// FAKES
function makeFake_getAuth(fakeUserId: number): typeof getAuth {
    return async () => fakeUserId
}
function makeFake_checkAdmin(getAuthF: typeof getAuth, admin: boolean, prime: boolean): typeof checkAdmin {
    return async (req, res, next) => {
        const id = await getAuthF(req, res, next);
        if (!id) {
            throw 'noid'
            return 0 as any // without this IDE thinks that type of id still can be false further, despite exception is thrown in case it is equal to false
        }
        return {
            id,
            isAdmin: admin ? {
                admin: true,
                prime
            } : false
        }
    }
}

const fake_getAuth = makeFake_getAuth(3);
const fake_checkAdmin = makeFake_checkAdmin(fake_getAuth, false, false);

// // export fake
// export {
//     fake_getAuth as getAuth,
//     fake_checkAdmin as checkAdmin,
//     setAuthCookie
// }
// export not fake
export { getAuth, checkAdmin, setAuthCookie }