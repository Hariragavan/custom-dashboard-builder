import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleOrders = [
  {
    first_name: "John", last_name: "Smith", email: "john@example.com", phone: "555-0101",
    street_address: "123 Main St", city: "New York", state: "NY", postal_code: "10001", country: "United States",
    product: "Fiber Internet 300 Mbps", quantity: 2, unit_price: 49.99, total_amount: 99.98,
    status: "Completed", created_by: "Admin", order_date: new Date(Date.now() - 2 * 86400000)
  },
  {
    first_name: "Sarah", last_name: "Johnson", email: "sarah@example.com", phone: "555-0102",
    street_address: "456 Oak Avenue", city: "Los Angeles", state: "CA", postal_code: "90001", country: "United States",
    product: "5G Unlimited Mobile Plan", quantity: 1, unit_price: 79.99, total_amount: 79.99,
    status: "In progress", created_by: "Sales Rep 1", order_date: new Date(Date.now() - 5 * 86400000)
  },
  {
    first_name: "Michael", last_name: "Brown", email: "michael@example.com", phone: "555-0103",
    street_address: "789 Pine Road", city: "Chicago", state: "IL", postal_code: "60007", country: "United States",
    product: "Fiber Internet 1 Gbps", quantity: 1, unit_price: 99.99, total_amount: 99.99,
    status: "Pending", created_by: "Admin", order_date: new Date(Date.now() - 1 * 86400000)
  },
  {
    first_name: "Emily", last_name: "Davis", email: "emily@example.com", phone: "555-0104",
    street_address: "321 Elm Street", city: "Houston", state: "TX", postal_code: "77001", country: "United States",
    product: "Business Fiber 2 Gbps", quantity: 3, unit_price: 199.99, total_amount: 599.97,
    status: "Completed", created_by: "Sales Rep 2", order_date: new Date(Date.now() - 10 * 86400000)
  },
  {
    first_name: "David", last_name: "Wilson", email: "david@example.com", phone: "555-0105",
    street_address: "654 Ash Blvd", city: "Phoenix", state: "AZ", postal_code: "85001", country: "United States",
    product: "5G Unlimited Mobile Plan", quantity: 4, unit_price: 79.99, total_amount: 319.96,
    status: "Completed", created_by: "Admin", order_date: new Date()
  },
  {
    first_name: "Jessica", last_name: "Garcia", email: "jessica@example.com", phone: "555-0106",
    street_address: "987 Cedar Ln", city: "Philadelphia", state: "PA", postal_code: "19101", country: "United States",
    product: "Fiber Internet 300 Mbps", quantity: 1, unit_price: 49.99, total_amount: 49.99,
    status: "Pending", created_by: "Sales Rep 1", order_date: new Date(Date.now() - 15 * 86400000)
  },
  {
    first_name: "James", last_name: "Martinez", email: "james@example.com", phone: "555-0107",
    street_address: "147 Spruce Ct", city: "San Antonio", state: "TX", postal_code: "78201", country: "United States",
    product: "Fiber Internet 1 Gbps", quantity: 2, unit_price: 99.99, total_amount: 199.98,
    status: "In progress", created_by: "Sales Rep 2", order_date: new Date(Date.now() - 3 * 86400000)
  },
  {
    first_name: "Amanda", last_name: "Rodriguez", email: "amanda@example.com", phone: "555-0108",
    street_address: "258 Birch Way", city: "San Diego", state: "CA", postal_code: "92101", country: "United States",
    product: "Business Fiber 2 Gbps", quantity: 1, unit_price: 199.99, total_amount: 199.99,
    status: "Completed", created_by: "Admin", order_date: new Date(Date.now() - 20 * 86400000)
  }
];

const sampleDashboard = {
  widgets: [
    {
      id: "stat-revenue",
      type: "kpi",
      title: "Total Revenue ($)",
      metric: "total_amount",
      aggregation: "Sum",
      format: "Currency",
      precision: 2,
    },
    {
      id: "stat-orders",
      type: "kpi",
      title: "Total Orders Built",
      metric: "product",
      aggregation: "Count",
      format: "Number",
      precision: 0,
    },
    {
      id: "chart-sales",
      type: "bar",
      title: "Revenue by Product",
      xAxis: "product",
      yAxis: "total_amount",
      color: "#54bd95",
      showLabels: true,
    },
    {
      id: "chart-status",
      type: "pie",
      title: "Order Status Breakdown",
      dataField: "status",
      showLegend: true,
    },
    {
      id: "table-recent",
      type: "table",
      title: "Recent High-Value Orders",
      columns: ["first_name", "last_name", "product", "total_amount", "status"],
      pagination: 5,
      headerBgColor: "#54bd95",
      fontSize: "14",
    }
  ],
  layouts: {
    lg: [
      { i: "stat-revenue", x: 0, y: 0, w: 6, h: 2 },
      { i: "stat-orders", x: 6, y: 0, w: 6, h: 2 },
      { i: "chart-sales", x: 0, y: 2, w: 8, h: 6 },
      { i: "chart-status", x: 8, y: 2, w: 4, h: 6 },
      { i: "table-recent", x: 0, y: 8, w: 12, h: 6 }
    ]
  }
};

async function seed() {
  console.log('Seeding data...');
  
  // Clear existing
  await prisma.order.deleteMany();
  await prisma.dashboardLayout.deleteMany();

  console.log('Inserting orders...');
  for (const order of sampleOrders) {
    await prisma.order.create({ data: order });
  }

  console.log('Inserting dashboard layout...');
  await prisma.dashboardLayout.create({
    data: { layout_json: sampleDashboard }
  });

  console.log('Seeding complete! 🚀');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
