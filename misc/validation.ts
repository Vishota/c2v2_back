export function validateLogin(target: string) {
    return /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/.test(target)
        && target.length >= 4
        && target.length <= 16;
}

const clamp = (target: number, min: number, max: number) => Math.min(Math.max(target, min), max);

export function passwordStrength(target: string) {
    return (
        (/[a-z]/.test(target) ? 1 : 0)
        + (/[A-Z]/.test(target) ? 1 : 0)
        + (/[0-9]/.test(target) ? 1 : 0)
        + (/[\W_]/.test(target) ? 1 : 0)
        + (clamp(target.length, 8, 16) - 8) / 8
    ) / 5
}

export function validatePassword(target: string) {
    return passwordStrength(target) > 0.5
        && target.length >= 8
        && target.length <= 32
}