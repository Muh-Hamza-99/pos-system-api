const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

const encrypt = text => {
    const cipher = crypto.createCipheriv(algorithm, process.env.ENCRYPTION_SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    };
};

module.exports = encrypt;