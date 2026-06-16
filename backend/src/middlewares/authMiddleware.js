import jwt from 'jsonwebtoken';

export const verifyOwner = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired session token." });
      }

      if (decoded.role !== 'owner') {
        return res.status(403).json({ error: "Forbidden. Access is restricted to Owner only." });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
