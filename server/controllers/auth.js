import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be minimum 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    //hash password
    const hashedPassword = await hashPassword(password);

    //register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    console.log("saved user", user);
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error.Try again");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    const match = await comparePassword(password, user.password);

    if (!match) return res.status(400).send("Wrong password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //return user and token to the client exclude hashed password
    user.password = undefined;

    //SEND TOKEN AND COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, //only works on https
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error.Try again");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const sendTestEmail = async (req, res) => {
  const params = {
    Source: process.env.EMAIL_FROM,

    Destination: {
      ToAddresses: ["sulav.khadka787@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
              <html>
                  <h1>Reset Password link </h1>
                  <p>Please use the following link to reset your password </p>
              </html>

            `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };
  const emailSent = SES.sendEmail(params).promise();

  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};
