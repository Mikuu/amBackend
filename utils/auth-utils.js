const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { StatusCodes } = require('http-status-codes');

const credential = {
    apiKeySecret: "autoMindProjectApiKey~!@#$%^&*()__+"
}

const authenticateAPIKey = (req, res, next) => {
    const apiKeyInRequest = req.get("x-api-key");

    if (!apiKeyInRequest) {
        res.status(StatusCodes.FORBIDDEN).send({
            code: StatusCodes.FORBIDDEN,
            message: `missing API Key`
        }).end();
    } else {
        next();
    }
}

const createEncryptedAPIKey = () => {
    const APIKey = "AK"+crypto.randomBytes(9).toString('hex');
    return encryptAPIKey(APIKey);
};

const encryptAPIKey = APIKey => {
    return CryptoJS.AES.encrypt(APIKey, credential.apiKeySecret);
};

const decryptAPIKey = encryptedAPIKey => {
    return CryptoJS.AES.decrypt(encryptedAPIKey, credential.apiKeySecret).toString(CryptoJS.enc.Utf8);
};

function extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
}

module.exports = {
    createEncryptedAPIKey,
    decryptAPIKey,
    authenticateAPIKey,
    extractTokenFromHeader,
};
