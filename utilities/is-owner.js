const isOwner = (userID, resourceID, modelName) => {
    const Model = require(`../models/${modelName}`);
    const result = await Model.findById(resourceID);
    return result.user === userID;
};

module.exports = isOwner;