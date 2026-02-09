# Admin Configuration Guide

## How to Set Up an Admin User

### Option 1: Create Admin User via Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL to create an admin user:

```sql
-- Create an admin user (replace with your email and password)
-- The password will be hashed automatically by the app
INSERT INTO app_users (email, name, password_hash, is_admin)
VALUES (
  'admin@capitolo-rosso.de',  -- Your admin email
  'Administrator',            -- Admin name
  'YOUR_PASSWORD_HASH_HERE',  -- See below for how to generate hash
  true                        -- Set as admin
);
```

### Option 2: Update Existing User to Admin

If you already have a user account, you can make them an admin:

```sql
-- Make an existing user an admin (replace email with your user's email)
UPDATE app_users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Option 3: Generate Password Hash

To create a password hash, you can use this JavaScript code in your browser console:

```javascript
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Example: Generate hash for password "admin123"
hashPassword('admin123').then(hash => console.log('Hash:', hash));
```

Or use this SQL function in Supabase:

```sql
-- Create a function to hash passwords (run this once)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
  SELECT encode(digest(password, 'sha256'), 'hex');
$$ LANGUAGE SQL;
```

Then use it:

```sql
-- Create admin user with hashed password
INSERT INTO app_users (email, name, password_hash, is_admin)
VALUES (
  'admin@capitolo-rosso.de',
  'Administrator',
  hash_password('your-password-here'),
  true
);
```

## Check Admin Users

To see all admin users:

```sql
SELECT id, email, name, is_admin, created_at
FROM app_users
WHERE is_admin = true;
```

## Verify User is Admin

To check if a specific user is admin:

```sql
SELECT email, name, is_admin
FROM app_users
WHERE email = 'your-email@example.com';
```

## Reset Admin Password

To reset an admin password:

```sql
-- Update password hash for an admin user
UPDATE app_users
SET password_hash = hash_password('new-password-here')
WHERE email = 'admin@capitolo-rosso.de' AND is_admin = true;
```

## Quick Setup Steps

1. **Register a user** through the login page (or create via SQL)
2. **Run this SQL** in Supabase SQL Editor:
   ```sql
   UPDATE app_users
   SET is_admin = true
   WHERE email = 'your-registered-email@example.com';
   ```
3. **Login** with that email and password
4. You'll now have admin access!

## Admin Features

Once logged in as admin, you can:
- Access `/manage` page to manage menu items and events
- See "Our Team" section on About page
- Edit/Delete menu items and events
- See admin-only UI elements

## Security Notes

- Admin status is stored in the `is_admin` boolean field in `app_users` table
- Passwords are hashed using SHA-256
- Only users with `is_admin = true` can access admin features
- The login page automatically logs out non-admin users
