const prisma = require('../lib/prisma');

class BillingPlanController {
  static async listPlans(req, res) {
    try {
      const plans = await prisma.billingPlan.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createPlan(req, res) {
    try {
      const { name, type, planType, price, description, features, status } = req.body;
      const featuresStr = Array.isArray(features) ? JSON.stringify(features) : (features != null ? String(features) : null);
      const plan = await prisma.billingPlan.create({
        data: {
          name,
          type,
          planType: planType?.toUpperCase() || 'BASIC',
          price: String(price ?? ''),
          description,
          features: featuresStr,
          status: status || 'active'
        }
      });
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const { name, type, planType, price, description, features, status } = req.body;
      const featuresStr = features !== undefined ? (Array.isArray(features) ? JSON.stringify(features) : (features != null ? String(features) : null)) : undefined;
      const plan = await prisma.billingPlan.update({
        where: { id: parseInt(id) },
        data: {
          name,
          type,
          planType: planType?.toUpperCase(),
          price: price !== undefined ? String(price) : undefined,
          description,
          features: featuresStr,
          status
        }
      });
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePlan(req, res) {
    try {
      const { id } = req.params;
      await prisma.billingPlan.delete({
        where: { id: parseInt(id) }
      });
      res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BillingPlanController;
