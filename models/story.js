const mongoose = require('../databases/stories');

//TODO: Handling the photo
const StorySchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    }
});

const Story = mongoose.storiesCon.model('Story', StorySchema);

module.exports = Story;