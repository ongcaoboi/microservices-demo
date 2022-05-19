let ACCESS_TOKEN = "";

if (process.env.KEY_ACCESS_TOKEN) {
    ACCESS_TOKEN = process.env.KEY_ACCESS_TOKEN;
}

module.exports = {
    ACCESS_TOKEN
};