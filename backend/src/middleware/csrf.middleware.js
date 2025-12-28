import crypto from "crypto";
import jwt from "jsonwebtoken";
class CSRFMiddleware {
  constructor() {
    this.tokenMap = new Map();
    this.cleanupInterval = 15 * 60 * 1000;
    this.tokenLifetime = 30 * 60 * 1000;
    setInterval(() => this.cleanupExpiredTokens(), this.cleanupInterval);
  }

  /**
   * Generate a new CSRF token
   * @returns {Object}
   */
  generateToken() {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.tokenLifetime);
    
    this.tokenMap.set(token, {
      expiresAt,
      createdAt: new Date()
    });
    
    return { token, expiresAt };
  }

  /**
   * Validate CSRF token
   * @param {string} token
   * @param {string} cookieToken
   * @returns {boolean}
   */
  validateToken(token, cookieToken) {
    if (!token || !cookieToken) {
      return false;
    }
    if (token !== cookieToken) {
      return false;
    }
    const tokenData = this.tokenMap.get(token);
    if (!tokenData) {
      return false;
    }
    if (tokenData.expiresAt < new Date()) {
      this.tokenMap.delete(token);
      return false;
    }
    return true;
  }
  cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, data] of this.tokenMap.entries()) {
      if (data.expiresAt < now) {
        this.tokenMap.delete(token);
      }
    }
  }
  generateTokenMiddleware() {
    return (req, res, next) => {
      if (req.path.startsWith('/api/') && req.method === 'GET') {
        const { token, expiresAt } = this.generateToken();
        res.cookie('csrf_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000
        });
        res.locals.csrfToken = token;
      }
      next();
    };
}
  validateTokenMiddleware() {
    return (req, res, next) => {
      if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
      }
      
      if (req.headers.upgrade === 'websocket') {
        return next();
      }
      
      const token = req.headers['x-csrf-token'] || req.body._csrf;
      const cookieToken = req.cookies.csrf_token;
      
      if (!this.validateToken(token, cookieToken)) {
        return res.status(403).json({
          success: false,
          message: 'Invalid CSRF token'
        });
      }
      next();
    };
  }
  getTokenHandler() {
    return (req, res) => {
      const { token, expiresAt } = this.generateToken();
      
      // Set HTTP-only cookie
      res.cookie('csrf_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000
      });
      
      res.json({
        success: true,
        token,
        expiresAt: expiresAt.toISOString()
      });
    };
  }
}

module.exports = new CSRFMiddleware();