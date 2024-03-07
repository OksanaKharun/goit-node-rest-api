import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import HttpError from '../helpers/HttpError.js';
import 'dotenv/config';




export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashPassword });
        res.status(201).json(
            {
                "users": {

                    email: newUser.email,
                    subscription: newUser.subscription,
                }
            })
    }
    catch (error) {
        next(error)
    }
};

       
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            throw HttpError(401, 'Email or password is wrong');
        }
      
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw HttpError(401, 'Email or password is wrong');
        }
      
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        await User.findByIdAndUpdate(user._id, { token });

        res.json({
            token,
            "users": {
                email: user.email,
                subscription: user.subscription,
            }
        });
    }   catch (error) {
        next(error);
    }
};


export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}



 export const getCurrentUser = async (req, res, next) => {
     try {
         const { token, email, subscription } = req.user;

         if (!token) {
             return res.status(401).json({ message: "Not authorized" });
         }
         res.json({
             email,
             subscription,
         });

     } catch (error) {
         next(error);
     }
};
