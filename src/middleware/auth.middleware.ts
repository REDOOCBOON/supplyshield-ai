import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SECRET_KEY = 'supplyshield-super-secret-key-hackathon-2026';

export interface UserPayload {
  username: string;
  company: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Generate JWT token manually using crypto
export const signToken = (payload: UserPayload): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${payloadB64}`)
    .digest('base64url');
    
  return `${header}.${payloadB64}.${signature}`;
};

// Verify JWT token manually
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payloadB64, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${payloadB64}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const decodedPayload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    return JSON.parse(decodedPayload) as UserPayload;
  } catch (err) {
    return null;
  }
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required. Please authenticate.' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token. Authentication failed.' });
  }
  
  req.user = decoded;
  next();
};
