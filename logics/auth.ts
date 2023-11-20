import { insertUser, checkUser } from "../data/accounts";
import { deleteRefresh, makeRefresh } from "../data/refresh";
import env from "../infrastructure/env";
import jwt from "../infrastructure/jwt";

// some logics can be added further (validation, etc)
export { insertUser as addUser, checkUser }
export { makeRefresh }

export async function checkTokens(userId: number, access: string|undefined, refresh: string): Promise<false | { id: number; tokens?: { access: string; refresh: string; }; }> {
    if(access) {
        const accessChecked = await checkAccess(userId, access)
        if (accessChecked) return { id: accessChecked }
    }
    const refreshed = await useRefresh(userId, refresh);
    if (!refreshed) return false
    return {
        id: userId,
        tokens: refreshed
    }
}
export async function logIn(username: string, password: string): Promise<{
    id: number; tokens: {
        access: string; refresh: string;
    };
} | false> {
    const valid = await checkUser(username, password);
    return valid ? {
        id: valid,
        tokens: await makeAuthTokenPair(valid)
    } : false
}
export async function signUp(username: string, password: string): Promise<{
    id: number; tokens: {
        access: string; refresh: string;
    };
} | false> {
    const added = await insertUser(username, password);
    return added ? {
        id: added,
        tokens: await makeAuthTokenPair(added)
    } : logIn(username, password)
}

async function makeAuthTokenPair(userId: number): Promise<{ access: string; refresh: string; }> {
    return {
        access: await makeAccess(userId),
        refresh: await makeRefresh(userId)
    }
}
async function useRefresh(userId: number, refresh: string): Promise<false | { access: string; refresh: string; }> {
    const deleted = await deleteRefresh(userId, refresh)
    if (!deleted) return false
    return makeAuthTokenPair(userId)
}

async function makeAccess(userId: number): Promise<string> {
    return jwt.sign({
        userId
    }, {
        expirationTime: (new Date().getTime() + parseInt(env.get('ACCESS_ALIVE_MS'))) / 1000
    })
}
async function checkAccess(userId:number, access: string): Promise<false | number> {
    try {
        const verified = await jwt.verify(access);
        return !verified ? false : verified.payload.userId as number == userId ? userId : false
    } catch {
        return false
    }
}