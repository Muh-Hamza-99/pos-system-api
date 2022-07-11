const fs = require("fs");
const path = require("path");
const os = require("os");

const encrypt = require("./encrypt");

const saveSupplier = (username, password, email) => {
    const encryptedSupplier = encrypt(`${username}#${password}#${email}`);
    fs.open(path.join(__dirname, "../lib", "suppliers.txt"), "a", 666, (event, id) => {
        fs.write(id, encryptedSupplier.content + "|" + encryptedSupplier.iv  + os.EOL, null, "utf-8", () => {
            fs.close(id, () => {
                console.log("Password saved to suppliers.txt!");
            });
        });
    });
};

module.exports = saveSupplier;