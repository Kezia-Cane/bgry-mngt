const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user payload to request
    req.user = { userId: decoded.userId, username: decoded.username, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check for specific roles
const authorize = (roles = []) => {
  // roles param can be a single role string (e.g., 'admin')
  // or an array of roles (e.g., ['admin', 'staff'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [ // Return an array of middleware functions
    // First, ensure the user is authenticated
    auth,
    // Then, check if the authenticated user has one of the required roles
    (req, res, next) => {
      if (!req.user || (roles.length && !roles.includes(req.user.role))) {
        // User is not authenticated or does not have the required role
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }
      // Authentication and authorization successful
      next();
    }
  ];
};

module.exports = { auth, authorize };
