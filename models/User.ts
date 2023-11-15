import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface User extends Model<IUser> {
    findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema: Schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByCredentials = async function(email: string, password: string): Promise<IUser> {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    return user;
};

const User = mongoose.models.User as User || mongoose.model<IUser, User>('User', userSchema);

export default User;