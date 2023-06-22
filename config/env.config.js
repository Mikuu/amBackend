let mongodbUrl;

switch (process.env.AMB_ENV) {
    case "docker":
        mongodbUrl = `mongodb://${process.env.AMB_DB_USERNAME}:${process.env.AMB_DB_PASSWORD}@amb-mongodb:27088/ambackendb`;
        break;
    default:
        mongodbUrl = `mongodb://${process.env.AMB_DB_USERNAME}:${process.env.AMB_DB_PASSWORD}@127.0.0.1:27088/ambackendb`;
        break;
}

module.exports = {
    mongodbUrl,
};
