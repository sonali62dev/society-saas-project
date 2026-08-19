/** PIN Code length for customer/individual (configurable via NEXT_PUBLIC_PIN_CODE_LENGTH, default 6). */
export const PIN_CODE_LENGTH = parseInt(
  process.env.NEXT_PUBLIC_PIN_CODE_LENGTH || "6",
  10,
);

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api",


  // Authentication & Users
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    UPDATE_PROFILE: "/auth/profile",
    UPLOAD_PHOTO: "/auth/profile/photo",
    ALL_USERS: "/auth/all",
    STATS: "/auth/stats",
    B2C_STATS: "/auth/b2c-stats",
    USER_ACTIVITY: (id: number | string) => `/auth/${id}/activity`,
    DELETE_USER: (id: number | string) => `/auth/${id}`,
    UPDATE_STATUS: (id: number | string) => `/auth/${id}/status`,
  },

  // Society Management
  SOCIETY: {
    LIST: "/society",
    CREATE: "/society",
    UPDATE: (id: number | string) => `/society/${id}`,
    DELETE: (id: number | string) => `/society/${id}`,
    GET: (id: number | string) => `/society/${id}`,
    ALL: "/society/all",
    MEMBERS: "/society/members",
    ADMIN_STATS: "/society/admin-dashboard-stats",
  },

  // Units
  UNIT: {
    LIST: "/units",
    GET: (id: number | string) => `/units/${id}`,
    CREATE: "/units",
    UPDATE: (id: number | string) => `/units/${id}`,
    DELETE: (id: number | string) => `/units/${id}`,
  },

  // Residents Directory
  RESIDENT: {
    LIST: "/society/members",
    DIRECTORY: "/society/members?type=directory",
    UPDATE: (id: number | string) => `/society/members/${id}`,
    DELETE: (id: number | string) => `/society/members/${id}`,
  },

  // Complaints / Helpdesk
  COMPLAINT: {
    LIST: "/complaints",
    CREATE: "/complaints",
    CREATE_AGAINST_VENDOR: "/complaints/against-vendor",
    STATS: "/complaints/stats",
    GET: (id: number | string) => `/complaints/${id}`,
    UPDATE_STATUS: (id: number | string) => `/complaints/${id}/status`,
    ASSIGN: (id: number | string) => `/complaints/${id}/assign`,
    ADD_COMMENT: (id: number | string) => `/complaints/${id}/comments`,
  },

  // Visitors & Security
  VISITOR: {
    LIST: "/visitors",
    CREATE: "/visitors",
    GET: (id: number | string) => `/visitors/${id}`,
    UPDATE_STATUS: (id: number | string) => `/visitors/${id}/status`,
    LOGS: "/visitors/logs",
  },

  // Parking
  PARKING: {
    SLOTS: "/parking",
    CREATE: "/parking",
    UPDATE: (id: number | string) => `/parking/${id}`,
    DELETE: (id: number | string) => `/parking/${id}`,
    PAYMENTS: "/parking/payments",
  },

  // Vehicles
  VEHICLE: {
    LIST: "/vehicles",
    STATS: "/vehicles/stats",
    REGISTER: "/vehicles/register",
    SEARCH: "/vehicles/search",
    REMOVE: (id: number | string) => `/vehicles/${id}`,
  },

  // Parcels
  PARCEL: {
    LIST: "/parcels",
    GET: (id: number | string) => `/parcels/${id}`,
    CREATE: "/parcels",
    UPDATE_STATUS: (id: number | string) => `/parcels/${id}/status`,
    DELETE: (id: number | string) => `/parcels/${id}`,
  },

  // Staff (Guards & Maids)
  STAFF: {
    LIST: "/staff",
    GUARDS: "/staff/guards",
    MAIDS: "/staff/maids",
    CREATE: "/staff",
    UPDATE_STATUS: (id: number | string) => `/staff/${id}/status`,
    DELETE: (id: number | string) => `/staff/${id}`,
  },

  // Amenities
  AMENITY: {
    LIST: "/amenities",
    GET: (id: number | string) => `/amenities/${id}`,
    CREATE: "/amenities",
    UPDATE: (id: number | string) => `/amenities/${id}`,
    DELETE: (id: number | string) => `/amenities/${id}`,
    BOOKINGS: "/amenities/bookings/all",
    BOOK: "/amenities/bookings",
    UPDATE_BOOKING: (id: string | number) => `/amenities/bookings/${id}`,
  },

  // Notices
  NOTICE: {
    LIST: "/notices",
    GET: (id: number | string) => `/notices/${id}`,
    CREATE: "/notices",
    UPDATE: (id: number | string) => `/notices/${id}`,
    DELETE: (id: number | string) => `/notices/${id}`,
  },

  // Events
  EVENT: {
    LIST: "/events",
    GET: (id: number | string) => `/events/${id}`,
    CREATE: "/events",
    UPDATE: (id: number | string) => `/events/${id}`,
    DELETE: (id: number | string) => `/events/${id}`,
    RSVP: (id: number | string) => `/events/${id}/rsvp`,
    GET_ATTENDEES: (id: number | string) => `/events/${id}/attendees`,
  },

  // Meetings
  MEETING: {
    LIST: "/meetings",
    GET: (id: number | string) => `/meetings/${id}`,
    CREATE: "/meetings",
    UPDATE: (id: number | string) => `/meetings/${id}`,
    DELETE: (id: number | string) => `/meetings/${id}`,
  },

  // Assets
  ASSET: {
    LIST: "/assets",
    STATS: "/assets/stats",
    GET: (id: number | string) => `/assets/${id}`,
    CREATE: "/assets",
    UPDATE: (id: number | string) => `/assets/${id}`,
    DELETE: (id: number | string) => `/assets/${id}`,
  },

  // Documents
  DOCUMENT: {
    LIST: "/documents",
    GET: (id: number | string) => `/documents/${id}`,
    CREATE: "/documents",
    DELETE: (id: number | string) => `/documents/${id}`,
  },

  // Vendors
  VENDOR: {
    LIST: "/vendors",
    STATS: "/vendors/stats",
    GET: (id: number | string) => `/vendors/${id}`,
    CREATE: "/vendors",
    UPDATE: (id: number | string) => `/vendors/${id}`,
    UPDATE_STATUS: (id: number | string) => `/vendors/${id}/status`,
    DELETE: (id: number | string) => `/vendors/${id}`,
    RENEW: (id: number | string) => `/vendors/${id}/renew`,
    RATE: (id: number | string) => `/vendors/${id}/rate`,
    PAYMENTS: (id: number | string) => `/vendors/${id}/payments`,
  },

  // Vendor Payouts
  PAYOUT: {
    LIST: "/vendor-payouts",
    UPDATE_STATUS: (id: number | string) => `/vendor-payouts/${id}/status`,
  },

  // Transactions / Accounting
  TRANSACTION: {
    LIST: "/transactions",
    CREATE: "/transactions",
    GET: (id: number | string) => `/transactions/${id}`,
    UPDATE: (id: number | string) => `/transactions/${id}`,
    DELETE: (id: number | string) => `/transactions/${id}`,
    STATS: "/transactions/stats",
  },

  // Emergency
  EMERGENCY: {
    LOGS: "/emergency/logs",
    BARCODES: "/emergency/barcodes",
    UPDATE_BARCODE_STATUS: (id: string) => `/emergency/barcodes/${id}/status`,
    RESET_BARCODES: "/emergency/barcodes/reset",
    // Alerts
    CREATE_ALERT: "/emergency/alerts",
    LIST_ALERTS: "/emergency/alerts",
    GET_ALERT: (id: number | string) => `/emergency/alerts/${id}`,
    RESOLVE_ALERT: (id: number | string) => `/emergency/alerts/${id}/resolve`,
    // Contacts
    LIST_CONTACTS: "/emergency/contacts",
    ADD_CONTACT: "/emergency/contacts",
    UPDATE_CONTACT: (id: number | string) => `/emergency/contacts/${id}`,
    DELETE_CONTACT: (id: number | string) => `/emergency/contacts/${id}`,
  },

  // Services
  SERVICE: {
    CATEGORIES: "/services/categories",
    CATEGORY_DETAILS: (id: string) => `/services/categories/${id}`,
    INQUIRIES: "/services/inquiries",
    ASSIGN_VENDOR: (id: string) => `/services/inquiries/${id}/assign`,
    PAYMENT_DETAILS: (id: number | string) =>
      `/services/inquiries/${id}/payment-details`,
    INITIATE_PAYMENT: (id: number | string) =>
      `/services/inquiries/${id}/initiate-payment`,
    UPDATE_PAYMENT_STATUS: (id: number | string) =>
      `/services/inquiries/${id}/payment-status`,
  },

  // Billing
  BILLING: {
    INVOICES: "/invoices",
    MY_INVOICES: "/invoices/my",
    GENERATE: "/invoices/generate",
    FINALIZE: "/invoices/finalize",
    APPLY_LATE_FEES: "/invoices/apply-late-fees",
    STATS: "/invoices/stats",
    DEFAULTERS: "/invoices/defaulters",
    DEFAULTER_STATS: "/invoices/defaulters/stats",
    PAY: (no: string) => `/invoices/${no}/pay`,
    PLATFORM_INVOICES: "/platform-invoices",
  },

  // Facility Requests
  FACILITY_REQUEST: {
    LIST: "/facility-requests",
    CREATE: "/facility-requests",
    STATS: "/facility-requests/stats",
    UPDATE_STATUS: (id: number | string) => `/facility-requests/${id}/status`,
    VOTE: (id: number | string) => `/facility-requests/${id}/vote`,
  },

  // Reports
  REPORT: {
    PLATFORM_STATS: "/reports/platform-stats",
    SOCIETY_STATS: "/reports/society-stats",
  },

  // Tenants
  TENANT: {
    LIST: "/tenants",
    STATS: "/tenants/stats",
    CREATE: "/tenants",
    UPDATE: (id: number | string) => `/tenants/${id}`,
    DELETE: (id: number | string) => `/tenants/${id}`,
  },

  // Guard Dashboard
  GUARD: {
    STATS: "/guard/stats",
    ACTIVITY: "/guard/activity",
  },
};

export const API_URL = API_CONFIG.BASE_URL;