
function extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
}

module.exports = {
    extractTokenFromHeader,
};
