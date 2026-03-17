import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const order = await prisma.order.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        country: req.body.country,
        product: req.body.product,
        quantity: parseInt(req.body.quantity) || 1,
        unit_price: parseFloat(req.body.unit_price) || 0,
        total_amount: parseFloat(req.body.total_amount) || 0,
        status: req.body.status || 'Pending',
        created_by: req.body.created_by,
        order_date: new Date(),
      }
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        country: req.body.country,
        product: req.body.product,
        quantity: parseInt(req.body.quantity) || 1,
        unit_price: parseFloat(req.body.unit_price) || 0,
        total_amount: parseFloat(req.body.total_amount) || 0,
        status: req.body.status,
        created_by: req.body.created_by,
      }
    });
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id }
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
