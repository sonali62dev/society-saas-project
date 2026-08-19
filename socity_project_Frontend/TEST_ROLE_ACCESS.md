# Testing Role-Based Access Control

## Test Scenarios

### 1. Admin User Tests

**Login as Admin**
```
Email: admin@society.com
Password: admin123
Role: admin
```

**Should Have Access To:**
- ✅ Dashboard (admin view with financial data)
- ✅ Financial (Billing, Invoices, Payments)
- ✅ Security (Visitors, Vehicles, Parcels)
- ✅ Residents (Directory, Amenities, Events, Notices)
- ✅ Administration (Complaints, Assets, Vendors)
- ✅ Settings

**Expected Behavior:**
- Sees ALL residents' data
- Can manage and resolve all complaints
- Can add/edit amenities
- Can assign complaints to teams
- Sees system-wide statistics

### 2. Resident User Tests

**Login as Resident**
```
Email: resident@society.com
Password: resident123
Role: resident
Unit: A-205
```

**Should Have Access To:**
- ✅ Dashboard (resident view with personal data)
- ✅ My Unit (personal unit info)
- ✅ Community (Amenities, Events, Notices)
- ✅ Settings

**Should NOT Have Access To:**
- ❌ Financial pages (redirected with "Access Denied")
- ❌ Security management
- ❌ Residents Directory
- ❌ Administration

**Expected Behavior:**
- Sees ONLY their own data
- Can view/raise their own complaints
- Can book amenities
- Can view events and notices
- Cannot see other residents' information
- Cannot resolve complaints

### 3. Security Guard User Tests

**Login as Security Guard**
```
Email: guard@society.com
Password: guard123
Role: guard
```

**Should Have Access To:**
- ✅ Dashboard (security view with visitor stats)
- ✅ Security (Visitors, Vehicles, Parcels)
- ✅ Settings

**Should NOT Have Access To:**
- ❌ Financial pages
- ❌ Residents Directory
- ❌ Administration
- ❌ Community features

**Expected Behavior:**
- Can check-in/out visitors
- Can approve/reject vehicles
- Can register parcels
- Sees emergency contacts
- Cannot access financial or resident personal data

## Manual Testing Checklist

### Dashboard Tests
- [ ] Admin sees financial charts and system stats
- [ ] Resident sees personal unit info and payment due
- [ ] Security guard sees visitor and vehicle approvals

### Navigation Tests
- [ ] Admin sidebar shows all menu items
- [ ] Resident sidebar shows only Community (no Directory)
- [ ] Security guard sidebar shows only Security items
- [ ] Sidebar header shows correct role label

### Page Access Tests
- [ ] Try accessing `/dashboard/financial/billing` as resident → Should show "Access Denied"
- [ ] Try accessing `/dashboard/residents/directory` as resident → Should show "Access Denied"
- [ ] Try accessing `/dashboard/security/visitors` as resident → Should show "Access Denied"
- [ ] Admin can access all pages

### Data Filtering Tests
- [ ] Resident complaint page shows only their complaints
- [ ] Admin complaint page shows all complaints with "Assigned To" column
- [ ] Resident sees only "View" button, Admin sees "Resolve" button

### Button/Action Tests
- [ ] Admin can see "Add Amenity" button on amenities page
- [ ] Resident cannot see admin-only buttons
- [ ] Security guard can see "Check In" / "Check Out" buttons for visitors

## Automated Testing Commands

```bash
# Run the app
cd /root/society-management
npm run dev

# Test different roles by updating the mock auth store
# Edit src/lib/stores/auth-store.ts and set default user
```

## Expected Error Handling

### Unauthorized Access
When a user tries to access a page they don't have permission for:
1. Page displays "Access Denied" card
2. Shows clear message about required role
3. Provides button to return to dashboard
4. Does NOT redirect to login (if already authenticated)

### Missing Role
If user somehow has no role:
- Defaults to resident dashboard
- Can only access public/resident pages

## Security Notes

✅ **Implemented:**
- Route-level protection with RoleGuard component
- Role-based navigation filtering
- Data filtering by user role
- UI element hiding based on permissions

⚠️ **Still Needed (Backend):**
- API endpoint protection
- Database-level access control
- Role validation on server
- Audit logging of access attempts

