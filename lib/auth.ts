// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export function createToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    return verifyToken(token);
}
