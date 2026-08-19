// User & Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'community-manager' | 'resident' | 'guard' | 'committee' | 'vendor' | 'individual'
  societyId?: string | number
  avatar?: string
  phone?: string
  unit?: string
  pinCode?: string
  society?: Society
  createdAt: Date
  updatedAt: Date
}

export interface Society {
  id: number
  name: string
  code: string
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  status: string
  subscriptionPlan: string
  isPaid: boolean
  discount: number
  billingPlanId: number | null
  billingPlan?: BillingPlan
  expectedUnits: number
  createdAt: string
  updatedAt: string
}

export interface BillingPlan {
  id: number
  name: string
  price: number
  planType: string
  status: string
}

// Dashboard Types
export interface DashboardStats {
  totalResidents: number
  totalDues: number
  pendingComplaints: number
  visitorToday: number
  collectionRate: number
  occupancyRate: number
}

// Financial Types
export interface Invoice {
  id: string
  invoiceNumber: string
  patientId: string
  patientName: string
  amount: number
  dueDate: Date
  status: 'paid' | 'pending' | 'overdue'
  items: InvoiceItem[]
  createdAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: 'online' | 'cash' | 'cheque' | 'upi'
  transactionId?: string
  date: Date
  status: 'success' | 'pending' | 'failed'
}

// Visitor Management Types
export interface Visitor {
  id: string
  name: string
  phone: string
  purpose: string
  visitingUnit: string
  entryTime: Date
  exitTime?: Date
  photo?: string
  qrCode?: string
  vehicleNumber?: string
  status: 'pending' | 'approved' | 'checked-in' | 'checked-out' | 'rejected'
}

// Amenity Types
export interface Amenity {
  id: string
  name: string
  type: 'hall' | 'gym' | 'pool' | 'court' | 'park'
  capacity: number
  pricePerHour: number
  availableDays: string[]
  timings: { start: string; end: string }
  image?: string
  status: 'available' | 'maintenance' | 'booked'
}

export interface Booking {
  id: string
  amenityId: string
  userId: string
  date: Date
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  amount: number
  paymentStatus: 'paid' | 'pending'
}

// Complaint Types
export interface Complaint {
  id: string
  title: string
  description: string
  category: 'maintenance' | 'security' | 'cleanliness' | 'noise' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  reportedBy: string
  assignedTo?: string
  unit: string
  images?: string[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

// Notice Types
export interface Notice {
  id: string
  title: string
  content: string
  type: 'announcement' | 'emergency' | 'event' | 'maintenance'
  priority: 'low' | 'medium' | 'high'
  publishedBy: string
  publishedAt: Date
  expiresAt?: Date
  attachments?: string[]
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  type: 'festival' | 'meeting' | 'activity' | 'maintenance'
  date: Date
  startTime: string
  endTime: string
  venue: string
  organizer: string
  capacity?: number
  registrations?: number
  image?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

// Asset Types
export interface Asset {
  id: string
  name: string
  category: string
  location: string
  purchaseDate: Date
  purchasePrice: number
  currentValue: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  qrCode: string
  maintenanceSchedule?: Date
  images?: string[]
}

// Vendor Types
export interface Vendor {
  id: string
  name: string
  category: 'plumber' | 'electrician' | 'carpenter' | 'cleaner' | 'security' | 'other'
  contact: string
  email?: string
  rating: number
  status: 'active' | 'inactive'
  servicesProvided: string[]
  ownerType: 'super_admin' | 'admin'
  vendorType: 'platform' | 'self'
}

// Tenant Types
export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  unit: string
  block: string
  floor: string
  ownerName: string
  ownerPhone: string
  leaseStartDate: Date
  leaseEndDate: Date
  rentAmount: number
  securityDeposit: number
  maintenanceCharges: number
  parkingSlot?: string
  vehicleNumber?: string
  familyMembers: number
  status: 'active' | 'inactive' | 'notice_period'
  documents?: string[]
  emergencyContact?: string
  createdAt: Date
  updatedAt: Date
}

// Parking Types
export interface ParkingSlot {
  id: string
  slotNumber: string
  type: 'two_wheeler' | 'four_wheeler' | 'reserved' | 'visitor'
  block: string
  floor: string
  assignedTo?: string
  assignedUnit?: string
  vehicleNumber?: string
  monthlyCharge: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  createdAt: Date
}

export interface ParkingPayment {
  id: string
  slotId: string
  tenantId?: string
  ownerId?: string
  amount: number
  month: string
  year: number
  paymentDate?: Date
  dueDate: Date
  status: 'paid' | 'pending' | 'overdue'
  paymentMethod?: 'online' | 'cash' | 'cheque' | 'upi'
  transactionId?: string
}

// Income & Expense Types
export interface Income {
  id: string
  category: 'maintenance' | 'parking' | 'amenity' | 'penalty' | 'deposit' | 'event' | 'other'
  description: string
  amount: number
  date: Date
  receivedFrom: string
  unit?: string
  paymentMethod: 'online' | 'cash' | 'cheque' | 'upi'
  transactionId?: string
  status: 'received' | 'pending'
}

export interface Expense {
  id: string
  category: 'salary' | 'utilities' | 'maintenance' | 'security' | 'housekeeping' | 'repairs' | 'vendor' | 'other'
  description: string
  amount: number
  date: Date
  paidTo: string
  vendorId?: string
  invoiceNumber?: string
  paymentMethod: 'online' | 'cash' | 'cheque' | 'upi'
  status: 'paid' | 'pending' | 'approved'
  approvedBy?: string
}

// Vendor Payment Types
export interface VendorPayment {
  id: string
  vendorId: string
  vendorName: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate: Date
  amount: number
  gstAmount: number
  totalAmount: number
  description: string
  category: string
  paymentDate?: Date
  paymentMethod?: 'online' | 'cash' | 'cheque' | 'upi'
  status: 'pending' | 'approved' | 'paid' | 'rejected'
  approvedBy?: string
  remarks?: string
}
