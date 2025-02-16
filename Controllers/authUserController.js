const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
    try {
        console.log("Sending OTP to:", email);
        console.log("EMAIL_USER:", process.env.EMAIL_USER);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log("Transporter created successfully");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject:` Your OTP for registration : ${otp} `,
            html: `We Shanta Tailors are happy to have you as our customer. Your OTP for registration is <strong> ${otp} </strong>. Please verify your email to complete registration. <br><br> Please don't share this OTP with anyone for security reasons. <br> <br><br> Thanks & Regards, <br> Shanta Tailors Team`,   
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Temporary storage for OTPs (use Redis or a database in production)
global.otpCache = global.otpCache || {};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await 
        User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        global.otpCache[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // Expire in 10 minutes
        };

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to email for password reset' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }}
// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, DOB, number, Address } = req.body;

    try {
        console.log("Received request:", req.body); // Log request data

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP(); // Generate OTP

        global.otpCache[email] = {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000, // Expire in 10 minutes
            userDetails: { name, email, password: hashedPassword, DOB, number, Address },
        };

        await sendOTPEmail(email, otp);

        console.log("OTP sent to:", email); // Log OTP sending
        res.status(201).json({ message: 'OTP sent for verification. Please verify to complete registration.' });
    } catch (error) {
        console.error("Error in registerUser:", error); // Log the actual error
        res.status(500).json({ error: error.message });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

if (!global.otpCache) {
    global.otpCache = {};  
}

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Log request data for debugging
        console.log("Received OTP verification request:", { email, otp });

        // Check if OTP cache exists for the provided email
        const cachedData = global.otpCache[email];
        if (!cachedData) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        console.log("Cached OTP Data:", cachedData);

        // Verify the OTP matches
        if (cachedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (Date.now() > cachedData.expiresAt) {
            delete global.otpCache[email]; // Clean up expired OTP
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Ensure user details exist in cache
        if (!cachedData.userDetails) {
            return res.status(400).json({ message: 'User details missing in OTP data' });
        }

        // Create a new user using cached data
        const newUser = new User(cachedData.userDetails);

        // Log user data for debugging
        console.log("Saving user with details:", cachedData.userDetails);

        // Save the new user to the database
        await newUser.save();

        // Clean up the OTP cache after successful registration
        delete global.otpCache[email];

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Log and return detailed error message for debugging
        console.error("Error during OTP verification:", error);
        res.status(500).json({ error: error.message });
    }
};


// Login User
// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '10d' }
      );
  
  
      // Send response with user data and token
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          DOB: user.DOB,
          number: user.number,
          Address: user.Address
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  exports.getUserDetailsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('name Address number'); // Selecting only required fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
