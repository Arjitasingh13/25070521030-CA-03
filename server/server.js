/**
 * EventSpark — Tech Fest & Workshop Management Portal
 * Express API with MongoDB (Mongoose)
 * Local DB: mongodb://localhost:27017/eventspark
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Contact = require('./models/Contact');
const Speaker = require('./models/Speaker');
const ScheduleDay = require('./models/ScheduleDay');
const FestivalInfo = require('./models/FestivalInfo');
const Sponsor = require('./models/Sponsor');
const { seedDatabase } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventspark';
const JWT_SECRET = process.env.JWT_SECRET || 'eventspark_local_development_only';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

const sendError = (res, status, message) => res.status(status).json({ success: false, message });
const sendApiError = (res, error, fallback) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return sendError(res, 400, error.message);
  }
  if (error.code === 11000) {
    return sendError(res, 409, 'A record with those details already exists.');
  }
  console.error(fallback, error);
  return sendError(res, 500, fallback);
};
const createResetMailer = () => {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const password = process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;
  if (!host || !user || !password) return null;

  const port = Number(process.env.EMAIL_PORT || process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('EMAIL_PORT must be a valid port number.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: (process.env.EMAIL_SECURE || process.env.SMTP_SECURE) === 'true',
    auth: { user, pass: password },
  });
};
const resetEmailFrom = () =>
  process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;
const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const requireAuth = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) {
    return sendError(res, 401, 'Sign in is required for this action.');
  }

  try {
    req.user = jwt.verify(authorization.slice(7), JWT_SECRET);
    return next();
  } catch {
    return sendError(res, 401, 'Your session is invalid or has expired. Please sign in again.');
  }
};
const optionalAuth = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  if (!authorization) return next();
  if (!authorization.startsWith('Bearer ')) {
    return sendError(res, 401, 'Your session is invalid or has expired. Please sign in again.');
  }

  try {
    req.user = jwt.verify(authorization.slice(7), JWT_SECRET);
    return next();
  } catch {
    return sendError(res, 401, 'Your session is invalid or has expired. Please sign in again.');
  }
};
const isEventOwnerOrAdmin = (event, user) => {
  const adminEmail = String(process.env.EVENT_ADMIN_EMAIL || '').trim().toLowerCase();
  const userEmail = String(user.email || '').trim().toLowerCase();
  const isAdmin = adminEmail && userEmail === adminEmail;
  const creatorId = event.createdBy?._id || event.createdBy?.id || event.createdBy;
  const userId = user.id || user._id;
  const isCreatorById = creatorId && userId && String(creatorId) === String(userId);
  const isCreatorByEmail = event.createdByEmail
    && userEmail
    && String(event.createdByEmail).trim().toLowerCase() === userEmail;
  return Boolean(isAdmin || isCreatorById || isCreatorByEmail);
};

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'EventSpark API is running', version: '1.0.0' });
});

/** POST /api/auth/signup — register a new user */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required.');
    }
    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters.');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return sendApiError(res, error, 'Signup failed.');
  }
});

/** POST /api/auth/login — authenticate credentials */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const token = signToken(user);
    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return sendApiError(res, error, 'Login failed.');
  }
});

