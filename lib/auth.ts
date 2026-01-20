// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string) {
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return null;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export function createToken(payload: object) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined. Cannot create token.');
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function login(formData: FormData) {
    // For demonstration, assuming a user is verified and a token is created
    const user = { id: '1', name: 'Admin' }; // Example user
    const token = createToken(user);

    const cookieStore = await cookies();
    cookieStore.set('session', token, { httpOnly: true, path: '/' });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
