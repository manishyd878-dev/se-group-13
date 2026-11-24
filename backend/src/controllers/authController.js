import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (patient or hospital)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'patient', phone, bloodGroup, hospitalDetails } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const validBloodGroup =
    role === 'patient' && bloodGroup && bloodGroup.trim() !== '' ? bloodGroup.trim() : null;

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'hospital' ? 'hospital' : 'patient',
    phone: phone || undefined,
    bloodGroup: validBloodGroup,
  });

  // If registering as a hospital, create a linked Hospital record so the
  // account immediately has a dashboard/inventory to manage.
  if (user.role === 'hospital') {
    const hospital = await Hospital.create({
      name: hospitalDetails?.name || name,
      owner: user._id,
      address: hospitalDetails?.address || 'Address not yet provided',
      city: hospitalDetails?.city || '',
      phone: phone || hospitalDetails?.phone || '',
      email,
      verified: false,
    });
    user.hospital = hospital._id;
    await user.save();
  }

  const populatedUser = await User.findById(user._id).populate('hospital');

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: populatedUser ? populatedUser.toSafeObject() : user.toSafeObject(),
  });
});

// @desc    Login with email + password
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('hospital');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.password && user.googleId) {
    res.status(401);
    throw new Error('This account was created with Google. Please use Continue with Google to log in.');
  }

  if (!(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @desc    Get the logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('hospital');
  res.json({ success: true, user });
});

// @desc    Update the logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, bloodGroup } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Authenticate with Google OAuth 2.0 (Login or Register)
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken, code, role = 'patient', redirectUri } = req.body;

  if (!idToken && !code) {
    res.status(400);
    throw new Error('Google ID token or authorization code is required');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId) {
    res.status(500);
    throw new Error('Google OAuth is not configured on the server. Missing GOOGLE_CLIENT_ID in environment.');
  }

  let verifiedPayload = null;

  try {
    const oauth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      redirectUri || 'postmessage'
    );

    if (idToken) {
      // Direct Google ID token verification using Google's official library
      const ticket = await oauth2Client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      verifiedPayload = ticket.getPayload();
    } else if (code) {
      // Exchange authorization code for tokens, then verify the returned ID token
      const { tokens } = await oauth2Client.getToken({
        code,
        redirect_uri: redirectUri || 'postmessage',
      });

      if (tokens.id_token) {
        const ticket = await oauth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: clientId,
        });
        verifiedPayload = ticket.getPayload();
      } else if (tokens.access_token) {
        // Fallback userinfo verification if id_token was not present
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (userInfoRes.ok) {
          const info = await userInfoRes.json();
          verifiedPayload = {
            sub: info.sub,
            email: info.email,
            email_verified: info.email_verified,
            name: info.name,
            picture: info.picture,
          };
        }
      }
    }
  } catch (error) {
    console.error('[Google OAuth Verification Error]:', error.message);
    res.status(401);
    throw new Error(`Google authentication failed: ${error.message || 'Invalid token or code'}`);
  }

  if (!verifiedPayload || !verifiedPayload.email) {
    res.status(400);
    throw new Error('Unable to retrieve verified user information from Google');
  }

  if (verifiedPayload.email_verified === false) {
    res.status(400);
    throw new Error('Google account email is not verified');
  }

  const email = verifiedPayload.email.toLowerCase();
  const googleId = verifiedPayload.sub;
  const name = verifiedPayload.name || email.split('@')[0];
  const picture = verifiedPayload.picture || null;

  // Check whether user already exists in database
  let user = await User.findOne({ email }).populate('hospital');

  if (user) {
    // If account already exists with the same verified email, securely link Google authentication
    let modified = false;
    if (!user.googleId) {
      user.googleId = googleId;
      modified = true;
    }
    if (!user.avatar && picture) {
      user.avatar = picture;
      modified = true;
    }
    if (modified) {
      await user.save();
    }
  } else {
    // If user is new, automatically create their account
    const assignedRole = role === 'hospital' ? 'hospital' : 'patient';
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture,
      authProvider: 'google',
      role: assignedRole,
    });

    // If registering as hospital, create linked Hospital document
    if (user.role === 'hospital') {
      const hospital = await Hospital.create({
        name: user.name,
        owner: user._id,
        address: 'Address not yet provided',
        city: '',
        phone: '',
        email: user.email,
        verified: false,
      });
      user.hospital = hospital._id;
      await user.save();
    }

    user = await User.findById(user._id).populate('hospital');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});
