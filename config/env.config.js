const path = require("path");

let fileServerHost, exchangeRootDir, mongodbUrl, bulkCompareMemoryList;

switch (process.env.AMB_ENV) {
    case "docker":
        // fileServerHost = process.env.AMB_FS_HOST_URL;
        // exchangeRootDir = "/exchange";
        mongodbUrl = `mongodb://${process.env.AMB_DB_USERNAME}:${process.env.AMB_DB_PASSWORD}@amb-mongodb:27088/ambackendb`;
        // bulkCompareMemoryList = process.env.AMB_COMP_MEM_LIMIT ? process.env.AMB_COMP_MEM_LIMIT : 500;
        break;
    default:
        // fileServerHost = "http://localhost:8123";
        // exchangeRootDir = "../exchange";
        mongodbUrl = `mongodb://${process.env.AMB_DB_USERNAME}:${process.env.AMB_DB_PASSWORD}@127.0.0.1:27088/ambackendb`;
        // bulkCompareMemoryList = process.env.AMB_COMP_MEM_LIMIT ? process.env.AMB_COMP_MEM_LIMIT : 500;
        break;
}
//
// const screenshotsPathToUrl = screenshotsPath => {
//     return screenshotsPath.replace(exchangeRootDir, fileServerHost);
// };
//
// const localTestScreenshots = projectName => {
//     return `screenshots/${projectName}`;
// };
//
// const localTestScreenshotsLatestPath = projectName => {
//     return path.join(localTestScreenshots(projectName), "latest");
// };
//
// const localTestScreenshotsBaselinePath = projectName => {
//     return path.join(localTestScreenshots(projectName), "baseline");
// };
//
// const projectInitializeFolders = projectName => {
//     return {
//         baselineFolder: `/file-server/projects/${projectName}/baseline`,
//         buildsFolder: `/file-server/projects/${projectName}/builds`,
//         latestFolder: `/file-server/projects/${projectName}/latest`,
//     };
// };
//
// const projectRootPath = projectName => {
//     return exchangeRootDir + `/file-server/projects/${projectName}`;
// };
//
// const projectTestImageWithPath = (projectName, testScreenshotName) => {
//     return path.join(exchangeRootDir, projectInitializeFolders(projectName).latestFolder, testScreenshotName);
// };
//
// const allZip = path.join(exchangeRootDir, "all.zip");

module.exports = {
    // allZip,
    mongodbUrl,
    // exchangeRootDir,
    // bulkCompareMemoryList,

    // localTestScreenshots,
    // localTestScreenshotsLatestPath,
    // localTestScreenshotsBaselinePath,

    // screenshotsPathToUrl,

    // projectRootPath,
    // projectInitializeFolders,
    // projectTestImageWithPath,
};
