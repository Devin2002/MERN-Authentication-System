import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// =================== REGISTER ===================
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP immediately during registration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send verification email WITH OTP
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome! Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to Our App!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering! Your account has been created with email: <strong>${email}</strong></p>
          <p>To verify your email address, please use the following OTP:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `,
      text: `Welcome to our app, ${name}! Your verification OTP is: ${otp}. This OTP is valid for 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: 'User registered successfully. Please check your email for verification OTP.'
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =================== LOGIN ===================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =================== LOGOUT ===================
export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ============= SEND VERIFY OTP (to user email) ===================
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: 'Account is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Email Verification</h2>
          <p>Hi ${user.name},</p>
          <p>Your verification OTP is:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `Your verification OTP is ${otp}. Valid for 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =================== VERIFY EMAIL USING OTP ====================
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: 'Missing OTP' });
  }

  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: 'Account is already verified' });
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP has expired' });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// =================== CHECK IF USER IS AUTHENTICATED ===================
export const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =================== SEND PASSWORD RESET OTP ===================
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF4444;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your password. Your OTP is:</p>
          <div style="background-color: #FEE2E2; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #EF4444; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      text: `Your password reset OTP is ${otp}. Use this to reset your password. Valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// =================== RESET User PASSWORD ===================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP and New Password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};