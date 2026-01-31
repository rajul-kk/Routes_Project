// Authentication controller - handles login and signup

// In-memory user storage (replace with database in production)
const users = [];

/**
 * User signup
 */
async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user (in production, hash the password!)
    const newUser = {
      id: users.length + 1,
      email: email.toLowerCase(),
      password: password, // TODO: Hash password in production
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

/**
 * User login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password (in production, compare hashed passwords!)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}

module.exports = {
  signup,
  login
};

