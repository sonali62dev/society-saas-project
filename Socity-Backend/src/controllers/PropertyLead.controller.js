// Socity-Backend/src/controllers/PropertyLead.controller.js

let leadsStore = [
  {
    id: 1,
    title: '3BHK Luxury Apartment for Sale',
    description: 'Corner flat with sea view, 2 parking slots, fully modular kitchen, high ceiling.',
    category: 'Flat',
    actionType: 'Sell',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Flat 1402, Building A, Sharlow Bay Community',
    size: 1450,
    budget: 24000000,
    bedrooms: 3,
    floor: 14,
    phone: '9876500010',
    email: 'admin@society.com',
    status: 'New Lead',
    societyId: 1,
    userId: '1',
    userName: 'Vikram Malhotra',
    userRole: 'admin',
    createdAt: new Date().toISOString(),
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop' }
    ]
  },
  {
    id: 2,
    title: 'Commercial Gala / Warehouse for Rent',
    description: 'Road facing gala suitable for cloud kitchen, logistics or retail showroom.',
    category: 'Gala',
    actionType: 'Rent',
    city: 'Mumbai',
    area: 'Bandra East',
    address: 'Gala 5, Industrial Estate',
    size: 800,
    budget: 75000,
    bedrooms: 0,
    floor: 1,
    phone: '9876543210',
    email: 'resident@society.com',
    status: 'Contacted',
    societyId: 1,
    userId: '2',
    userName: 'Rajesh Kumar',
    userRole: 'resident',
    createdAt: new Date().toISOString(),
    media: []
  }
];

let nextId = 3;

class PropertyLeadController {
  static async list(req, res) {
    try {
      const societyId = req.user.societyId ? parseInt(req.user.societyId) : null;
      let filtered = leadsStore;
      if (req.user.role !== 'SUPER_ADMIN' && societyId) {
        filtered = leadsStore.filter(l => l.societyId === societyId);
      }
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;
      const lead = leadsStore.find(l => l.id === parseInt(id));
      if (!lead) return res.status(404).json({ error: 'Property lead not found' });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const {
        title, description, category, actionType, city, area, address,
        size, budget, bedrooms, floor, phone, email, images
      } = req.body;

      if (!title || !category || !actionType || !city || !area) {
        return res.status(400).json({ error: 'Title, Category, Action Type, City, and Area are required' });
      }

      const newLead = {
        id: nextId++,
        title,
        description: description || '',
        category: category || 'Flat',
        actionType: actionType || 'Sell',
        city: city || '',
        area: area || '',
        address: address || '',
        size: size ? parseFloat(size) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        floor: floor ? parseInt(floor) : undefined,
        phone: phone || req.user.phone || '9876543210',
        email: email || req.user.email || '',
        status: 'New Lead',
        societyId: req.user.societyId ? parseInt(req.user.societyId) : 1,
        userId: req.user.id ? req.user.id.toString() : '1',
        userName: req.user.name || 'User',
        userRole: req.user.role || 'resident',
        createdAt: new Date().toISOString(),
        media: (images && Array.isArray(images)) ? images.map((img, i) => ({ id: i + 1, url: img })) : []
      };

      leadsStore.unshift(newLead);
      res.status(201).json(newLead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const index = leadsStore.findIndex(l => l.id === parseInt(id));
      if (index === -1) return res.status(404).json({ error: 'Property lead not found' });

      const updated = {
        ...leadsStore[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      leadsStore[index] = updated;
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;
      leadsStore = leadsStore.filter(l => l.id !== parseInt(id));
      res.json({ message: 'Property lead deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = leadsStore.find(l => l.id === parseInt(id));
      if (!lead) return res.status(404).json({ error: 'Property lead not found' });

      lead.status = status || lead.status;
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PropertyLeadController;
