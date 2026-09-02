
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const imageSchema = new Schema({
    title : String ,
    image:{
        url : String,
        filename : String
    },
    category : String,
    tags : [String],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

imageSchema.index({ category: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ title: "text", category: "text", tags: "text" });

module.exports = mongoose.model("Image", imageSchema);