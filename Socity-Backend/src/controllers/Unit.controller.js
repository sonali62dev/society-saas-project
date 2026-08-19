const prisma = require('../lib/prisma');

class UnitController {
  static async list(req, res) {
    try {
      const where = {};
      if (req.user.role !== 'SUPER_ADMIN') {
        where.societyId = req.user.societyId;
      }
      const units = await prisma.unit.findMany({
        where,
        include: { owner: true, tenant: true },
        orderBy: [{ block: 'asc' }, { number: 'asc' }]
      });
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
       const { id } = req.params;
       const unit = await prisma.unit.findUnique({
           where: { id: parseInt(id) },
           include: { owner: true, tenant: true, parkingSlots: true, visitors: true }
       });
       if (!unit) return res.status(404).json({ error: 'Unit not found' });
       if (req.user.role !== 'SUPER_ADMIN' && unit.societyId !== req.user.societyId) {
         return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
       }
       res.json(unit);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { block, number, floor, type, areaSqFt, societyId } = req.body;
      const finalSocietyId = parseInt(societyId || req.user.societyId);
      
      if (!finalSocietyId) {
        return res.status(400).json({ error: 'Society ID is required' });
      }

      // Check if unit already exists (same block + number in same society)
      const existing = await prisma.unit.findFirst({
        where: {
          block: String(block),
          number: String(number),
          societyId: finalSocietyId
        }
      });

      if (existing) {
        return res.status(400).json({ error: `Unit ${block}-${number} already exists in this society` });
      }

      const unit = await prisma.unit.create({
        data: {
          block: String(block),
          number: String(number),
          floor: floor ? parseInt(floor) : null,
          type: type || 'APARTMENT',
          areaSqFt: areaSqFt ? parseFloat(areaSqFt) : 1000.0,
          society: { connect: { id: finalSocietyId } }
        }
      });
      res.status(201).json(unit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await prisma.unit.findUnique({ where: { id: parseInt(id) } });
      if (!existing) return res.status(404).json({ error: 'Unit not found' });
      if (req.user.role !== 'SUPER_ADMIN' && existing.societyId !== req.user.societyId) {
        return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
      }
      const unit = await prisma.unit.update({
        where: { id: parseInt(id) },
        data: req.body
      });
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await prisma.unit.findUnique({ where: { id: parseInt(id) } });
      if (!existing) return res.status(404).json({ error: 'Unit not found' });
      if (req.user.role !== 'SUPER_ADMIN' && existing.societyId !== req.user.societyId) {
        return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
      }
      await prisma.unit.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Unit deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUnitMembers(req, res) {
    try {
      const { unitId } = req.params;
      const unit = await prisma.unit.findUnique({ where: { id: parseInt(unitId) } });
      if (!unit) return res.status(404).json({ error: 'Unit not found' });
      if (req.user.role !== 'SUPER_ADMIN' && unit.societyId !== req.user.societyId) {
        return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
      }
      const members = await prisma.unitMember.findMany({
        where: { unitId: parseInt(unitId) }
      });
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addUnitMember(req, res) {
    try {
      const { unitId } = req.params;
      const { name, relation, age, gender, phone, email } = req.body;
      const unit = await prisma.unit.findUnique({ where: { id: parseInt(unitId) } });
      if (!unit) return res.status(404).json({ error: 'Unit not found' });
      if (req.user.role !== 'SUPER_ADMIN' && unit.societyId !== req.user.societyId) {
        return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
      }
      const member = await prisma.unitMember.create({
        data: {
          unitId: parseInt(unitId),
          name,
          relation: relation || 'FAMILY',
          age: age ? parseInt(age) : null,
          gender,
          phone,
          email
        }
      });
      await prisma.unit.update({
        where: { id: parseInt(unitId) },
        data: { membersCount: { increment: 1 } }
      });
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUnitMember(req, res) {
    try {
      const { unitId, memberId } = req.params;
      const unit = await prisma.unit.findUnique({ where: { id: parseInt(unitId) } });
      if (!unit) return res.status(404).json({ error: 'Unit not found' });
      if (req.user.role !== 'SUPER_ADMIN' && unit.societyId !== req.user.societyId) {
        return res.status(403).json({ error: 'Access denied: unit belongs to another society' });
      }
      await prisma.unitMember.delete({ where: { id: parseInt(memberId) } });
      await prisma.unit.update({
        where: { id: parseInt(unitId) },
        data: { membersCount: { decrement: 1 } }
      }).catch(() => null);
      res.json({ message: 'Family member removed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UnitController;
