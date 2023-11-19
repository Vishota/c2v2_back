import EnvManager from 'vitools/EnvManager'

export default new EnvManager({
    'DB_HOST': '127.0.0.1',
    'DB_USER': 'vishota',
    'DB_PASSWORD': 'vishota',
    'DB_NAME': 'main',
    'AUTH_BCRYPT_ROUNDS': '12',
    'JWT_SECRET': 'Should_be_set_in_production!!!',
    'ACCESS_ALIVE_MS': '' + 1000 * 60 * 60 * 4,  // 4 hours
    'REFRESH_ALIVE_MS': '' + 1000 * 60 * 60 * 24 * 60,  // 60 days; this actually is hardcoded in db as default value for 'valid_until' in refresh table
})