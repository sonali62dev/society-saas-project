const prisma = require('../lib/prisma');

class AmenityController {
  static async list(req, res) {
    try {
      const where = {};
      if (req.user && req.user.role !== 'SUPER_ADMIN' && req.user.societyId) {
        where.societyId = req.user.societyId;
      }
      let amenities = await prisma.amenity.findMany({
        where,
        orderBy: { name: 'asc' }
      });

      // Auto-seed default amenities if society currently has none
      if (amenities.length === 0 && req.user && req.user.societyId) {
        const defaultAmenities = [
          { name: 'Club House', type: 'hall', description: 'Multipurpose luxury clubhouse for celebrations and indoor gatherings', capacity: 150, chargesPerHour: 500, societyId: req.user.societyId },
          { name: 'Swimming Pool', type: 'pool', description: 'Olympic size temperature-controlled swimming pool with toddler splash zone', capacity: 30, chargesPerHour: 0, societyId: req.user.societyId },
          { name: 'Gym & Fitness Center', type: 'gym', description: 'State-of-the-art gym with modern cardio & strength training equipment', capacity: 25, chargesPerHour: 0, societyId: req.user.societyId },
          { name: 'Community Hall', type: 'hall', description: 'Air-conditioned hall for society meetings, cultural events, and festivals', capacity: 200, chargesPerHour: 1000, societyId: req.user.societyId },
          { name: 'Party Lawn', type: 'hall', description: 'Lush green open lawn suitable for outdoor parties, receptions & dinners', capacity: 300, chargesPerHour: 1500, societyId: req.user.societyId },
          { name: 'Sports Area & Badminton Court', type: 'court', description: 'Synthetic indoor court for badminton, table tennis, and sports training', capacity: 20, chargesPerHour: 200, societyId: req.user.societyId },
        ];
        try {
          await prisma.amenity.createMany({ data: defaultAmenities });
          amenities = await prisma.amenity.findMany({ where, orderBy: { name: 'asc' } });
        } catch (_) {}
      }

      res.json(amenities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const {
        name,
        description,
        chargesPerHour,
        societyId,
        type,
        capacity,
        availableDays,
        timings,
        status
      } = req.body;

      const amenity = await prisma.amenity.create({
        data: {
          name,
          description,
          chargesPerHour: parseFloat(chargesPerHour || 0),
          societyId: parseInt(societyId || req.user.societyId),
          type: type || 'other',
          capacity: parseInt(capacity || 0),
          availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          timings: timings || { start: '09:00', end: '22:00' },
          status: status || 'available'
        }
      });
      res.status(201).json(amenity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      if (data.chargesPerHour !== undefined) data.chargesPerHour = parseFloat(data.chargesPerHour);
      if (data.capacity !== undefined) data.capacity = parseInt(data.capacity);
      if (data.societyId !== undefined) data.societyId = parseInt(data.societyId);

      const amenity = await prisma.amenity.update({
        where: { id: parseInt(id) },
        data: data
      });
      res.json(amenity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.amenity.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Amenity deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AmenityController;
