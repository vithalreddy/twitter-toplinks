const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
    {
        userId: { type: Schema.ObjectId },
        twitterUserName: { type: String, required: true },
        twitterUserId: { type: String, required: true, index: true },
        twitterUserToken: { type: String, required: true },
        twitteruserTokenSecret: { type: String, required: true },
        topLinks: { type: Schema.Types.Mixed, default: [] },
        topUsers: { type: Schema.Types.Mixed, default: [] },
    },
    { timestamps: true }
);
schema.static('findOneOrCreate', async function findOneOrCreate(
    condition,
    doc
) {
    const user = await this.findOne(condition);
    return user || this.create(doc);
});

module.exports = mongoose.model('User', schema);
