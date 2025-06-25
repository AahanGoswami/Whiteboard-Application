const mongoose = require('mongoose');
const bcrypt=require ('bcrypt');
const validator=require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
       
    }
}, {
    timestamps: true,
    collection:'users'
});

userSchema.statics.register = async function(name, email, password) {
    try {
        // Check if user already exists
        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8
        })) {
            throw new Error(
                'Password is not strong enough. It must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new this({
            name,
            email,
            password: hashedPassword
        });

        const newUser = await user.save();
        return newUser;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
}

userSchema.statics.getUser=async function(email) {
    try {
        const users = await this.findOne({email});
        return users;
    } catch (error) {
        throw new Error('Error getting user: ' + error.message);
    }
}

userSchema.statics.login = async function(email, password) {
    try {
        const user = await this.findOne({ email });
        console.log('User found:', user);
        if (!user) {
            throw new Error('Invalid login credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Invalid login credentials');
        }
        return user;
    } catch (error) {
        throw new Error('Error logging in : ' + error.message);
    }
}

const userModel=mongoose.model('User', userSchema);
module.exports = userModel;