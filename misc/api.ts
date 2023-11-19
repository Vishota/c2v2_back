export function checkKeys<
    T extends Record<K, any>,
    const K extends string,
    const P extends string | never
>(
    target: T,
    required: K[],
    possible: Exclude<P, K>[] = [] as never[]
): Record<K, T[keyof T]> &
    Partial<Record<P, T[keyof T]>> {
    if (!(typeof target === 'object')) throw 'not an object given to checkKeys'
    required.forEach(v => {
        if (!(v in target)) throw 'missing property "' + v.toString() + '"'
    })

    return target as any
}