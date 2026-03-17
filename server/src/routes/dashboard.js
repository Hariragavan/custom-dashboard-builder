import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET latest dashboard layout
router.get('/layout', async (req, res) => {
  try {
    const layout = await prisma.dashboardLayout.findFirst({
      orderBy: { created_at: 'desc' }
    });
    res.json(layout || { layout_json: { widgets: [], layouts: {} } });
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Failed to fetch layout' });
  }
});

// POST save/update dashboard layout
router.post('/layout', async (req, res) => {
  try {
    const existing = await prisma.dashboardLayout.findFirst({
      orderBy: { created_at: 'desc' }
    });

    let layout;
    if (existing) {
      layout = await prisma.dashboardLayout.update({
        where: { id: existing.id },
        data: { layout_json: req.body.layout_json }
      });
    } else {
      layout = await prisma.dashboardLayout.create({
        data: { layout_json: req.body.layout_json }
      });
    }
    res.json(layout);
  } catch (error) {
    console.error('Error saving layout:', error);
    res.status(500).json({ error: 'Failed to save layout' });
  }
});

export default router;
