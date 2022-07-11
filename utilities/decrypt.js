const fs = require("fs");
const path = require("path")
const crypto = require("crypto");
const readline = require("readline");

const algorithm = "aes-256-ctr";

const decrypt = async () => {
    const suppliers = [];
    const pathToFile = path.join(__dirname, "../lib", "suppliers.txt")
    if (!fs.existsSync(pathToFile)) console.log(chalk.redBright("suppliers.txt doesn't exist."));
    const fileStream = fs.createReadStream(pathToFile);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    for await (const line of rl) {
        const [ content, iv ] = line.split("|");  
        const decipher = crypto.createDecipheriv(algorithm, process.env.ENCRYPTION_SECRET_KEY, Buffer.from(iv, "hex"));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
        suppliers.push(decrypted.toString());
    };
    return suppliers;
};

module.exports = decrypt;