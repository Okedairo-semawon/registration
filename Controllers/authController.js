import {User} from '../Models/userModel.js';

const signup = async (req, res, next) => {
    const {name, email, password} = req.body;
   try {
    if (!name || !email || !password) {
       return res.status(400).json({message: 'All fields are required'});
    }

    const normalizedEmail = email.toLowerCase();
       //  Check if user already exists 
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
       return res.status(400).json({message: 'User already exists'});
    }

        // create new user
    const newUser = await User.create({
        name,
        email: normalizedEmail,
        password
    })
    return res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: await newUser.generateToken() ,
        verified: newUser.verified
    })
   } catch (error) {
    next(error);
   }
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
  try {
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }
    // check if fthe user exists
    const existingUser = await User.findOne({email});
    if (!existingUser) {
        return res.status(404).json({message: 'User not found'});
    }
     // check if the password is correct
    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    return res.status(200).json({
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        token: await existingUser.generateToken(),
        verified: existingUser.verified
    });
    } catch (error) {
        next(error);
    }
}


export {signup, login};