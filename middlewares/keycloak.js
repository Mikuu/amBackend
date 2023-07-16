const Keycloak = require('keycloak-connect');

/**
 * Keycloak-connect validates access_token and may return 403 access denied when the validation failed, but lack of
 * error message to indicate the root cause of the failure, to make the debugging easier, add console.log in below files:
 *
 * 1. node_modules/keycloak-connect/middleware/auth-utils/grant-manager.js / GrantManager.prototype.validateGrant
 *        return new Promise((resolve, reject) => {
 *           const promises = []
 *           promises.push(validateGrantToken(grant, 'access_token', 'Bearer'))
 *           if (!self.bearerOnly) {
 *             if (grant.id_token) {
 *               promises.push(validateGrantToken(grant, 'id_token', 'ID'))
 *             }
 *           }
 *           Promise.all(promises).then(() => {
 *             resolve(grant)
 *           }).catch((err) => {
 *              console.log(`FBI --> validating grant failed: ${err.message}`)
 *             reject(new Error(err.message))
 *           })
 *         })
 *
 * 2. node_modules/keycloak-connect/middleware/auth-utils/grant-manager.js / GrantManager.prototype.validateToken
 **/
const keycloak = new Keycloak({}, {
    "realm": "automind",
    "auth-server-url": "http://localhost:8080/",
    "ssl-required": "external",
    "resource": "automind-backend",
    "credentials": {
        "secret": "BoKdABpnhE1HLLyvoqqFeWr3V3rSUN7I"
    },
    "confidential-port": 0,
    "bearer-only": true     // keep this, otherwise will redirect frontend to keycloak login page and cause CORS issue.
});

module.exports = {
    keycloak,
}
