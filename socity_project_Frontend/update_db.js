const fs = require('fs');
const path = require('path');

const now = new Date();
const yesterday = new Date(now.getTime() - 86400000);
const lastWeek = new Date(now.getTime() - 86400000 * 7);

const newDb = {
  users: [
    { id: '1', email: 'admin@society.com', password: 'admin123', role: 'admin', name: 'Vikram Malhotra', phone: '+91 98765 00010', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop', society: { id: 1, name: 'Sharlow Bay Community', isPaid: true } },
    { id: '2', email: 'resident@society.com', password: 'resident123', role: 'resident', name: 'Rajesh Kumar', phone: '+91 98765 43210', unit: 'A-205', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop', society: { id: 1, name: 'Sharlow Bay Community', isPaid: true } },
    { id: '3', email: 'guard@society.com', password: 'guard123', role: 'guard', name: 'Ram Singh', phone: '+91 77777 77777', shift: 'Day', status: 'active', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop', society: { id: 1, name: 'Sharlow Bay Community', isPaid: true } },
    { id: '4', email: 'superadmin@society.com', password: 'super123', role: 'super_admin', name: 'Super Admin User', phone: '+91 99999 00000', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop' },
    { id: '5', email: 'vendor@society.com', password: 'vendor123', role: 'vendor', name: 'Mega Power Vendor', phone: '+91 99999 11111', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop', company: 'Mega Power Solutions' },
    { id: '6', email: 'individual@example.com', password: 'user123', role: 'individual', name: 'Individual User', phone: '+91 98765 11111', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' }
  ],
  
  // 1. SUPER ADMIN DATA
  societies: [
    { id: 1, name: 'Sharlow Bay Community', code: 'SBC01', address: 'Sector 5, Sharlow Bay', isPaid: true, expectedUnits: 150, subscriptionPlan: 'premium', status: 'active', createdAt: lastWeek.toISOString() },
    { id: 2, name: 'Green Valley Apartments', code: 'GVA02', address: 'Plot 4, Green Valley', isPaid: true, expectedUnits: 300, subscriptionPlan: 'enterprise', status: 'active', createdAt: yesterday.toISOString() },
    { id: 3, name: 'Sunrise Towers', code: 'SNT03', address: 'Main Road, Sunrise Area', isPaid: false, expectedUnits: 50, subscriptionPlan: 'basic', status: 'pending', createdAt: now.toISOString() }
  ],
  pendingSocieties: [
    { id: 101, name: 'Lakeview Enclave', applicant: 'John Doe', contact: '+91 9123456789', status: 'Under Review', appliedAt: yesterday.toISOString() },
    { id: 102, name: 'Hilltop Residences', applicant: 'Jane Smith', contact: '+91 9876543210', status: 'Document Pending', appliedAt: lastWeek.toISOString() }
  ],
  platformServices: [
    { id: 'srv1', name: 'Premium Cloud Hosting', provider: 'AWS', cost: 15000, status: 'Active', billingCycle: 'Monthly' },
    { id: 'srv2', name: 'SMS Gateway PRO', provider: 'Twilio', cost: 5000, status: 'Active', billingCycle: 'Monthly' }
  ],
  platformComplaints: [
    { id: 'PC-01', societyName: 'Sharlow Bay', issue: 'Payment Gateway Timeout', status: 'Open', priority: 'High', date: now.toISOString() },
    { id: 'PC-02', societyName: 'Green Valley', issue: 'App Crash on iOS', status: 'Resolved', priority: 'Critical', date: yesterday.toISOString() }
  ],
  subscriptions: [
    { id: 'SUB-1', societyId: 1, plan: 'Premium Plan', amount: 15000, status: 'Active', nextBilling: new Date(now.getTime() + 86400000 * 30).toISOString() },
    { id: 'SUB-2', societyId: 2, plan: 'Enterprise Plan', amount: 25000, status: 'Active', nextBilling: new Date(now.getTime() + 86400000 * 15).toISOString() },
    { id: 'SUB-3', societyId: 3, plan: 'Basic Plan', amount: 5000, status: 'Overdue', nextBilling: yesterday.toISOString() }
  ],
  revenueReports: [
    { id: 'REV-01', month: 'June', year: '2026', totalRevenue: 150000, platformFees: 15000, tax: 27000 },
    { id: 'REV-02', month: 'May', year: '2026', totalRevenue: 140000, platformFees: 14000, tax: 25200 }
  ],
  advertisements: [
    { id: 'AD-1', client: 'Urban Company', title: 'Summer Cleaning', bannerUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', status: 'Active', impressions: 15000, clicks: 1200 },
    { id: 'AD-2', client: 'JioFiber', title: 'Gigabit Internet Offer', bannerUrl: 'https://images.unsplash.com/photo-1620912189868-30778f90ebac', status: 'Paused', impressions: 8000, clicks: 450 }
  ],
  propertyLeads: [
    { id: 'L-01', propertyId: 'P-101', interestedParty: 'Rahul Verma', phone: '+91 9999988888', type: 'Buy', status: 'Contacted', date: yesterday.toISOString() },
    { id: 'L-02', propertyId: 'P-102', interestedParty: 'Sneha Kapoor', phone: '+91 8888877777', type: 'Rent', status: 'New', date: now.toISOString() }
  ],
  rentalAgreements: [
    { id: 'RA-01', unit: 'A-101', tenantName: 'Anil Desai', ownerName: 'Vikram Malhotra', startDate: '2025-01-01', endDate: '2026-01-01', rentAmount: 25000, status: 'Active' },
    { id: 'RA-02', unit: 'B-205', tenantName: 'Priya Singh', ownerName: 'Rahul Bajaj', startDate: '2025-06-01', endDate: '2026-05-31', rentAmount: 30000, status: 'Expiring Soon' }
  ],
  vendors: [
    { id: 'v1', name: 'Mega Power Solutions', category: 'Electrical', contact: '+91 9999911111', status: 'active', rating: 4.8 },
    { id: 'v2', name: 'AquaFlow Services', category: 'Plumbing', contact: '+91 9999922222', status: 'active', rating: 4.5 },
    { id: 'v3', name: 'Sparkle Cleaners', category: 'Cleaning', contact: '+91 9999933333', status: 'inactive', rating: 3.9 }
  ],
  vendorLeads: [
    { id: 'VL-01', vendorId: 'v1', serviceRequested: 'Panel Repair', clientName: 'Sharlow Bay Comm', status: 'Accepted', date: yesterday.toISOString() },
    { id: 'VL-02', vendorId: 'v2', serviceRequested: 'Pipe Leakage', clientName: 'Green Valley Apt', status: 'Pending', date: now.toISOString() }
  ],
  emergencyAlerts: [
    { id: 'EA-1', type: 'Medical', location: 'Unit A-205', reportedBy: 'Rajesh Kumar', status: 'Resolved', time: lastWeek.toISOString() },
    { id: 'EA-2', type: 'Fire', location: 'Basement Parking', reportedBy: 'Ram Singh (Guard)', status: 'Active', time: now.toISOString() }
  ],
  emergencyScanLogs: [
    { id: 'ES-1', barcode: 'EB-1', scannedBy: 'Ram Singh', timestamp: yesterday.toISOString(), location: 'Main Gate' },
    { id: 'ES-2', barcode: 'EB-2', scannedBy: 'Lata Bai', timestamp: now.toISOString(), location: 'Lobby A' }
  ],

  // 2. SOCIETY ADMIN DATA
  invoices: [
    { id: 'INV-101', invoiceNumber: 'INV-101', recipientName: 'Rajesh Kumar', unit: 'A-205', amount: 5000, dueDate: new Date(now.getTime() + 86400000 * 5).toISOString(), status: 'PENDING', category: 'Maintenance' },
    { id: 'INV-102', invoiceNumber: 'INV-102', recipientName: 'Sneha Kumar', unit: 'B-101', amount: 1500, dueDate: yesterday.toISOString(), status: 'OVERDUE', category: 'Water Charges' },
    { id: 'INV-103', invoiceNumber: 'INV-103', recipientName: 'Amit Sharma', unit: 'C-305', amount: 4500, dueDate: lastWeek.toISOString(), status: 'PAID', category: 'Maintenance' }
  ],
  payments: [
    { id: 'PAY-1', invoiceId: 'INV-103', amount: 4500, method: 'UPI', date: lastWeek.toISOString(), status: 'Success' },
    { id: 'PAY-2', invoiceId: 'INV-102', amount: 1500, method: 'Credit Card', date: now.toISOString(), status: 'Failed' }
  ],
  wallets: [
    { id: 'W-1', userId: '2', userName: 'Rajesh Kumar', balance: 2500, currency: 'INR', lastUpdated: now.toISOString() },
    { id: 'W-2', userId: '1', userName: 'Vikram Malhotra', balance: 15000, currency: 'INR', lastUpdated: yesterday.toISOString() }
  ],
  walletTransactions: [
    { id: 'WT-1', walletId: 'W-1', type: 'Credit', amount: 3000, description: 'Added via UPI', date: yesterday.toISOString() },
    { id: 'WT-2', walletId: 'W-1', type: 'Debit', amount: 500, description: 'Clubhouse booking', date: now.toISOString() }
  ],
  ledger: [
    { id: 'L-1', date: lastWeek.toISOString(), account: 'Maintenance Fund', debit: 0, credit: 50000, description: 'Collection' },
    { id: 'L-2', date: yesterday.toISOString(), account: 'Security Salary', debit: 15000, credit: 0, description: 'May Salary Paid' }
  ],
  trialBalance: [
    { id: 'TB-1', account: 'Cash at Bank', debit: 350000, credit: 0 },
    { id: 'TB-2', account: 'Maintenance Receivable', debit: 45000, credit: 0 },
    { id: 'TB-3', account: 'Capital Fund', debit: 0, credit: 395000 }
  ],
  journal: [
    { id: 'J-1', date: yesterday.toISOString(), accountDebited: 'Salary Expense', accountCredited: 'Bank', amount: 15000 },
    { id: 'J-2', date: now.toISOString(), accountDebited: 'Bank', accountCredited: 'Maintenance Income', amount: 5000 }
  ],
  bank: [
    { id: 'B-1', date: yesterday.toISOString(), description: 'IMPS Transfer to Guard', type: 'Withdrawal', amount: 15000 },
    { id: 'B-2', date: now.toISOString(), description: 'NEFT from Rajesh Kumar', type: 'Deposit', amount: 5000 }
  ],
  purchaseRequests: [
    { id: 'PR-1', item: 'LED Bulbs', quantity: 50, estimatedCost: 5000, requestedBy: 'Admin', status: 'Approved', date: lastWeek.toISOString() },
    { id: 'PR-2', item: 'Lawn Mower', quantity: 1, estimatedCost: 12000, requestedBy: 'Gardener', status: 'Pending', date: now.toISOString() }
  ],
  purchaseOrders: [
    { id: 'PO-1', requestId: 'PR-1', vendorName: 'Electricals Hub', totalAmount: 4800, status: 'Placed', date: yesterday.toISOString() },
    { id: 'PO-2', requestId: 'PR-2', vendorName: 'Garden Tools Inc', totalAmount: 11500, status: 'Draft', date: now.toISOString() }
  ],
  purchaseReceipts: [
    { id: 'GR-1', orderId: 'PO-1', receivedDate: now.toISOString(), condition: 'Good', receivedBy: 'Ram Singh' }
  ],
  visitors: [
    { id: 'V-1', name: 'Zomato Guy', purpose: 'Delivery', unit: 'A-205', entryTime: yesterday.toISOString(), exitTime: yesterday.toISOString(), status: 'CHECKED_OUT' },
    { id: 'V-2', name: 'Suresh Uncle', purpose: 'Guest', unit: 'B-101', entryTime: now.toISOString(), status: 'CHECKED_IN' },
    { id: 'V-3', name: 'Amazon Delivery', purpose: 'Delivery', unit: 'C-305', entryTime: lastWeek.toISOString(), exitTime: lastWeek.toISOString(), status: 'CHECKED_OUT' }
  ],
  vehicles: [
    { id: 'VH-1', plateNumber: 'MH-12-AB-1234', ownerName: 'Rajesh Kumar', type: 'Car', status: 'Approved' },
    { id: 'VH-2', plateNumber: 'MH-14-XY-9999', ownerName: 'Sneha Kumar', type: 'Bike', status: 'Approved' },
    { id: 'VH-3', plateNumber: 'DL-01-ZZ-0000', ownerName: 'Visitor', type: 'Car', status: 'Temporary' }
  ],
  parcels: [
    { id: 'P-1', recipientName: 'Rajesh Kumar', unit: 'A-205', courier: 'Amazon', status: 'Pending', arrivalTime: now.toISOString() },
    { id: 'P-2', recipientName: 'Amit Sharma', unit: 'C-305', courier: 'BlueDart', status: 'Delivered', arrivalTime: yesterday.toISOString() }
  ],
  gateQRs: [
    { id: 'QR-1', residentName: 'Rajesh Kumar', validUntil: new Date(now.getTime() + 86400000).toISOString(), status: 'Active' },
    { id: 'QR-2', residentName: 'Guest of B-101', validUntil: yesterday.toISOString(), status: 'Expired' }
  ],
  incidents: [
    { id: 'INC-1', title: 'Lift Stuck in Tower A', severity: 'High', reportedBy: 'Ram Singh', date: yesterday.toISOString(), status: 'Resolved' },
    { id: 'INC-2', title: 'Water Pipe Burst in Basement', severity: 'Critical', reportedBy: 'Admin', date: now.toISOString(), status: 'In Progress' }
  ],
  parkingSlots: [
    { id: 'PS-1', slotNumber: 'B1-01', allocatedTo: 'A-205', type: 'Car', status: 'Occupied' },
    { id: 'PS-2', slotNumber: 'B1-02', allocatedTo: 'B-101', type: 'Bike', status: 'Occupied' },
    { id: 'PS-3', slotNumber: 'B1-03', allocatedTo: null, type: 'Car', status: 'Available' }
  ],
  parkingPayments: [
    { id: 'PP-1', slotId: 'PS-1', amount: 1500, month: 'June', status: 'Paid', date: lastWeek.toISOString() },
    { id: 'PP-2', slotId: 'PS-2', amount: 500, month: 'June', status: 'Pending', date: null }
  ],
  staff: [
    { id: 1, name: 'Ram Singh', role: 'GUARD', shift: 'Day', phone: '+91 7777777777', status: 'ACTIVE', attendanceStatus: 'PRESENT' },
    { id: 2, name: 'Lata Bai', role: 'MAID', shift: 'Morning', phone: '+91 8888811111', status: 'ACTIVE', attendanceStatus: 'PRESENT' },
    { id: 3, name: 'Shyam Lal', role: 'GUARD', shift: 'Night', phone: '+91 7777788888', status: 'ACTIVE', attendanceStatus: 'ABSENT' }
  ],
  tenants: [
    { id: 'T-1', name: 'John Doe', unit: 'B-101', ownerName: 'Jane Smith', leaseEnd: '2026-12-31', status: 'Active' },
    { id: 'T-2', name: 'Alice Bob', unit: 'C-305', ownerName: 'Amit Sharma', leaseEnd: '2025-05-31', status: 'Expired' }
  ],
  complaints: [
    { id: 'CMP-1', title: 'Lobby Light not working', category: 'Electrical', priority: 'Low', status: 'Open', reportedBy: 'Rajesh Kumar' },
    { id: 'CMP-2', title: 'Gym AC dripping water', category: 'HVAC', priority: 'Medium', status: 'In Progress', reportedBy: 'Sneha Kumar' },
    { id: 'CMP-3', title: 'Garbage not collected', category: 'Housekeeping', priority: 'High', status: 'Resolved', reportedBy: 'Amit Sharma' }
  ],
  assets: [
    { id: 'AST-1', name: 'Water Pump 1', category: 'Plumbing', location: 'Basement', status: 'Working', lastServiced: lastWeek.toISOString() },
    { id: 'AST-2', name: 'Treadmill', category: 'Gym', location: 'Clubhouse', status: 'Needs Repair', lastServiced: new Date(now.getTime() - 86400000 * 60).toISOString() }
  ],
  defaulters: [
    { id: 'DEF-1', name: 'Sneha Kumar', unit: 'B-101', outstandingAmount: 4500, daysOverdue: 15 },
    { id: 'DEF-2', name: 'Rahul Verma', unit: 'D-404', outstandingAmount: 12000, daysOverdue: 45 }
  ],
  meetings: [
    { id: 'M-1', title: 'Annual General Meeting', date: new Date(now.getTime() + 86400000 * 5).toISOString(), agenda: 'Budget planning', status: 'Scheduled' },
    { id: 'M-2', title: 'Security Review', date: yesterday.toISOString(), agenda: 'Review new CCTV placement', status: 'Completed' }
  ],
  units: [
    { id: 'U-1', unitNumber: 'A-205', block: 'A', floor: 2, type: '3BHK', owner: 'Rajesh Kumar', status: 'Occupied' },
    { id: 'U-2', unitNumber: 'B-101', block: 'B', floor: 1, type: '2BHK', owner: 'Jane Smith', tenant: 'John Doe', status: 'Rented' },
    { id: 'U-3', unitNumber: 'C-305', block: 'C', floor: 3, type: '4BHK', owner: 'Amit Sharma', status: 'Occupied' }
  ],
  moveInOut: [
    { id: 'MIO-1', residentName: 'John Doe', type: 'Move In', unit: 'B-101', date: lastWeek.toISOString(), status: 'Completed' },
    { id: 'MIO-2', residentName: 'Alice Bob', type: 'Move Out', unit: 'C-305', date: new Date(now.getTime() + 86400000 * 2).toISOString(), status: 'Approved' }
  ],
  unitData: {
    id: 'unit-101', block: 'Tower A', number: '205', unitNumber: 'A-205', floor: '2nd Floor', type: '3 BHK', area: '1600 sq.ft', status: 'Occupied',
    familyMembers: [
      { id: 1, name: 'Sneha Kumar', relation: 'Spouse', phone: '+91 98765 43211', age: 34 },
      { id: 2, name: 'Aarav Kumar', relation: 'Son', age: 8 }
    ],
    vehicles: [
      { id: 1, brand: 'Toyota', model: 'Fortuner', plateNumber: 'MH-12-AB-1234', type: 'Car' },
      { id: 2, brand: 'Honda', model: 'Activa', plateNumber: 'MH-12-XX-5678', type: 'Two-Wheeler' }
    ],
    pets: [
      { id: 1, name: 'Rocky', breed: 'German Shepherd', type: 'Dog' },
      { id: 2, name: 'Milo', breed: 'Persian', type: 'Cat' }
    ]
  },

  // 3. RESIDENT DATA
  communityPosts: [
    { id: 1, author: 'Rajesh Kumar', title: 'Lost Keys in Garden', content: 'Has anyone seen a set of keys near the swing?', type: 'Query', likes: 2, date: yesterday.toISOString() },
    { id: 2, author: 'Admin', title: 'Yoga Classes Starting', content: 'Free yoga classes in clubhouse from Monday.', type: 'Announcement', likes: 15, date: lastWeek.toISOString() }
  ],
  marketItems: [
    { id: 1, title: 'IKEA Dining Table', price: 5000, condition: 'Good', seller: 'Sneha Kumar', date: yesterday.toISOString() },
    { id: 2, title: 'Kids Bicycle', price: 1500, condition: 'Like New', seller: 'Amit Sharma', date: now.toISOString() }
  ],
  amenities: [
    { id: 1, name: 'Tennis Court', status: 'Available', timing: '06:00 - 22:00', price: 200 },
    { id: 2, name: 'Swimming Pool', status: 'Maintenance', timing: '06:00 - 20:00', price: 0 },
    { id: 3, name: 'Clubhouse Hall', status: 'Available', timing: '09:00 - 23:00', price: 1500 }
  ],
  bookings: [
    { id: 1, amenity: 'Tennis Court', resident: 'Rajesh Kumar', date: now.toISOString(), slot: '18:00 - 19:00', status: 'Confirmed' },
    { id: 2, amenity: 'Clubhouse Hall', resident: 'Amit Sharma', date: new Date(now.getTime() + 86400000 * 2).toISOString(), slot: 'Evening', status: 'Pending' }
  ],
  services: [
    { id: 's1', name: 'Plumbing Repair', provider: 'AquaFlow', rating: 4.5, price: '₹500/visit' },
    { id: 's2', name: 'AC Servicing', provider: 'CoolBreeze', rating: 4.8, price: '₹800/split AC' },
    { id: 's3', name: 'Deep Cleaning', provider: 'Sparkle Cleaners', rating: 3.9, price: '₹2500/3BHK' }
  ],
  serviceCategories: [
    { id: 'c1', name: 'Plumbing', icon: 'Wrench' },
    { id: 'c2', name: 'Electrical', icon: 'Zap' },
    { id: 'c3', name: 'Cleaning', icon: 'Sparkles' }
  ],

  // 4. GUARD / SECURITY STAFF DATA
  guardLogs: [
    { id: 'GL-1', guardName: 'Ram Singh', action: 'Patrol Completed - Block A', time: yesterday.toISOString() },
    { id: 'GL-2', guardName: 'Shyam Lal', action: 'Shift Handover', time: now.toISOString() },
    { id: 'GL-3', guardName: 'Ram Singh', action: 'Suspicious vehicle reported', time: lastWeek.toISOString() }
  ],

  // 5. VENDOR & INDIVIDUAL DATA
  vendorEarnings: [
    { id: 'VE-1', month: 'June', totalEarned: 15000, platformFee: 1500, netPayout: 13500 },
    { id: 'VE-2', month: 'May', totalEarned: 22000, platformFee: 2200, netPayout: 19800 }
  ],
  vendorOrders: [
    { id: 'VO-1', service: 'Fix Leaking Pipe', client: 'Rajesh Kumar', amount: 500, status: 'Completed', date: yesterday.toISOString() },
    { id: 'VO-2', service: 'Fan Installation', client: 'Amit Sharma', amount: 800, status: 'Scheduled', date: new Date(now.getTime() + 86400000).toISOString() }
  ],
  tickets: [],
  notices: [],
  events: [],
  societyDuesReceipts: [],
  guidelines: []
};

// Ensure all categories have at least 2 items if they are empty above
for (const key in newDb) {
  if (Array.isArray(newDb[key]) && newDb[key].length < 2) {
    newDb[key] = [
      { id: 'dummy-1', name: 'Dummy Data 1 for ' + key, description: 'Realistic mock placeholder', date: now.toISOString(), status: 'Active' },
      { id: 'dummy-2', name: 'Dummy Data 2 for ' + key, description: 'Realistic mock placeholder', date: yesterday.toISOString(), status: 'Pending' }
    ];
  }
}

const apiPath = path.join(__dirname, 'src', 'lib', 'api.ts');
let content = fs.readFileSync(apiPath, 'utf8');

// The DEFAULT_DB starts at `const DEFAULT_DB = {` and ends before `// ----------------------------------------------------`
// We will find the boundaries using regex or string splitting.
const startMarker = 'const DEFAULT_DB = {';
const endMarker = 'let memoryDB: any = null;';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find boundaries for DEFAULT_DB in api.ts");
  process.exit(1);
}

// Find the line with `// ----------------------------------------------------` right before memoryDB
const separatorIndex = content.lastIndexOf('// ----------------------------------------------------', endIndex);

const before = content.substring(0, startIndex);
const after = content.substring(separatorIndex);

const newContent = before + 'const DEFAULT_DB = ' + JSON.stringify(newDb, null, 2) + ';\n\n' + after;

// Let's also update the version of local storage key to force reset
const updatedContent = newContent.replace(/gatesecurity_mock_db/g, 'gatesecurity_mock_db_v2');

fs.writeFileSync(apiPath, updatedContent, 'utf8');
console.log('Successfully updated api.ts with realistic mock data!');
