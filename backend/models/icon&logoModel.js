const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogoIconSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required'],
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: {
            validator: function (v) {
                return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
}, { timestamps: true });

LogoIconSchema.index({ title: 1 }, { unique: true });

const LogoIconModel = mongoose.model('LogoIcon', LogoIconSchema);

module.exports = LogoIconModel;
