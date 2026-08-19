import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// ----------------------------------------------------
// DEFAULT MOCK DATABASE STATE (Enriched & Realistic)
// ----------------------------------------------------
const DEFAULT_DB = {
  "users": [
    {
      "id": "1",
      "email": "admin@society.com",
      "password": "admin123",
      "role": "admin",
      "name": "Vikram Malhotra",
      "phone": "+91 98765 00010",
      "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop",
      "society": {
        "id": 1,
        "name": "Sharlow Bay Community",
        "isPaid": true
      }
    },
    {
      "id": "2",
      "email": "resident@society.com",
      "password": "resident123",
      "role": "resident",
      "name": "Rajesh Kumar",
      "phone": "+91 98765 43210",
      "unit": "A-205",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      "society": {
        "id": 1,
        "name": "Sharlow Bay Community",
        "isPaid": true
      }
    },
    {
      "id": "3",
      "email": "guard@society.com",
      "password": "guard123",
      "role": "guard",
      "name": "Ram Singh",
      "phone": "+91 77777 77777",
      "shift": "Day",
      "status": "active",
      "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&auto=format&fit=crop",
      "society": {
        "id": 1,
        "name": "Sharlow Bay Community",
        "isPaid": true
      }
    },
    {
      "id": "4",
      "email": "superadmin@society.com",
      "password": "super123",
      "role": "super_admin",
      "name": "Super Admin User",
      "phone": "+91 99999 00000",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop"
    },
    {
      "id": "5",
      "email": "vendor@society.com",
      "password": "vendor123",
      "role": "vendor",
      "name": "Mega Power Vendor",
      "phone": "+91 99999 11111",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      "company": "Mega Power Solutions"
    },
    {
      "id": "6",
      "email": "individual@example.com",
      "password": "user123",
      "role": "individual",
      "name": "Individual User",
      "phone": "+91 98765 11111",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
    }
  ],
  "societies": [
    {
      "id": 1,
      "name": "Sharlow Bay Community",
      "code": "SBC01",
      "address": "Sector 5, Sharlow Bay",
      "isPaid": true,
      "expectedUnits": 150,
      "subscriptionPlan": "premium",
      "status": "active",
      "createdAt": "2026-05-27T11:06:09.972Z"
    },
    {
      "id": 2,
      "name": "Green Valley Apartments",
      "code": "GVA02",
      "address": "Plot 4, Green Valley",
      "isPaid": true,
      "expectedUnits": 300,
      "subscriptionPlan": "enterprise",
      "status": "active",
      "createdAt": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": 3,
      "name": "Sunrise Towers",
      "code": "SNT03",
      "address": "Main Road, Sunrise Area",
      "isPaid": false,
      "expectedUnits": 50,
      "subscriptionPlan": "basic",
      "status": "pending",
      "createdAt": "2026-06-03T11:06:09.972Z"
    }
  ],
  "pendingSocieties": [
    {
      "id": 101,
      "name": "Lakeview Enclave",
      "applicant": "John Doe",
      "contact": "+91 9123456789",
      "status": "Under Review",
      "appliedAt": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": 102,
      "name": "Hilltop Residences",
      "applicant": "Jane Smith",
      "contact": "+91 9876543210",
      "status": "Document Pending",
      "appliedAt": "2026-05-27T11:06:09.972Z"
    }
  ],
  "platformServices": [
    {
      "id": "srv1",
      "name": "Premium Cloud Hosting",
      "provider": "AWS",
      "cost": 15000,
      "status": "Active",
      "billingCycle": "Monthly"
    },
    {
      "id": "srv2",
      "name": "SMS Gateway PRO",
      "provider": "Twilio",
      "cost": 5000,
      "status": "Active",
      "billingCycle": "Monthly"
    }
  ],
  "platformComplaints": [
    {
      "id": "PC-01",
      "societyName": "Sharlow Bay",
      "issue": "Payment Gateway Timeout",
      "status": "Open",
      "priority": "High",
      "date": "2026-06-03T11:06:09.972Z"
    },
    {
      "id": "PC-02",
      "societyName": "Green Valley",
      "issue": "App Crash on iOS",
      "status": "Resolved",
      "priority": "Critical",
      "date": "2026-06-02T11:06:09.972Z"
    }
  ],
  "subscriptions": [
    {
      "id": "SUB-1",
      "societyId": 1,
      "plan": "Premium Plan",
      "amount": 15000,
      "status": "Active",
      "nextBilling": "2026-07-03T11:06:09.972Z"
    },
    {
      "id": "SUB-2",
      "societyId": 2,
      "plan": "Enterprise Plan",
      "amount": 25000,
      "status": "Active",
      "nextBilling": "2026-06-18T11:06:09.972Z"
    },
    {
      "id": "SUB-3",
      "societyId": 3,
      "plan": "Basic Plan",
      "amount": 5000,
      "status": "Overdue",
      "nextBilling": "2026-06-02T11:06:09.972Z"
    }
  ],
  "revenueReports": [
    {
      "id": "REV-01",
      "month": "June",
      "year": "2026",
      "totalRevenue": 150000,
      "platformFees": 15000,
      "tax": 27000
    },
    {
      "id": "REV-02",
      "month": "May",
      "year": "2026",
      "totalRevenue": 140000,
      "platformFees": 14000,
      "tax": 25200
    }
  ],
  "advertisements": [
    {
      "id": "AD-1",
      "client": "Urban Company",
      "title": "Summer Cleaning",
      "bannerUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      "status": "Active",
      "impressions": 15000,
      "clicks": 1200
    },
    {
      "id": "AD-2",
      "client": "JioFiber",
      "title": "Gigabit Internet Offer",
      "bannerUrl": "https://images.unsplash.com/photo-1620912189868-30778f90ebac",
      "status": "Paused",
      "impressions": 8000,
      "clicks": 450
    }
  ],
  "propertyLeads": [
    {
      "id": "L-01",
      "propertyId": "P-101",
      "interestedParty": "Rahul Verma",
      "phone": "+91 9999988888",
      "type": "Buy",
      "status": "Contacted",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "L-02",
      "propertyId": "P-102",
      "interestedParty": "Sneha Kapoor",
      "phone": "+91 8888877777",
      "type": "Rent",
      "status": "New",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "rentalAgreements": [
    {
      "id": "RA-01",
      "unit": "A-101",
      "tenantName": "Anil Desai",
      "ownerName": "Vikram Malhotra",
      "startDate": "2025-01-01",
      "endDate": "2026-01-01",
      "rentAmount": 25000,
      "status": "Active"
    },
    {
      "id": "RA-02",
      "unit": "B-205",
      "tenantName": "Priya Singh",
      "ownerName": "Rahul Bajaj",
      "startDate": "2025-06-01",
      "endDate": "2026-05-31",
      "rentAmount": 30000,
      "status": "Expiring Soon"
    }
  ],
  "vendors": [
    {
      "id": "v1",
      "name": "Mega Power Solutions",
      "category": "Electrical",
      "contact": "+91 9999911111",
      "status": "active",
      "rating": 4.8
    },
    {
      "id": "v2",
      "name": "AquaFlow Services",
      "category": "Plumbing",
      "contact": "+91 9999922222",
      "status": "active",
      "rating": 4.5
    },
    {
      "id": "v3",
      "name": "Sparkle Cleaners",
      "category": "Cleaning",
      "contact": "+91 9999933333",
      "status": "inactive",
      "rating": 3.9
    }
  ],
  "vendorLeads": [
    {
      "id": "VL-01",
      "vendorId": "v1",
      "serviceRequested": "Panel Repair",
      "clientName": "Sharlow Bay Comm",
      "status": "Accepted",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "VL-02",
      "vendorId": "v2",
      "serviceRequested": "Pipe Leakage",
      "clientName": "Green Valley Apt",
      "status": "Pending",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "emergencyAlerts": [
    {
      "id": "EA-1",
      "type": "Medical",
      "location": "Unit A-205",
      "reportedBy": "Rajesh Kumar",
      "status": "Resolved",
      "time": "2026-05-27T11:06:09.972Z"
    },
    {
      "id": "EA-2",
      "type": "Fire",
      "location": "Basement Parking",
      "reportedBy": "Ram Singh (Guard)",
      "status": "Active",
      "time": "2026-06-03T11:06:09.972Z"
    }
  ],
  "emergencyScanLogs": [
    {
      "id": "ES-1",
      "barcode": "EB-1",
      "scannedBy": "Ram Singh",
      "timestamp": "2026-06-02T11:06:09.972Z",
      "location": "Main Gate"
    },
    {
      "id": "ES-2",
      "barcode": "EB-2",
      "scannedBy": "Lata Bai",
      "timestamp": "2026-06-03T11:06:09.972Z",
      "location": "Lobby A"
    }
  ],
  "invoices": [
    {
      "id": "INV-101",
      "invoiceNumber": "INV-101",
      "recipientName": "Rajesh Kumar",
      "unit": "A-205",
      "amount": 5000,
      "dueDate": "2026-06-08T11:06:09.972Z",
      "status": "PENDING",
      "category": "Maintenance"
    },
    {
      "id": "INV-102",
      "invoiceNumber": "INV-102",
      "recipientName": "Sneha Kumar",
      "unit": "B-101",
      "amount": 1500,
      "dueDate": "2026-06-02T11:06:09.972Z",
      "status": "OVERDUE",
      "category": "Water Charges"
    },
    {
      "id": "INV-103",
      "invoiceNumber": "INV-103",
      "recipientName": "Amit Sharma",
      "unit": "C-305",
      "amount": 4500,
      "dueDate": "2026-05-27T11:06:09.972Z",
      "status": "PAID",
      "category": "Maintenance"
    }
  ],
  "payments": [
    {
      "id": "PAY-1",
      "invoiceId": "INV-103",
      "amount": 4500,
      "method": "UPI",
      "date": "2026-05-27T11:06:09.972Z",
      "status": "Success"
    },
    {
      "id": "PAY-2",
      "invoiceId": "INV-102",
      "amount": 1500,
      "method": "Credit Card",
      "date": "2026-06-03T11:06:09.972Z",
      "status": "Failed"
    }
  ],
  "wallets": [
    {
      "id": "W-1",
      "userId": "2",
      "userName": "Rajesh Kumar",
      "balance": 2500,
      "currency": "INR",
      "lastUpdated": "2026-06-03T11:06:09.972Z"
    },
    {
      "id": "W-2",
      "userId": "1",
      "userName": "Vikram Malhotra",
      "balance": 15000,
      "currency": "INR",
      "lastUpdated": "2026-06-02T11:06:09.972Z"
    }
  ],
  "walletTransactions": [
    {
      "id": "WT-1",
      "walletId": "W-1",
      "type": "Credit",
      "amount": 3000,
      "description": "Added via UPI",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "WT-2",
      "walletId": "W-1",
      "type": "Debit",
      "amount": 500,
      "description": "Clubhouse booking",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "ledger": [
    {
      "id": "L-1",
      "date": "2026-05-27T11:06:09.972Z",
      "account": "Maintenance Fund",
      "debit": 0,
      "credit": 50000,
      "description": "Collection"
    },
    {
      "id": "L-2",
      "date": "2026-06-02T11:06:09.972Z",
      "account": "Security Salary",
      "debit": 15000,
      "credit": 0,
      "description": "May Salary Paid"
    }
  ],
  "trialBalance": [
    {
      "id": "TB-1",
      "account": "Cash at Bank",
      "debit": 350000,
      "credit": 0
    },
    {
      "id": "TB-2",
      "account": "Maintenance Receivable",
      "debit": 45000,
      "credit": 0
    },
    {
      "id": "TB-3",
      "account": "Capital Fund",
      "debit": 0,
      "credit": 395000
    }
  ],
  "journal": [
    {
      "id": "J-1",
      "date": "2026-06-02T11:06:09.972Z",
      "accountDebited": "Salary Expense",
      "accountCredited": "Bank",
      "amount": 15000
    },
    {
      "id": "J-2",
      "date": "2026-06-03T11:06:09.972Z",
      "accountDebited": "Bank",
      "accountCredited": "Maintenance Income",
      "amount": 5000
    }
  ],
  "bank": [
    {
      "id": "B-1",
      "date": "2026-06-02T11:06:09.972Z",
      "description": "IMPS Transfer to Guard",
      "type": "Withdrawal",
      "amount": 15000
    },
    {
      "id": "B-2",
      "date": "2026-06-03T11:06:09.972Z",
      "description": "NEFT from Rajesh Kumar",
      "type": "Deposit",
      "amount": 5000
    }
  ],
  "purchaseRequests": [
    {
      "id": "PR-1",
      "item": "LED Bulbs",
      "quantity": 50,
      "estimatedCost": 5000,
      "requestedBy": "Admin",
      "status": "Approved",
      "date": "2026-05-27T11:06:09.972Z"
    },
    {
      "id": "PR-2",
      "item": "Lawn Mower",
      "quantity": 1,
      "estimatedCost": 12000,
      "requestedBy": "Gardener",
      "status": "Pending",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "purchaseOrders": [
    {
      "id": "PO-1",
      "requestId": "PR-1",
      "vendorName": "Electricals Hub",
      "totalAmount": 4800,
      "status": "Placed",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "PO-2",
      "requestId": "PR-2",
      "vendorName": "Garden Tools Inc",
      "totalAmount": 11500,
      "status": "Draft",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "purchaseReceipts": [
    {
      "id": "dummy-1",
      "name": "Dummy Data 1 for purchaseReceipts",
      "description": "Realistic mock placeholder",
      "date": "2026-06-03T11:06:09.972Z",
      "status": "Active"
    },
    {
      "id": "dummy-2",
      "name": "Dummy Data 2 for purchaseReceipts",
      "description": "Realistic mock placeholder",
      "date": "2026-06-02T11:06:09.972Z",
      "status": "Pending"
    }
  ],
  "visitors": [
    {
      "id": "V-1",
      "name": "Zomato Guy",
      "purpose": "Delivery",
      "unit": "A-205",
      "entryTime": "2026-06-02T11:06:09.972Z",
      "exitTime": "2026-06-02T11:06:09.972Z",
      "status": "CHECKED_OUT"
    },
    {
      "id": "V-2",
      "name": "Suresh Uncle",
      "purpose": "Guest",
      "unit": "B-101",
      "entryTime": "2026-06-03T11:06:09.972Z",
      "status": "CHECKED_IN"
    },
    {
      "id": "V-3",
      "name": "Amazon Delivery",
      "purpose": "Delivery",
      "unit": "C-305",
      "entryTime": "2026-05-27T11:06:09.972Z",
      "exitTime": "2026-05-27T11:06:09.972Z",
      "status": "CHECKED_OUT"
    }
  ],
  "vehicles": [
    {
      "id": "VH-1",
      "plateNumber": "MH-12-AB-1234",
      "ownerName": "Rajesh Kumar",
      "type": "Car",
      "status": "Approved"
    },
    {
      "id": "VH-2",
      "plateNumber": "MH-14-XY-9999",
      "ownerName": "Sneha Kumar",
      "type": "Bike",
      "status": "Approved"
    },
    {
      "id": "VH-3",
      "plateNumber": "DL-01-ZZ-0000",
      "ownerName": "Visitor",
      "type": "Car",
      "status": "Temporary"
    }
  ],
  "parcels": [
    {
      "id": "P-1",
      "recipientName": "Rajesh Kumar",
      "unit": "A-205",
      "courier": "Amazon",
      "status": "Pending",
      "arrivalTime": "2026-06-03T11:06:09.972Z"
    },
    {
      "id": "P-2",
      "recipientName": "Amit Sharma",
      "unit": "C-305",
      "courier": "BlueDart",
      "status": "Delivered",
      "arrivalTime": "2026-06-02T11:06:09.972Z"
    }
  ],
  "gateQRs": [
    {
      "id": "QR-1",
      "residentName": "Rajesh Kumar",
      "validUntil": "2026-06-04T11:06:09.972Z",
      "status": "Active"
    },
    {
      "id": "QR-2",
      "residentName": "Guest of B-101",
      "validUntil": "2026-06-02T11:06:09.972Z",
      "status": "Expired"
    }
  ],
  "incidents": [
    {
      "id": "INC-1",
      "title": "Lift Stuck in Tower A",
      "severity": "High",
      "reportedBy": "Ram Singh",
      "date": "2026-06-02T11:06:09.972Z",
      "status": "Resolved"
    },
    {
      "id": "INC-2",
      "title": "Water Pipe Burst in Basement",
      "severity": "Critical",
      "reportedBy": "Admin",
      "date": "2026-06-03T11:06:09.972Z",
      "status": "In Progress"
    }
  ],
  "parkingSlots": [
    {
      "id": "PS-1",
      "slotNumber": "B1-01",
      "allocatedTo": "A-205",
      "type": "Car",
      "status": "Occupied"
    },
    {
      "id": "PS-2",
      "slotNumber": "B1-02",
      "allocatedTo": "B-101",
      "type": "Bike",
      "status": "Occupied"
    },
    {
      "id": "PS-3",
      "slotNumber": "B1-03",
      "allocatedTo": null,
      "type": "Car",
      "status": "Available"
    }
  ],
  "parkingPayments": [
    {
      "id": "PP-1",
      "slotId": "PS-1",
      "amount": 1500,
      "month": "June",
      "status": "Paid",
      "date": "2026-05-27T11:06:09.972Z"
    },
    {
      "id": "PP-2",
      "slotId": "PS-2",
      "amount": 500,
      "month": "June",
      "status": "Pending",
      "date": null
    }
  ],
  "staff": [
    {
      "id": 1,
      "name": "Ram Singh",
      "role": "GUARD",
      "shift": "Day",
      "phone": "+91 7777777777",
      "status": "ACTIVE",
      "attendanceStatus": "PRESENT"
    },
    {
      "id": 2,
      "name": "Lata Bai",
      "role": "MAID",
      "shift": "Morning",
      "phone": "+91 8888811111",
      "status": "ACTIVE",
      "attendanceStatus": "PRESENT"
    },
    {
      "id": 3,
      "name": "Shyam Lal",
      "role": "GUARD",
      "shift": "Night",
      "phone": "+91 7777788888",
      "status": "ACTIVE",
      "attendanceStatus": "ABSENT"
    }
  ],
  "tenants": [
    {
      "id": "T-1",
      "name": "John Doe",
      "unit": "B-101",
      "ownerName": "Jane Smith",
      "leaseEnd": "2026-12-31",
      "status": "Active"
    },
    {
      "id": "T-2",
      "name": "Alice Bob",
      "unit": "C-305",
      "ownerName": "Amit Sharma",
      "leaseEnd": "2025-05-31",
      "status": "Expired"
    }
  ],
  "complaints": [
    {
      "id": "CMP-1",
      "title": "Lobby Light not working",
      "category": "Electrical",
      "priority": "Low",
      "status": "Open",
      "reportedBy": "Rajesh Kumar"
    },
    {
      "id": "CMP-2",
      "title": "Gym AC dripping water",
      "category": "HVAC",
      "priority": "Medium",
      "status": "In Progress",
      "reportedBy": "Sneha Kumar"
    },
    {
      "id": "CMP-3",
      "title": "Garbage not collected",
      "category": "Housekeeping",
      "priority": "High",
      "status": "Resolved",
      "reportedBy": "Amit Sharma"
    }
  ],
  "assets": [
    {
      "id": "AST-1",
      "name": "Water Pump 1",
      "category": "Plumbing",
      "location": "Basement",
      "status": "Working",
      "lastServiced": "2026-05-27T11:06:09.972Z"
    },
    {
      "id": "AST-2",
      "name": "Treadmill",
      "category": "Gym",
      "location": "Clubhouse",
      "status": "Needs Repair",
      "lastServiced": "2026-04-04T11:06:09.972Z"
    }
  ],
  "defaulters": [
    {
      "id": "DEF-1",
      "name": "Sneha Kumar",
      "unit": "B-101",
      "outstandingAmount": 4500,
      "daysOverdue": 15
    },
    {
      "id": "DEF-2",
      "name": "Rahul Verma",
      "unit": "D-404",
      "outstandingAmount": 12000,
      "daysOverdue": 45
    }
  ],
  "meetings": [
    {
      "id": "M-1",
      "title": "Annual General Meeting",
      "date": "2026-06-08T11:06:09.972Z",
      "agenda": "Budget planning",
      "status": "Scheduled"
    },
    {
      "id": "M-2",
      "title": "Security Review",
      "date": "2026-06-02T11:06:09.972Z",
      "agenda": "Review new CCTV placement",
      "status": "Completed"
    }
  ],
  "units": [
    {
      "id": "U-1",
      "unitNumber": "A-205",
      "block": "A",
      "floor": 2,
      "type": "3BHK",
      "owner": "Rajesh Kumar",
      "status": "Occupied"
    },
    {
      "id": "U-2",
      "unitNumber": "B-101",
      "block": "B",
      "floor": 1,
      "type": "2BHK",
      "owner": "Jane Smith",
      "tenant": "John Doe",
      "status": "Rented"
    },
    {
      "id": "U-3",
      "unitNumber": "C-305",
      "block": "C",
      "floor": 3,
      "type": "4BHK",
      "owner": "Amit Sharma",
      "status": "Occupied"
    }
  ],
  "moveInOut": [
    {
      "id": "MIO-1",
      "residentName": "John Doe",
      "type": "Move In",
      "unit": "B-101",
      "date": "2026-05-27T11:06:09.972Z",
      "status": "Completed"
    },
    {
      "id": "MIO-2",
      "residentName": "Alice Bob",
      "type": "Move Out",
      "unit": "C-305",
      "date": "2026-06-05T11:06:09.972Z",
      "status": "Approved"
    }
  ],
  "unitData": {
    "id": "unit-101",
    "block": "Tower A",
    "number": "205",
    "unitNumber": "A-205",
    "floor": "2nd Floor",
    "type": "3 BHK",
    "area": "1600 sq.ft",
    "status": "Occupied",
    "familyMembers": [
      {
        "id": 1,
        "name": "Sneha Kumar",
        "relation": "Spouse",
        "phone": "+91 98765 43211",
        "age": 34
      },
      {
        "id": 2,
        "name": "Aarav Kumar",
        "relation": "Son",
        "age": 8
      }
    ],
    "vehicles": [
      {
        "id": 1,
        "brand": "Toyota",
        "model": "Fortuner",
        "plateNumber": "MH-12-AB-1234",
        "type": "Car"
      },
      {
        "id": 2,
        "brand": "Honda",
        "model": "Activa",
        "plateNumber": "MH-12-XX-5678",
        "type": "Two-Wheeler"
      }
    ],
    "pets": [
      {
        "id": 1,
        "name": "Rocky",
        "breed": "German Shepherd",
        "type": "Dog"
      },
      {
        "id": 2,
        "name": "Milo",
        "breed": "Persian",
        "type": "Cat"
      }
    ]
  },
  "communityPosts": [
    {
      "id": 1,
      "author": "Rajesh Kumar",
      "title": "Lost Keys in Garden",
      "content": "Has anyone seen a set of keys near the swing?",
      "type": "Query",
      "likes": 2,
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": 2,
      "author": "Admin",
      "title": "Yoga Classes Starting",
      "content": "Free yoga classes in clubhouse from Monday.",
      "type": "Announcement",
      "likes": 15,
      "date": "2026-05-27T11:06:09.972Z"
    }
  ],
  "marketItems": [
    {
      "id": 1,
      "title": "IKEA Dining Table",
      "price": 5000,
      "condition": "Good",
      "seller": "Sneha Kumar",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": 2,
      "title": "Kids Bicycle",
      "price": 1500,
      "condition": "Like New",
      "seller": "Amit Sharma",
      "date": "2026-06-03T11:06:09.972Z"
    }
  ],
  "amenities": [
    {
      "id": 1,
      "name": "Tennis Court",
      "status": "Available",
      "timing": "06:00 - 22:00",
      "price": 200
    },
    {
      "id": 2,
      "name": "Swimming Pool",
      "status": "Maintenance",
      "timing": "06:00 - 20:00",
      "price": 0
    },
    {
      "id": 3,
      "name": "Clubhouse Hall",
      "status": "Available",
      "timing": "09:00 - 23:00",
      "price": 1500
    }
  ],
  "bookings": [
    {
      "id": 1,
      "amenity": "Tennis Court",
      "resident": "Rajesh Kumar",
      "date": "2026-06-03T11:06:09.972Z",
      "slot": "18:00 - 19:00",
      "status": "Confirmed"
    },
    {
      "id": 2,
      "amenity": "Clubhouse Hall",
      "resident": "Amit Sharma",
      "date": "2026-06-05T11:06:09.972Z",
      "slot": "Evening",
      "status": "Pending"
    }
  ],
  "services": [
    {
      "id": "s1",
      "name": "Plumbing Repair",
      "provider": "AquaFlow",
      "rating": 4.5,
      "price": "₹500/visit"
    },
    {
      "id": "s2",
      "name": "AC Servicing",
      "provider": "CoolBreeze",
      "rating": 4.8,
      "price": "₹800/split AC"
    },
    {
      "id": "s3",
      "name": "Deep Cleaning",
      "provider": "Sparkle Cleaners",
      "rating": 3.9,
      "price": "₹2500/3BHK"
    }
  ],
  "serviceCategories": [
    {
      "id": "c1",
      "name": "Plumbing",
      "icon": "Wrench"
    },
    {
      "id": "c2",
      "name": "Electrical",
      "icon": "Zap"
    },
    {
      "id": "c3",
      "name": "Cleaning",
      "icon": "Sparkles"
    }
  ],
  "guardLogs": [
    {
      "id": "GL-1",
      "guardName": "Ram Singh",
      "action": "Patrol Completed - Block A",
      "time": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "GL-2",
      "guardName": "Shyam Lal",
      "action": "Shift Handover",
      "time": "2026-06-03T11:06:09.972Z"
    },
    {
      "id": "GL-3",
      "guardName": "Ram Singh",
      "action": "Suspicious vehicle reported",
      "time": "2026-05-27T11:06:09.972Z"
    }
  ],
  "vendorEarnings": [
    {
      "id": "VE-1",
      "month": "June",
      "totalEarned": 15000,
      "platformFee": 1500,
      "netPayout": 13500
    },
    {
      "id": "VE-2",
      "month": "May",
      "totalEarned": 22000,
      "platformFee": 2200,
      "netPayout": 19800
    }
  ],
  "vendorOrders": [
    {
      "id": "VO-1",
      "service": "Fix Leaking Pipe",
      "client": "Rajesh Kumar",
      "amount": 500,
      "status": "Completed",
      "date": "2026-06-02T11:06:09.972Z"
    },
    {
      "id": "VO-2",
      "service": "Fan Installation",
      "client": "Amit Sharma",
      "amount": 800,
      "status": "Scheduled",
      "date": "2026-06-04T11:06:09.972Z"
    }
  ],
  "vendorInquiries": [
    {
      "id": 1,
      "residentName": "Ananya Roy",
      "unit": "A-302",
      "phone": "+91 98765 43210",
      "serviceName": "Split AC Deep Cleaning & Gas Refill",
      "status": "booked",
      "preferredDate": "2026-06-12",
      "preferredTime": "10:00 AM",
      "payableAmount": 1500,
      "vendorPrice": 1350,
      "createdAt": "2026-06-08T09:30:00.000Z",
      "notes": "AC cooling is weak, needs coil wash and gas top-up."
    },
    {
      "id": 2,
      "residentName": "Rajesh Kumar",
      "unit": "B-105",
      "phone": "+91 98111 22233",
      "serviceName": "Bathroom Plumbing & Leakage Repair",
      "status": "confirmed",
      "contactedAt": "2026-06-07T11:00:00.000Z",
      "preferredDate": "2026-06-10",
      "preferredTime": "02:00 PM",
      "payableAmount": 850,
      "vendorPrice": 800,
      "createdAt": "2026-06-07T08:15:00.000Z",
      "notes": "Main flush tank pipe leaking under sink."
    },
    {
      "id": 3,
      "residentName": "Siddharth Mehta",
      "unit": "C-204",
      "phone": "+91 97777 88899",
      "serviceName": "Full Home Deep Cleaning (3 BHK)",
      "status": "done",
      "contactedAt": "2026-06-05T10:00:00.000Z",
      "preferredDate": "2026-06-06",
      "preferredTime": "09:00 AM",
      "payableAmount": 4500,
      "vendorPrice": 4050,
      "paymentStatus": "PAID",
      "createdAt": "2026-06-04T14:20:00.000Z",
      "notes": "Balcony glass cleaning and sofa shampooing included."
    },
    {
      "id": 4,
      "residentName": "Pooja Verma",
      "unit": "D-501",
      "phone": "+91 96543 21098",
      "serviceName": "Electrical Wiring & Ceiling Light Fitting",
      "status": "contacted",
      "contactedAt": "2026-06-09T15:30:00.000Z",
      "preferredDate": "2026-06-11",
      "preferredTime": "11:30 AM",
      "payableAmount": 1200,
      "vendorPrice": 1100,
      "createdAt": "2026-06-09T10:00:00.000Z",
      "notes": "4 LED panel lights installation in living room."
    },
    {
      "id": 5,
      "residentName": "Karan Malhotra",
      "unit": "E-102",
      "phone": "+91 95432 10987",
      "serviceName": "Woodwork & Kitchen Cabinet Hinge Repair",
      "status": "booked",
      "preferredDate": "2026-06-13",
      "preferredTime": "04:00 PM",
      "payableAmount": 950,
      "vendorPrice": 850,
      "createdAt": "2026-06-10T11:45:00.000Z",
      "notes": "Hydraulic hinge replacement for modular kitchen doors."
    }
  ],
  "tickets": [
    {
      "id": "TKT-1001",
      "ticketNumber": "TKT-1001",
      "subject": "Water leakage in master bathroom ceiling",
      "title": "Water leakage in master bathroom ceiling",
      "description": "Heavy water dripping from the 3rd floor bathroom pipe onto master bath ceiling.",
      "category": "Plumbing",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "resident": { "name": "Sneha Kumar", "unit": "A-205" },
      "unit": "A-205",
      "createdAt": "2026-06-08T10:00:00.000Z",
      "comments": [
        { "id": 1, "user": "Admin", "message": "Plumber assigned to inspect today at 2 PM.", "createdAt": "2026-06-08T11:30:00.000Z" }
      ]
    },
    {
      "id": "TKT-1002",
      "ticketNumber": "TKT-1002",
      "subject": "Basement B2 Light Flashing",
      "title": "Basement B2 Light Flashing",
      "description": "Flickering tube light near parking slot B-45.",
      "category": "Electrical",
      "priority": "MEDIUM",
      "status": "OPEN",
      "resident": { "name": "Rajesh Sharma", "unit": "B-101" },
      "unit": "B-101",
      "createdAt": "2026-06-09T14:20:00.000Z",
      "comments": []
    },
    {
      "id": "TKT-1003",
      "ticketNumber": "TKT-1003",
      "subject": "Elevator 2 Door Sensor Sticking",
      "title": "Elevator 2 Door Sensor Sticking",
      "description": "Lift door closes too quickly on Tower C.",
      "category": "Maintenance",
      "priority": "HIGH",
      "status": "RESOLVED",
      "resident": { "name": "Vikram Malhotra", "unit": "C-305" },
      "unit": "C-305",
      "createdAt": "2026-06-06T09:00:00.000Z",
      "comments": [
        { "id": 1, "user": "Maintenance Staff", "message": "Sensor calibrated and tested successfully.", "createdAt": "2026-06-06T16:00:00.000Z" }
      ]
    }
  ],
  "notices": [
    {
      "id": 1,
      "title": "Scheduled Elevator Maintenance - Tower A",
      "content": "Elevator #2 in Tower A will undergo routine servicing on Saturday from 10:00 AM to 02:00 PM. Please use Elevator #1.",
      "category": "Maintenance",
      "priority": "HIGH",
      "postedBy": "Society Management",
      "date": "2026-06-10T10:00:00.000Z",
      "createdAt": "2026-06-10T10:00:00.000Z",
      "status": "Active"
    },
    {
      "id": 2,
      "title": "Monsoon Roof Inspection & Solar Cleaning",
      "content": "Rooftop solar panel cleaning and drainage pipe waterproofing will take place this week. Avoid rooftop access.",
      "category": "General",
      "priority": "MEDIUM",
      "postedBy": "Maintenance Committee",
      "date": "2026-06-08T09:00:00.000Z",
      "createdAt": "2026-06-08T09:00:00.000Z",
      "status": "Active"
    },
    {
      "id": 3,
      "title": "Tree Trimming & Garden Improvement Drive",
      "content": "Overhanging branches in the West Garden will be trimmed on Sunday morning. Kindly refrain from parking near West Driveway.",
      "category": "Environment",
      "priority": "LOW",
      "postedBy": "Green Club Committee",
      "date": "2026-06-05T14:30:00.000Z",
      "createdAt": "2026-06-05T14:30:00.000Z",
      "status": "Active"
    }
  ],
  "events": [
    {
      "id": 1,
      "title": "Annual International Yoga Day Celebration",
      "description": "Guided yoga and meditation session in the main clubhouse lawn followed by healthy breakfast.",
      "date": "2026-06-21T06:30:00.000Z",
      "location": "Clubhouse Lawn",
      "organizer": "Sports & Cultural Committee",
      "status": "Upcoming",
      "attendeesCount": 42
    },
    {
      "id": 2,
      "title": "Monsoon Tree Plantation Drive",
      "description": "Community drive to plant 100 saplings across the society perimeter. Saplings and tools provided.",
      "date": "2026-07-05T08:00:00.000Z",
      "location": "North Perimeter Gate",
      "organizer": "Eco Club",
      "status": "Upcoming",
      "attendeesCount": 28
    },
    {
      "id": 3,
      "title": "Summer Badminton Tournament 2026",
      "description": "Men's, Women's and Mixed Doubles tournament at the indoor sports complex.",
      "date": "2026-05-30T16:00:00.000Z",
      "location": "Indoor Badminton Court",
      "organizer": "Sports Committee",
      "status": "Completed",
      "attendeesCount": 64
    }
  ],
  "societyDuesReceipts": [
    {
      "id": "dummy-1",
      "name": "Dummy Data 1 for societyDuesReceipts",
      "description": "Realistic mock placeholder",
      "date": "2026-06-03T11:06:09.972Z",
      "status": "Active"
    },
    {
      "id": "dummy-2",
      "name": "Dummy Data 2 for societyDuesReceipts",
      "description": "Realistic mock placeholder",
      "date": "2026-06-02T11:06:09.972Z",
      "status": "Pending"
    }
  ],
  "guidelines": [
    {
      "id": 1,
      "title": "Community Quiet Hours & Noise Policy",
      "category": "Rules",
      "content": "Quiet hours are observed daily from 10:00 PM to 06:00 AM. Please keep TV and music volume low to ensure peace for all neighbors.",
      "society": { "name": "Sharlow Bay Community" },
      "createdAt": "2026-06-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Visitor Parking & Vehicle Speed Limit",
      "category": "Security",
      "content": "Speed limit inside society premises is 15 km/h. Visitor vehicles must park only in designated visitor slots marked in Block B.",
      "society": { "name": "Sharlow Bay Community" },
      "createdAt": "2026-06-03T11:30:00.000Z"
    },
    {
      "id": 3,
      "title": "Waste Segregation & Garbage Collection Timings",
      "category": "Maintenance",
      "content": "Garbage collection takes place every morning at 08:30 AM. Please segregate wet waste (green bin) and dry waste (blue bin).",
      "society": { "name": "Sharlow Bay Community" },
      "createdAt": "2026-06-05T09:00:00.000Z"
    }
  ],
  "billingPlans": [
    { "id": 1, "name": "Basic Plan", "price": 2999, "type": "Monthly", "planType": "BASIC", "description": "Essential community management and gate control", "status": "active", "societiesCount": 5 },
    { "id": 2, "name": "Professional Plan", "price": 5999, "type": "Quarterly", "planType": "PROFESSIONAL", "description": "Complete society suite with automated billing & Accounting", "status": "active", "societiesCount": 12 },
    { "id": 3, "name": "Enterprise Plan", "price": 12999, "type": "Yearly", "planType": "ENTERPRISE", "description": "Full platform control with custom domain & priority support", "status": "active", "societiesCount": 3 }
  ],
  "settings": {
    "siteName": "IGATESECURITY",
    "contactEmail": "support@igatesecurity.com",
    "maintenanceMode": "false",
    "newRegistrations": "true",
    "emailNotifications": "true",
    "smsNotifications": "true",
    "pushNotifications": "true",
    "twoFactorRequired": "false",
    "sessionTimeout": "30",
    "maxLoginAttempts": "5"
  }
};

// ----------------------------------------------------
let memoryDB: any = null;

function getMockDB(): any {
  if (typeof window === 'undefined') {
    if (!memoryDB) {
      memoryDB = JSON.parse(JSON.stringify(DEFAULT_DB));
    }
    return memoryDB;
  }
  const data = localStorage.getItem('gatesecurity_mock_db_v2');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      let modified = false;
      for (const key of Object.keys(DEFAULT_DB)) {
        if (parsed[key] === undefined) {
          parsed[key] = JSON.parse(JSON.stringify((DEFAULT_DB as any)[key]));
          modified = true;
        }
      }
      if (parsed.users) {
        for (const defaultUser of DEFAULT_DB.users) {
          if (!parsed.users.some((u: any) => u.email === defaultUser.email)) {
            parsed.users.push(JSON.parse(JSON.stringify(defaultUser)));
            modified = true;
          }
        }
      }
      if (modified) {
        localStorage.setItem('gatesecurity_mock_db_v2', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error("Error parsing mock DB, resetting", e);
    }
  }
  localStorage.setItem('gatesecurity_mock_db_v2', JSON.stringify(DEFAULT_DB));
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

function saveMockDB(db: any) {
  if (typeof window === 'undefined') {
    memoryDB = db;
    return;
  }
  localStorage.setItem('gatesecurity_mock_db_v2', JSON.stringify(db));
}

function wrapPayloadWithData(payload: any) {
  if (payload && (typeof payload === 'object' || Array.isArray(payload))) {
    try {
      if (!Object.prototype.hasOwnProperty.call(payload, 'data')) {
        Object.defineProperty(payload, 'data', {
          value: payload,
          writable: true,
          configurable: true,
          enumerable: false
        });
      }
    } catch (e) {
      // safe bypass
    }
  }
  return payload;
}

function resolveStaticPath(url: string, method: string, body: any): any {
  const db = getMockDB();
  const path = url.toLowerCase();
  
  let currentUser = db.users[0];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user) {
          currentUser = parsed.state.user;
        }
      } catch (e) {}
    }
  }

  // Handle mutations (POST, PUT, DELETE, PATCH)
  const isMutation = method.toLowerCase() !== 'get';
  if (isMutation) {
    const isDelete = method.toLowerCase() === 'delete';
    const isPutOrPatch = method.toLowerCase() === 'put' || method.toLowerCase() === 'patch';

    if (path.includes('auth/login')) {
      const email = (body?.email || '').toLowerCase();
      let user;
      if (email.includes('super')) {
        user = db.users.find((u: any) => u.role === 'super_admin');
      } else if (email.includes('admin')) {
        user = db.users.find((u: any) => u.role === 'admin');
      } else if (email.includes('resident')) {
        user = db.users.find((u: any) => u.role === 'resident');
      } else if (email.includes('guard')) {
        user = db.users.find((u: any) => u.role === 'guard');
      } else if (email.includes('vendor') || email.includes('test4')) {
        user = db.users.find((u: any) => u.role === 'vendor');
      } else if (email.includes('individual')) {
        user = db.users.find((u: any) => u.role === 'individual');
      }
      if (!user) {
        user = db.users.find((u: any) => u.email === email) || db.users[0];
      }
      return { user, token: `mock-token-${user.id}` };
    }
    if (path.includes('auth/profile')) {
      if (path.includes('photo')) {
        const photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
        currentUser.avatar = photoUrl;
        currentUser.profileImg = photoUrl;
        const idx = db.users.findIndex((u: any) => u.id === currentUser.id);
        if (idx !== -1) db.users[idx] = currentUser;
        saveMockDB(db);
        return { success: true, profileImg: photoUrl, user: currentUser };
      }
      if (body) Object.assign(currentUser, body);
      const idx = db.users.findIndex((u: any) => u.id === currentUser.id);
      if (idx !== -1) db.users[idx] = currentUser;
      saveMockDB(db);
      return currentUser;
    }

    if (path.includes('settings')) {
      db.settings = { ...db.settings, ...body };
      saveMockDB(db);
      return db.settings;
    }

    if (path.includes('auth/admins') || path.includes('auth/admin')) {
      const parts = path.split('/');
      const lastSegment = parts[parts.length - 1];
      const targetId = !isNaN(Number(lastSegment)) ? Number(lastSegment) : null;
      if (!Array.isArray(db.users)) db.users = [];

      if (isDelete && targetId) {
        db.users = db.users.filter((u: any) => String(u.id) !== String(targetId));
        saveMockDB(db);
        return { success: true, message: "Admin deleted successfully" };
      }

      if (isPutOrPatch && targetId) {
        const idx = db.users.findIndex((u: any) => String(u.id) === String(targetId));
        if (idx !== -1) {
          db.users[idx] = { ...db.users[idx], ...body, updatedAt: new Date().toISOString() };
          saveMockDB(db);
          return db.users[idx];
        }
      }

      const soc = Array.isArray(db.societies)
        ? db.societies.find((s: any) => String(s.id) === String(body?.societyId))
        : null;

      const newAdmin = {
        id: db.users.length + 1,
        name: body?.name || "New Admin",
        email: body?.email || "admin@society.com",
        phone: body?.phone || "+91 98765 00000",
        role: "admin",
        designation: body?.designation || "Society Admin",
        status: "active",
        society: soc?.name || "Sharlow Bay Community",
        societyId: body?.societyId ? Number(body.societyId) : 1,
        isPaid: true,
        subscriptionPlan: "BASIC",
        joinedDate: new Date().toISOString().split("T")[0],
        lastLogin: "Just now",
        profileImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop"
      };

      db.users.unshift(newAdmin);
      saveMockDB(db);
      return newAdmin;
    }

    if (path.includes('services/inquiries')) {
      const parts = path.split('/');
      const isContact = path.includes('/contact');
      const isStatus = path.includes('/status');
      let idStr = parts[parts.length - 1];
      if (isContact || isStatus) {
        idStr = parts[parts.length - 2];
      }
      if (!Array.isArray(db.vendorInquiries)) db.vendorInquiries = [];
      const existingIdx = db.vendorInquiries.findIndex((item: any) => String(item.id) === String(idStr));
      if (existingIdx !== -1) {
        if (isContact) {
          db.vendorInquiries[existingIdx].contactedAt = new Date().toISOString();
          db.vendorInquiries[existingIdx].status = 'contacted';
        }
        if (isStatus) {
          if (body?.status) db.vendorInquiries[existingIdx].status = body.status;
          if (body?.payableAmount) {
            db.vendorInquiries[existingIdx].payableAmount = body.payableAmount;
            db.vendorInquiries[existingIdx].vendorPrice = body.payableAmount;
          }
        }
        if (body) Object.assign(db.vendorInquiries[existingIdx], body);
        saveMockDB(db);
        return db.vendorInquiries[existingIdx];
      }
    }

    if (path.includes('resident/unit/family') || path.includes('resident/unit/vehicle') || path.includes('resident/unit/pet')) {
      if (!db.unitData) db.unitData = {};
      if (!Array.isArray(db.unitData.familyMembers)) db.unitData.familyMembers = [];
      if (!Array.isArray(db.unitData.members)) db.unitData.members = db.unitData.familyMembers;
      if (!Array.isArray(db.unitData.vehicles)) db.unitData.vehicles = [];
      if (!Array.isArray(db.unitData.pets)) db.unitData.pets = [];
      if (!Array.isArray(db.unitData.petsList)) db.unitData.petsList = db.unitData.pets;

      const isFamily = path.includes('family');
      const isVehicle = path.includes('vehicle');
      const isPet = path.includes('pet');

      const targetList = isFamily ? db.unitData.familyMembers : isVehicle ? db.unitData.vehicles : db.unitData.pets;
      
      const parts = path.split('/');
      const idStr = parts[parts.length - 1];
      const existingIdx = targetList.findIndex((item: any) => String(item.id) === String(idStr));

      if (isPutOrPatch && existingIdx !== -1) {
        Object.assign(targetList[existingIdx], body);
        if (isFamily) db.unitData.members = targetList;
        if (isPet) db.unitData.petsList = targetList;
        saveMockDB(db);
        return targetList[existingIdx];
      }

      const newItem = { id: Date.now(), ...body };
      targetList.push(newItem);
      if (isFamily) db.unitData.members = targetList;
      if (isPet) db.unitData.petsList = targetList;
      saveMockDB(db);
      return newItem;
    }

    const collections = ['visitors', 'complaints', 'tickets', 'vehicles', 'parcels', 'staff', 'notices', 'events', 'societies', 'tenants', 'vendors', 'invoices', 'amenities', 'bookings', 'purchaseRequests', 'purchaseOrders', 'documents', 'meetings', 'assets', 'incidents', 'guidelines', 'propertyLeads', 'rentalAgreements', 'marketItems', 'communityPosts', 'billing-plans', 'billingPlans'];
    let targetCollection: string | null = null;
    for (const c of collections) {
      if (path.includes(c)) {
        targetCollection = c === 'billing-plans' ? 'billingPlans' : c;
        break;
      }
    }

    if (isDelete && targetCollection && Array.isArray(db[targetCollection])) {
      const parts = path.split('/');
      const idStr = parts[parts.length - 1];
      db[targetCollection] = db[targetCollection].filter((item: any) => String(item.id) !== String(idStr));
      saveMockDB(db);
      return { success: true, message: "Item deleted successfully" };
    }

    if (targetCollection && Array.isArray(db[targetCollection])) {
      const parts = path.split('/');
      const idStr = parts[parts.length - 1];
      const existingIdx = db[targetCollection].findIndex((item: any) => String(item.id) === String(idStr));
      
      if (isPutOrPatch && existingIdx !== -1) {
        db[targetCollection][existingIdx] = { ...db[targetCollection][existingIdx], ...body, updatedAt: new Date().toISOString() };
        saveMockDB(db);
        return db[targetCollection][existingIdx];
      }
      
      const newRecord = {
        id: String(db[targetCollection].length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: body?.status || 'active',
        societiesCount: 0,
        ...body
      };
      db[targetCollection].unshift(newRecord);
      saveMockDB(db);
      return newRecord;
    }

    return {
      success: true,
      message: "Action simulated successfully in static demo mode",
      ...body
    };
  }

  // 1. Auth Get
  if (path.includes('auth/me')) {
    return currentUser;
  }
  if (path.includes('billing-plans') || path.includes('billingplans')) {
    if (!Array.isArray(db.billingPlans)) db.billingPlans = [];
    return db.billingPlans;
  }
  if (path.includes('auth/stats')) {
    const adminList = Array.isArray(db.users) ? db.users.filter((u: any) => u.role === 'ADMIN' || u.role === 'admin') : [];
    return {
      totalAdmins: adminList.length,
      activeAdmins: adminList.filter((u: any) => (u.status || '').toLowerCase() === 'active').length,
      pendingAdmins: adminList.filter((u: any) => (u.status || '').toLowerCase() === 'pending').length,
      suspendedAdmins: adminList.filter((u: any) => (u.status || '').toLowerCase() === 'suspended' || (u.status || '').toLowerCase() === 'inactive').length,
    };
  }
  if (path.includes('auth/all') || path.includes('auth/admins') || path.includes('users')) {
    return db.users;
  }

  // 2. Dashboards and Stats
  if (path.includes('admin-dashboard-stats') || path.includes('dashboard/stats') || path.includes('society/stats')) {
    return {
      societyName: 'Sharlow Bay Community',
      units: { total: 150, occupied: 120, vacant: 30 },
      users: { total: 240, active: 210, inactive: 25, pending: 5, owners: 140, tenants: 70, staff: 12, neverLoggedIn: 18 },
      finance: {
        totalRevenue: 520000,
        pendingDues: 85000,
        collectedThisMonth: 435000,
        totalExpenses: 120000,
        defaultersCount: db.invoices.filter((inv: any) => inv.status === 'OVERDUE' || inv.status === 'overdue').length,
        parkingIncome: 24000,
        amenityIncome: 18000,
        pendingVendorPayments: 35000,
        lateFees: 2500,
        monthlyIncome: [
          { month: 'Jan', income: 380000, expenses: 90000, amount: 380000 },
          { month: 'Feb', income: 420000, expenses: 100000, amount: 420000 },
          { month: 'Mar', income: 450000, expenses: 110000, amount: 450000 },
          { month: 'Apr', income: 490000, expenses: 115000, amount: 490000 },
          { month: 'May', income: 520000, expenses: 120000, amount: 520000 }
        ]
      },
      activity: {
        openComplaints: db.complaints.length + db.tickets.length,
        escalatedComplaints: 0,
        todayVisitors: db.visitors.length,
        upcomingMeetings: db.meetings.length,
        openPurchaseRequests: 2,
        unfinalizedPurchaseRequests: 1,
        activeVendors: db.vendors.length,
        pendingVisitors: 2
      },
      recentActivities: [
        { id: '1', type: 'complaint', user: 'Sneha Kumar', action: 'Raised complaint for bathroom water leakage', time: new Date().toISOString(), status: 'warning' },
        { id: '2', type: 'visitor', user: 'Security Gate 1', action: 'Visitor John Doe checked in', time: new Date().toISOString(), status: 'success' }
      ],
      defaulters: db.invoices.filter((inv: any) => inv.status === 'OVERDUE' || inv.status === 'overdue').map((inv: any) => ({
        receivedFrom: inv.recipientName,
        amount: inv.amount,
        category: inv.category || 'Maintenance',
        createdAt: inv.createdAt,
        unit: inv.unit || 'A-205',
        residentName: inv.recipientName,
        outstanding: inv.amount,
        dueDate: inv.dueDate
      }))
    };
  }
  if (path.includes('platform-stats') || path.includes('reports/platform-stats') || path.includes('super-admin/dashboard')) {
    return {
      platformStats: {
        totalSocieties: db.societies.length,
        activeSocieties: db.societies.length,
        pendingSocieties: 0,
        totalUsers: 840,
        activeUsers: 720,
        totalUnits: 650,
        monthlyRevenue: 345000,
        pendingApprovals: 0
      },
      societyGrowthData: [
        { month: 'Jan', societies: 4, users: 150 },
        { month: 'Feb', societies: 6, users: 280 }
      ],
      revenueData: [
        { month: 'Jan', revenue: 120000 },
        { month: 'Feb', revenue: 180000 }
      ],
      subscriptionStats: [
        { plan: 'Premium Plan', societies: 1, color: 'bg-purple-600' }
      ],
      systemHealth: {
        serverUptime: '99.98%',
        apiLatency: '42ms',
        databaseSize: '1.2 GB',
        activeConnections: '2,480',
        cpuUsage: 18,
        memoryUsage: 45
      }
    };
  }
  if (path.includes('resident/dashboard')) {
    return {
      dues: db.invoices,
      unpaidBillsCount: db.invoices.length,
      recentVisitors: db.visitors,
      noticesCount: db.notices.length,
      pendingDeliveriesCount: db.parcels.length,
      pendingDeliveries: db.parcels,
      recentNotices: db.notices,
      complaintsCount: db.complaints.length
    };
  }

  if (path.includes('guard/stats')) {
    return {
      visitorsToday: db.visitors.length,
      pendingApprovals: db.visitors.filter((v: any) => v.status === 'PENDING' || v.status === 'pending').length,
      parcelsToDeliver: db.parcels.filter((p: any) => p.status === 'Pending' || p.status === 'PENDING').length,
      vehiclesIn: db.vehicles.length
    };
  }

  if (path.includes('guard/activity')) {
    return [
      { id: '1', name: 'Zomato Delivery', unit: 'A-205', action: 'Checked In', status: 'checkin', time: new Date().toISOString() },
      { id: '2', name: 'John Doe', unit: 'B-101', action: 'Approved Entry', status: 'approved', time: new Date().toISOString() },
      { id: '3', name: 'Amazon Parcel', unit: 'C-305', action: 'Parcel Logged', status: 'delivered', time: new Date().toISOString() },
      { id: '4', name: 'Unknown Vehicle', unit: 'Gate 1', action: 'Suspicious Vehicle Flagged', status: 'incident', time: new Date().toISOString() }
    ];
  }

  if (path.includes('chat') || path.includes('conversations')) {
    if (path.includes('messages')) {
      return {
        data: [
          { id: 101, content: "Hello Gate Guard, please check in Zomato delivery for A-205.", sender: { id: "2", name: "Rajesh Kumar", role: "resident" }, createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 102, content: "Understood Mr. Rajesh, verified and allowed.", sender: { id: "3", name: "Ram Singh", role: "guard" }, createdAt: new Date(Date.now() - 1800000).toISOString() }
        ],
        total: 2, limit: 50, offset: 0
      };
    }
    return [
      {
        id: 1,
        type: "DIRECT",
        unreadCount: 1,
        updatedAt: new Date().toISOString(),
        otherUser: { id: 2, name: "Rajesh Kumar", phone: "+91 98765 43210", role: "resident", unit: "A-205" },
        lastMessage: { content: "Please check in Zomato delivery for A-205.", createdAt: new Date().toISOString() }
      },
      {
        id: 2,
        type: "DIRECT",
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        otherUser: { id: 3, name: "Sneha Sharma", phone: "+91 98765 11111", role: "resident", unit: "B-101" },
        lastMessage: { content: "Thank you for holding the Amazon parcel.", createdAt: new Date(Date.now() - 86400000).toISOString() }
      },
      {
        id: 3,
        type: "DIRECT",
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        otherUser: { id: 4, name: "Vikram Malhotra", phone: "+91 98765 00010", role: "admin", unit: "C-305" },
        lastMessage: { content: "Morning shift duty log submitted cleanly.", createdAt: new Date(Date.now() - 172800000).toISOString() }
      }
    ];
  }

  // 3. Modules Mappings
  if (path.includes('complaint') || path.includes('ticket')) {
    if (path.includes('stats')) {
      return {
        total: db.complaints.length,
        resolved: db.complaints.filter((c: any) => c.status === 'resolved').length,
        pending: db.complaints.filter((c: any) => c.status === 'pending' || c.status === 'open').length,
        highPriority: db.complaints.filter((c: any) => c.priority === 'high').length
      };
    }
    const match = path.match(/(complaints|tickets)\/([a-zA-Z0-9-]+)/);
    if (match && match[2] && match[2] !== 'stats' && match[2] !== 'societies' && match[2] !== 'residents' && match[2] !== 'individuals') {
      const id = match[2];
      const item = db.complaints.find((c: any) => String(c.id) === id) || db.tickets.find((t: any) => String(t.id) === id);
      if (item) return item;
    }
    return [...db.complaints, ...db.tickets];
  }
  if (path.includes('visitor')) {
    return db.visitors;
  }
  if (path.includes('vehicle')) {
    return db.vehicles;
  }
  if (path.includes('parcel')) {
    return db.parcels;
  }
  if (path.includes('amenit')) {
    if (path.includes('booking')) return db.bookings;
    return db.amenities;
  }
  if (path.includes('notice')) {
    return db.notices;
  }
  if (path.includes('event')) {
    return db.events;
  }
  if (path.includes('meeting')) {
    return db.meetings;
  }
  if (path.includes('document')) {
    return db.documents;
  }
  if (path.includes('services/inquiries') || path.includes('inquiries')) {
    return db.vendorInquiries;
  }
  if (path.includes('vendor')) {
    if (path.includes('invoice')) return db.vendorInvoices;
    if (path.includes('payout')) return db.payouts;
    if (path.includes('lead') || path.includes('inquiries')) return db.vendorInquiries;
    if (path.includes('commission')) return db.vendorCommissions;
    return db.vendors;
  }
  if (path.includes('tenant')) {
    return db.tenants;
  }
  if (path.includes('emergency') || path.includes('sos')) {
    if (path.includes('sos/data') || path.includes('data')) {
      return { contacts: db.emergencyContacts || [], alerts: db.emergencyAlerts || [] };
    }
    if (path.includes('contact')) return db.emergencyContacts;
    if (path.includes('alert')) return db.emergencyAlerts;
    if (path.includes('barcode')) return db.emergencyBarcodes;
    if (path.includes('log')) return db.emergencyScanLogs;
    return db.emergencyAlerts;
  }
  if (path.includes('market') || path.includes('marketplace')) {
    return db.marketItems;
  }
  if (path.includes('community/feed') || path.includes('feed')) {
    return db.communityPosts;
  }
  if (path.includes('community/chat') || path.includes('chat')) {
    return db.chatMessages;
  }
  if (path.includes('community/groups') || path.includes('group')) {
    if (path.includes('message')) return db.groupMessages;
    return db.groups;
  }
  if (path.includes('ledger')) {
    return db.ledger;
  }
  if (path.includes('journal')) {
    return db.journal;
  }
  if (path.includes('bank')) {
    return db.bank;
  }
  if (path.includes('asset')) {
    return db.assets;
  }
  if (path.includes('role')) {
    return db.roles;
  }
  if (path.includes('permission')) {
    return db.permissions;
  }
  if (path.includes('session')) {
    return db.sessions;
  }
  if (path.includes('guideline')) {
    return db.guidelines;
  }
  if (path.includes('incident')) {
    return db.incidents;
  }
  if (path.includes('patrol')) {
    return db.patrolling;
  }
  if (path.includes('wallet')) {
    if (path.includes('transaction')) return db.walletTransactions;
    return db.wallets;
  }
  if (path.includes('receipt')) {
    return db.societyDuesReceipts;
  }
  if (path.includes('settings')) {
    return db.settings;
  }
  if (path.includes('parking')) {
    if (path.includes('slot')) return db.parkingSlots || [
      { id: 'PS-1', slotNumber: 'P-101', type: 'Covered Car', unitNumber: 'A-205', status: 'Occupied', monthlyFee: 1500 },
      { id: 'PS-2', slotNumber: 'P-102', type: 'Open Car', unitNumber: 'B-101', status: 'Occupied', monthlyFee: 1000 },
      { id: 'PS-3', slotNumber: 'P-103', type: 'Two Wheeler', unitNumber: 'C-305', status: 'Available', monthlyFee: 500 }
    ];
    if (path.includes('payment')) return db.parkingPayments || [
      { id: 'PP-1', unitNumber: 'A-205', slotNumber: 'P-101', amount: 1500, month: 'June 2026', status: 'PAID' },
      { id: 'PP-2', unitNumber: 'B-101', slotNumber: 'P-102', amount: 1000, month: 'June 2026', status: 'PENDING' }
    ];
    return db.parkingSlots || [];
  }

  if (path.includes('property-lead') || path.includes('property-leads')) {
    if (!Array.isArray(db.propertyLeads)) {
      db.propertyLeads = [
        {
          id: 1,
          title: "3 BHK Luxury Flat in Tower A",
          category: "Flat",
          actionType: "Sell",
          city: "Mumbai",
          area: "Andheri West",
          address: "Tower A, Unit 205",
          size: 1600,
          budget: 18500000,
          bedrooms: 3,
          floor: 2,
          phone: "+91 98765 43210",
          status: "New Lead",
          createdAt: "2026-06-01T10:00:00.000Z"
        },
        {
          id: 2,
          title: "Commercial Shop for Rent in Main Market",
          category: "Shop",
          actionType: "Rent",
          city: "Mumbai",
          area: "Bandra",
          address: "Shop No 12, Main Gate",
          size: 450,
          budget: 45000,
          phone: "+91 98765 43211",
          status: "Contacted",
          createdAt: "2026-06-05T12:30:00.000Z"
        }
      ];
      saveMockDB(db);
    }
    return db.propertyLeads;
  }

  if (path.includes('rental-agreement') || path.includes('rental-agreements')) {
    if (!Array.isArray(db.rentalAgreements)) {
      db.rentalAgreements = [
        {
          id: 1,
          propertyType: "Flat",
          propertyAddress: "Tower A, Unit 205, Sharlow Bay",
          city: "Mumbai",
          area: "Andheri West",
          agreementType: "New",
          rentAmount: 35000,
          depositAmount: 100000,
          durationMonths: 11,
          startDate: "2026-07-01",
          ownerName: "Rajesh Kumar",
          tenantName: "John Doe",
          numberOfTenants: 2,
          status: "Completed",
          createdAt: "2026-06-01T10:00:00.000Z"
        },
        {
          id: 2,
          propertyType: "Shop",
          propertyAddress: "Shop No 4, Market Complex",
          city: "Mumbai",
          area: "Andheri West",
          agreementType: "Renewal",
          rentAmount: 50000,
          depositAmount: 200000,
          durationMonths: 22,
          startDate: "2026-08-01",
          ownerName: "Amit Sharma",
          tenantName: "Sneha Traders",
          numberOfTenants: 1,
          status: "Processing",
          createdAt: "2026-06-08T14:00:00.000Z"
        }
      ];
      saveMockDB(db);
    }
    return db.rentalAgreements;
  }

  if (path.includes('move-management') || path.includes('move')) {
    return db.moveInOut || [
      { id: 'MIO-1', residentName: 'John Doe', type: 'Move In', unit: 'B-101', date: new Date().toISOString(), status: 'Completed' },
      { id: 'MIO-2', residentName: 'Alice Bob', type: 'Move Out', unit: 'C-305', date: new Date().toISOString(), status: 'Approved' }
    ];
  }

  if (path.includes('purchase')) {
    if (path.includes('request')) return db.purchaseRequests || [
      { id: 'PR-1', title: 'CCTV Camera Replacement', category: 'Security', requestedBy: 'Admin', estimatedCost: 25000, status: 'APPROVED' },
      { id: 'PR-2', title: 'Gym Equipment Servicing', category: 'Maintenance', requestedBy: 'Committee', estimatedCost: 8000, status: 'PENDING' }
    ];
    if (path.includes('order')) return db.purchaseOrders || [
      { id: 'PO-1', poNumber: 'PO-2026-001', vendor: 'SecureTech Solutions', totalAmount: 25000, status: 'ISSUED', date: new Date().toISOString() }
    ];
    if (path.includes('receipt') || path.includes('gr')) return db.purchaseReceipts || [
      { id: 'GR-1', receiptNumber: 'GR-2026-001', poNumber: 'PO-2026-001', itemsReceived: '4x Hikvision HD Cameras', status: 'RECEIVED', date: new Date().toISOString() }
    ];
    return db.purchaseRequests || [];
  }

  if (path.includes('billing/config') || path.includes('billing-config')) {
    return {
      maintenanceRatePerSqFt: 3.5,
      waterFlatRate: 400,
      parkingCarRate: 1500,
      parkingTwoWheelerRate: 500,
      lateFeePercentage: 5,
      dueDateDay: 10
    };
  }

  if (path.includes('platform-invoices')) {
    return db.platformInvoices || [
      { id: 'PI-101', invoiceNumber: 'INV-2026-001', amount: 12000, plan: 'Society Premium Software', dueDate: '2026-06-30', status: 'PAID' }
    ];
  }

  if (path.includes('income-expense') || path.includes('accounting/income-expense')) {
    return {
      totalIncome: 520000,
      totalExpense: 120000,
      netSurplus: 400000,
      categories: [
        { name: 'Maintenance Dues', amount: 435000, type: 'INCOME' },
        { name: 'Parking Fees', amount: 24000, type: 'INCOME' },
        { name: 'Amenity Bookings', amount: 18000, type: 'INCOME' },
        { name: 'Security Staff Salary', amount: 65000, type: 'EXPENSE' },
        { name: 'Electricity & Water', amount: 35000, type: 'EXPENSE' },
        { name: 'Garden & Cleaning', amount: 20000, type: 'EXPENSE' }
      ]
    };
  }

  if (path.includes('trial-balance')) {
    return [
      { accountCode: '1001', accountName: 'Cash & Bank', debit: 450000, credit: 0 },
      { accountCode: '1002', accountName: 'Maintenance Dues Receivable', debit: 85000, credit: 0 },
      { accountCode: '2001', accountName: 'Vendor Accounts Payable', debit: 0, credit: 35000 },
      { accountCode: '3001', accountName: 'Society Reserve Fund', debit: 0, credit: 500000 }
    ];
  }

  if (path.includes('unit')) {
    if (path.includes('detail') || path.includes('resident/unit')) return db.unitData;
    return db.units;
  }
  if (path.includes('society') || path.includes('societies')) {
    return db.societies;
  }

  // Fallback for everything else
  return [];
}

// ----------------------------------------------------
// AXIOS CUSTOM ADAPTER SETUP
// ----------------------------------------------------
const mockAdapter = async (config: any) => {
  try {
    const { method = 'GET', url = '', data } = config;
    let bodyObj: any;
    try {
      bodyObj = data ? (typeof data === 'string' ? JSON.parse(data) : data) : undefined;
    } catch (e) {
      bodyObj = data;
    }
    const mockData = resolveStaticPath(url, method, bodyObj);
    const wrappedPayload = wrapPayloadWithData(mockData);

    return {
      data: wrappedPayload,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: {}
    };
  } catch (err: any) {
    return {
      data: { success: true, message: "Mock fallback response" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      request: {}
    };
  }
};

// ----------------------------------------------------
// AXIOS CLIENT EXPORT
// ----------------------------------------------------
const isMockMode = API_CONFIG.BASE_URL?.includes('mock://') || process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || '',
  headers: {
    "Content-Type": "application/json",
  },
  ...(isMockMode ? { adapter: mockAdapter } : {}),
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (err) {
        // silent parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const apiClient = api;
export default api;

// ----------------------------------------------------
// BROWSER FETCH INTERCEPTOR
// ----------------------------------------------------
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const url = input.toString();
    const method = init?.method || 'GET';

    // Skip Next.js internal routes, non-API requests, and real backend API calls
    const isNextInternal = url.includes('/_next/') || url.includes('/__next') || url.includes('webpack-hmr') || url.includes('hot-update') || url.includes('__nextjs') || url.includes('_rsc') || url.includes('.js') || url.includes('.css') || url.includes('.map') || url.includes('.ico') || url.includes('.png') || url.includes('.jpg') || url.includes('.svg') || url.includes('.woff');

    const isRealApiCall = url.includes('localhost:9000') || (url.includes('/api/') && !url.includes('mock://')) || (!isMockMode && (url.startsWith('http://') || url.startsWith('https://')));

    if (isNextInternal || isRealApiCall) {
      return originalFetch.apply(this, arguments as any);
    }

    try {
      let bodyParsed: any;
      try {
        bodyParsed = init?.body ? (typeof init.body === 'string' ? JSON.parse(init.body) : init.body) : undefined;
      } catch (e) {
        bodyParsed = init?.body;
      }
      
      const mockData = resolveStaticPath(url, method, bodyParsed);
      const wrappedPayload = wrapPayloadWithData(mockData);
      
      const res = new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      // Override res.json to return the wrapped payload directly
      res.json = async () => wrappedPayload;
      return res;
    } catch (err) {
      console.error("Global fetch mock error:", err);
      return originalFetch.apply(this, arguments as any);
    }
  };
}
