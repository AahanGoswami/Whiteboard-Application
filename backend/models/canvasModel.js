const mongoose = require('mongoose');
require('./userModel'); // <-- Add this line to register the User schema

const canvasSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        elements: {
            type: [{ type: mongoose.Schema.Types.Mixed }],
        },
        shared_with: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);


canvasSchema.statics.getAllCanvases = async function (email) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw Error('User not found');
        }
        const canvases = await this.find({
            $or: [{ owner: user._id }, { shared_with: user._id }]
        });
        return canvases;
    } catch (error) {
    throw Error('Error getting canvases: ' + error.message);
}
};

canvasSchema.statics.createCanvas = async function (email, name) {
    try {
        const user = await mongoose.model('User').findOne({ email });
        if (!user) {
            throw Error('User not found');
        }
        const canvas = new this({
            owner: user._id,
            name,
            elements: [],
            shared_with: [],
        });
        const newCanvas = await canvas.save();
        return newCanvas;
    } catch (error) {
    throw Error('Error getting canvases: ' + error.message);
}
};

canvasSchema.statics.loadCanvas=async function(email,id) {
    const user = await mongoose.model('User').findOne({email

    });
    try {
        if (!user) {
            return Error ('User not found');
        }
        const canvas=await this.findOne({_id:id,$or:[{owner:user._id},{shared_with:user._id}]});
        return canvas;
    }catch(error) {
        return Error('Error getting canvas');
    }

}
canvasSchema.statics.updateCanvas=async function(email,id,elements) {
    const user=await mongoose.model('User').findOne
    ({email});
    try {
         if (!user) {
            return Error ('User not found');
        }
        const canvas=await this.findOne({_id:id,$or:[{owner:user._id},{shared_with:user._id}]});
        if (!canvas) {
            return Error('Canvas not found');
        }
        canvas.elements=elements;
        const updatedCanvas=await canvas.save();
        return updatedCanvas;
    }catch (error) {
        return Error ('Error updating canvas');
    }
}


canvasSchema.statics.shareCanvas = async function (email, canvasId, sharedWithEmail) {
  const user = await mongoose.model('User').findOne({ email });
  const sharedWithUser = await mongoose.model('User').findOne({ email: sharedWithEmail });
  try {
    if(!user || !sharedWithUser) {
      return Error('User not found');
    }

    const canvas = await this.findOne({ _id: canvasId, owner: user._id });
    if(!canvas) {
      return Error('Canvas not found');
    }

    canvas.shared_with.push(sharedWithUser._id);
    const updatedCanvas = await canvas.save();
    return updatedCanvas;

  } catch (error) {
    return Error('Error sharing canvas');
  }
};


const Canvas = mongoose.model('Canvas', canvasSchema);
module.exports = Canvas;