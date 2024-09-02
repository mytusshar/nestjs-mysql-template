module.exports = {
    cleanArray(arr) {
        return '{"' + arr.map((e) => cleanEntry(e)).join('", "') + '"}';
    }
};
function cleanEntry(obj) {
    return JSON.stringify(obj).replace(/"/g, '\\"');
}
