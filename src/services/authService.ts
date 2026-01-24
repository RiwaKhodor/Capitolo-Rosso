import { supabase, User } from '../lib/supabase';

// Simple password hashing (for production, use proper bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  // Simple hash for now - in production use bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

export const authService = {
  // Login with email and password
  async login(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user:', error);
      return null;
    }

    // Verify password
    if (data.password_hash) {
      const isValid = await verifyPassword(password, data.password_hash);
      if (!isValid) {
        return null;
      }
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      is_admin: data.is_admin,
    };
  },

  // Register new user
  async register(email: string, password: string, name: string): Promise<User | null> {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return null; // User already exists
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data, error } = await supabase
      .from('app_users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        is_admin: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      is_admin: data.is_admin,
    };
  },

  // Login with Google
  async loginWithGoogle(credential: string): Promise<User | null> {
    try {
      // Decode JWT token
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      // Check if user exists
      let { data: user } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      // Create user if doesn't exist
      if (!user) {
        const { data: newUser, error } = await supabase
          .from('app_users')
          .insert({
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split('@')[0],
            google_id: googleUser.sub,
            is_admin: false,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating Google user:', error);
          return null;
        }
        user = newUser;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      };
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      is_admin: data.is_admin,
    };
  },
};
