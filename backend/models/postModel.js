const mongoose=require('mongoose');

const postsSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength:200
    },
    content: {
        type: String,
        required: true,
        trim: true

    },
    numberOfLikes:{
        type: Number,
        default: 0
    },
   

    
},{
    timestamps: true,
    collection:'test'
});

postsSchema.statics.createPost=async function(title,content){
    try{
    const post = new this({
        title,
        content
    });
   const newPost = await post.save();
   return newPost;
    }catch (error) {
        throw new error('Error creating post: ' + error.message);
    }
}
postsSchema.statics.getPosts=async function(){
    try {
       const posts=await this.find();
       return posts;
    }catch (error) {
        throw new error('Error creating post: ' + error.message);
    }
}

const postsModel=mongoose.model('posts',postsSchema);
module.exports=postsModel;