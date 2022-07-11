const fs = require("fs");
const path = require("path");
const os = require("os");

const encrypt = require("./encrypt");

const saveSupplier = supplierUsername => {
    const encryptedUsername = encrypt(supplierUsername);
    fs.open(path.join(__dirname, "../lib", "suppliers.txt"), "a", 666, (event, id) => {
        fs.write(id, encryptedUsername.content + "|" + encryptedUsername.iv  + os.EOL, null, "utf-8", () => {
            fs.close(id, () => {
                console.log(chalk.green("Password saved to suppliers.txt!"));
            });
        });
    });
};

module.exports = saveSupplier;