/** POST /api/auth/forgot-password — send a single-use password reset link */
app.post('/api/auth/forgot-password', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!email) return sendError(res, 400, 'Email is required.');

  let mailer;
  try {
    mailer = createResetMailer();
  } catch (error) {
    console.error('Invalid password recovery email configuration:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send reset email. Check SMTP configuration.',
    });
  }
  if (!mailer) {
    return res.status(500).json({
      success: false,
      error: 'Failed to send reset email. Check SMTP configuration.',
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(202).json({
        success: true,
        message: 'If an account exists for that email, password recovery instructions will be sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetTokenHash: hashResetToken(resetToken),
          passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      }
    );

    const resetUrl = new URL('/forgot-password', process.env.CLIENT_URL || 'http://localhost:5173');
    resetUrl.searchParams.set('email', user.email);
    resetUrl.searchParams.set('token', resetToken);
    try {
      await mailer.sendMail({
        from: resetEmailFrom(),
        to: user.email,
        subject: 'Reset your EventSpark password',
        text: `Use this link to reset your EventSpark password. The link expires in 15 minutes:\n\n${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use the link below to reset your EventSpark password. It expires in 15 minutes.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      try {
        await User.updateOne(
          { _id: user._id, passwordResetTokenHash: hashResetToken(resetToken) },
          { $unset: { passwordResetTokenHash: 1, passwordResetExpires: 1 } }
        );
      } catch (cleanupError) {
        console.error('Unable to clear failed password recovery token:', cleanupError);
      }
      console.error('Password recovery email delivery failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send reset email. Check SMTP configuration.',
      });
    }

    return res.status(202).json({
      success: true,
      message: 'If an account exists for that email, password recovery instructions will be sent.',
    });
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the password recovery request.');
  }
});

/** POST /api/auth/reset-password — atomically consume a valid reset token */
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email || typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
      return sendError(res, 400, 'A valid email and reset token are required.');
    }
    if (
      typeof newPassword !== 'string' ||
      newPassword.length < 8 ||
      Buffer.byteLength(newPassword, 'utf8') > 72
    ) {
      return sendError(res, 400, 'Password must be at least 8 characters and no more than 72 bytes.');
    }

    const password = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      {
        email,
        passwordResetTokenHash: hashResetToken(token),
        passwordResetExpires: { $gt: new Date() },
      },
      {
        $set: { password },
        $unset: { passwordResetTokenHash: 1, passwordResetExpires: 1 },
      },
      { new: true, runValidators: true }
    );
    if (!user) return sendError(res, 400, 'Reset link is invalid or expired. Request a new one.');

    return res.json({ success: true, message: 'Password updated. You can now sign in.' });
  } catch (error) {
    return sendApiError(res, error, 'Unable to reset the password.');
  }
});

/** GET /api/events — fetch all active events */
app.get('/api/events', optionalAuth, async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    const responseEvents = req.user
      ? events.map((event) => {
          const serializedEvent = event.toObject();
          serializedEvent.canDelete = isEventOwnerOrAdmin(event, req.user);
          return serializedEvent;
        })
      : events;
    return res.json({ success: true, count: events.length, events: responseEvents });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch events.');
  }
});

/** GET /api/events/:id — event details (used by the details page) */
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return sendError(res, 404, 'Event not found.');
    return res.json({ success: true, event });
  } catch (error) {
    return sendError(res, 400, 'Invalid event ID.');
  }
});

/** GET /api/schedule — three-day festival schedule */
app.get('/api/schedule', async (_req, res) => {
  try {
    const days = await ScheduleDay.find({ isActive: true }).sort({ dayNumber: 1 });
    return res.json({ success: true, days });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch the festival schedule.');
  }
});

/** GET /api/speakers — active festival speakers */
app.get('/api/speakers', async (_req, res) => {
  try {
    const speakers = await Speaker.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return res.json({ success: true, speakers });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch festival speakers.');
  }
});

/** GET /api/festival-info — about page description, stats, and highlights */
app.get('/api/festival-info', async (_req, res) => {
  try {
    const info = await FestivalInfo.findOne({ key: 'eventspark' });
    if (!info) return sendError(res, 503, 'Festival information has not been seeded yet.');
    return res.json({ success: true, info });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch festival information.');
  }
});

/** GET /api/sponsors — active sample and confirmed sponsor listings */
app.get('/api/sponsors', async (_req, res) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return res.json({ success: true, sponsors });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch sponsors and partners.');
  }
});

/** POST /api/events — create an event */
app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { title, description, date, venue, prizePool, category, rules, timings } = req.body;
    if (!title || !description || !date || !venue || !prizePool || !category) {
      return sendError(res, 400, 'Title, description, date, venue, prize pool, and category are required.');
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      prizePool,
      category,
      rules,
      timings,
      isActive: true,
      createdBy: req.user.id,
      createdByEmail: req.user.email,
    });

    return res.status(201).json({ success: true, message: 'Event created.', event });
  } catch (error) {
    return sendApiError(res, error, 'Unable to create event.');
  }
});

/** DELETE /api/events/:id — delete an event by ID */
app.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return sendError(res, 404, 'Event not found.');
    if (!isEventOwnerOrAdmin(event, req.user)) {
      return sendError(res, 403, 'You can only delete events you created.');
    }

    await event.deleteOne();
    return res.json({ success: true, message: 'Event deleted.', id: req.params.id });
  } catch (error) {
    return sendError(res, 400, 'Invalid event ID.');
  }
});

/** GET /api/user/activity — activity for the authenticated user */
app.get('/api/user/activity', requireAuth, async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) return sendError(res, 400, 'Email is required.');
  if (email !== String(req.user.email || '').toLowerCase()) {
    return sendError(res, 403, 'You can only view activity for your own account.');
  }

  try {
    const [registrations, queries] = await Promise.all([
      Registration.find({ email }).populate('eventId', 'title date venue').sort({ createdAt: -1 }),
      Contact.find({ email }).sort({ createdAt: -1 }),
    ]);
    return res.json({ success: true, registrations, queries });
  } catch (error) {
    return sendApiError(res, error, 'Unable to fetch your activity.');
  }
});

/** POST /api/register — event registration / booking */
app.post('/api/register', async (req, res) => {
  try {
    const { eventId, eventTitle, name, email, phone, college, teamName, participants } = req.body;
    if (!eventId || !name || !email || !phone || !college) {
      return sendError(res, 400, 'eventId, name, email, phone, and college are required.');
    }

    const event = await Event.findById(eventId);
    if (!event) return sendError(res, 404, 'Cannot register: event does not exist.');

    const registration = await Registration.create({
      eventId,
      eventTitle: eventTitle || event.title,
      name,
      email,
      phone,
      college,
      teamName: teamName || 'Solo',
      participants: participants || 1,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed. See you at EventSpark!',
      registration,
    });
  } catch (error) {
    return sendApiError(res, error, 'Registration failed.');
  }
});

/** POST /api/contact — helpdesk query */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return sendError(res, 400, 'Name, email, subject, and message are required.');
    }

    const contact = await Contact.create({ name, email, subject, message });
    return res.status(201).json({
      success: true,
      message: 'Query received. The helpdesk will reply shortly.',
      contact,
    });
  } catch (error) {
    return sendApiError(res, error, 'Unable to submit query.');
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`EventSpark server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('EventSpark startup failed:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
