# Migration to Supabase - Step by Step Guide

## Current Status
✅ Supabase tables created
✅ Service layer created (menuService, eventService, authService)
✅ AuthContext updated to use Supabase

## Next Steps

### 1. Add Environment Variables
Add to your `.env` file:
```
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Migrate Existing Data (Optional)
If you have existing data in localStorage, you can migrate it:
1. Open browser console (F12)
2. Run: `window.migrateToSupabase()`

### 4. Update Pages to Use Supabase
The following pages need to be updated:
- ✅ AuthContext (already done)
- ⏳ Manage page (in progress)
- ⏳ Menu page
- ⏳ Events page

## Important Notes

1. **Numbering System**: The menu item numbering logic is complex. When migrating to Supabase, we need to:
   - Fetch all items for a category
   - Sort by price
   - Renumber sequentially
   - Update all items in Supabase

2. **Static vs Dynamic Items**: In Supabase, all items are stored the same way. The distinction between "static" and "dynamic" is no longer needed.

3. **Real-time Updates**: Once migrated, changes will appear instantly across all devices since data is stored in Supabase.

## Testing Checklist

After migration:
- [ ] Login works with admin credentials
- [ ] Can add new menu item
- [ ] Can edit existing menu item
- [ ] Can delete menu item
- [ ] Menu items appear on menu page
- [ ] Can add new event
- [ ] Can edit existing event
- [ ] Can delete event
- [ ] Events appear on events page
- [ ] Data persists after page refresh
- [ ] Data appears on different device/browser
