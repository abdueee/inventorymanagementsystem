import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data (order matters for FK constraints)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Electronics" } }),
    prisma.category.create({ data: { name: "Furniture" } }),
    prisma.category.create({ data: { name: "Tools" } }),
    prisma.category.create({ data: { name: "Office Supplies" } }),
    prisma.category.create({ data: { name: "Medical Supplies" } }),
  ]);
  const [electronics, furniture, tools, office, medical] = categories;
  console.log(`Created ${categories.length} categories`);

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({ data: { name: "Warehouse A" } }),
    prisma.location.create({ data: { name: "Warehouse B" } }),
    prisma.location.create({ data: { name: "Store Front" } }),
    prisma.location.create({ data: { name: "Loading Dock" } }),
    prisma.location.create({ data: { name: "Cold Storage" } }),
  ]);
  const [warehouseA, warehouseB, storeFront, loadingDock, coldStorage] = locations;
  console.log(`Created ${locations.length} locations`);

  // Get or create a seed user (needed for createdById FK)
  let seedUser = await prisma.user.findFirst();
  if (!seedUser) {
    seedUser = await prisma.user.create({
      data: {
        id: "seed-admin-user",
        name: "Admin User",
        email: "admin@trackventory.com",
        role: "admin",
      },
    });
    console.log("Created seed admin user");
  }

  // Create products
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        name: "4K Monitor 27\"",
        description: "Ultra HD IPS display with USB-C connectivity",
        sku: "ELEC-004",
        quantity: 32,
        price: 549.99,
        reorderThreshold: 5,
        categoryId: electronics.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Wireless Keyboard",
        description: "Bluetooth mechanical keyboard with backlight",
        sku: "ELEC-001",
        quantity: 45,
        price: 79.99,
        reorderThreshold: 10,
        categoryId: electronics.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with adjustable DPI",
        sku: "ELEC-002",
        quantity: 58,
        price: 39.99,
        reorderThreshold: 15,
        categoryId: electronics.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C Hub 7-Port",
        description: "Multi-port adapter with HDMI, USB-A, and SD card reader",
        sku: "ELEC-003",
        quantity: 8,
        price: 45.99,
        reorderThreshold: 15,
        categoryId: electronics.id,
        locationId: warehouseB.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Laptop Stand",
        description: "Adjustable aluminum laptop stand",
        sku: "ELEC-005",
        quantity: 25,
        price: 34.99,
        reorderThreshold: 8,
        categoryId: electronics.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Webcam HD 1080p",
        description: "Full HD webcam with built-in microphone",
        sku: "ELEC-006",
        quantity: 42,
        price: 64.99,
        reorderThreshold: 10,
        categoryId: electronics.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),

    // Furniture
    prisma.product.create({
      data: {
        name: "Standing Desk 60\"",
        description: "Electric height-adjustable standing desk",
        sku: "FURN-001",
        quantity: 3,
        price: 699.99,
        reorderThreshold: 5,
        categoryId: furniture.id,
        locationId: warehouseB.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ergonomic Office Chair",
        description: "Mesh back office chair with lumbar support",
        sku: "FURN-002",
        quantity: 18,
        price: 449.99,
        reorderThreshold: 8,
        categoryId: furniture.id,
        locationId: warehouseB.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Filing Cabinet 3-Drawer",
        description: "Steel filing cabinet with lock",
        sku: "FURN-003",
        quantity: 12,
        price: 189.99,
        reorderThreshold: 5,
        categoryId: furniture.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Adjustable Bookshelf",
        description: "5-tier adjustable wooden bookshelf",
        sku: "FURN-004",
        quantity: 7,
        price: 149.99,
        reorderThreshold: 10,
        categoryId: furniture.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),

    // Tools
    prisma.product.create({
      data: {
        name: "Power Drill Kit",
        description: "20V cordless drill with 30-piece bit set",
        sku: "TOOL-001",
        quantity: 15,
        price: 129.99,
        reorderThreshold: 5,
        categoryId: tools.id,
        locationId: loadingDock.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Adjustable Wrench Set",
        description: "6-piece chrome vanadium wrench set",
        sku: "TOOL-002",
        quantity: 6,
        price: 89.99,
        reorderThreshold: 8,
        categoryId: tools.id,
        locationId: warehouseB.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Safety Gloves (Pair)",
        description: "Cut-resistant work gloves, size L",
        sku: "TOOL-003",
        quantity: 2,
        price: 24.99,
        reorderThreshold: 10,
        categoryId: tools.id,
        locationId: loadingDock.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Construction Hard Hat",
        description: "OSHA-compliant hard hat with adjustable suspension",
        sku: "TOOL-004",
        quantity: 14,
        price: 34.99,
        reorderThreshold: 5,
        categoryId: tools.id,
        locationId: loadingDock.id,
        createdById: seedUser.id,
      },
    }),

    // Office Supplies
    prisma.product.create({
      data: {
        name: "Printer Paper (A4, 500 sheets)",
        description: "80gsm white printer paper",
        sku: "OFFC-001",
        quantity: 120,
        price: 8.99,
        reorderThreshold: 20,
        categoryId: office.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "A4 Copy Paper (Box/5 Reams)",
        description: "Premium copy paper, 5 reams per box",
        sku: "OFFC-002",
        quantity: 4,
        price: 35.99,
        reorderThreshold: 10,
        categoryId: office.id,
        locationId: warehouseA.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Whiteboard Markers (12-Pack)",
        description: "Assorted colors dry-erase markers",
        sku: "OFFC-003",
        quantity: 35,
        price: 12.99,
        reorderThreshold: 10,
        categoryId: office.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ballpoint Pens (50-Pack)",
        description: "Blue ink ballpoint pens",
        sku: "OFFC-004",
        quantity: 62,
        price: 9.99,
        reorderThreshold: 15,
        categoryId: office.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),

    // Medical Supplies
    prisma.product.create({
      data: {
        name: "First Aid Kit (Large)",
        description: "Comprehensive 250-piece first aid kit",
        sku: "MED-001",
        quantity: 9,
        price: 59.99,
        reorderThreshold: 10,
        categoryId: medical.id,
        locationId: storeFront.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Nitrile Gloves (Box/100)",
        description: "Powder-free disposable nitrile gloves, size M",
        sku: "MED-002",
        quantity: 28,
        price: 18.99,
        reorderThreshold: 15,
        categoryId: medical.id,
        locationId: coldStorage.id,
        createdById: seedUser.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Hand Sanitizer 1L",
        description: "70% alcohol hand sanitizer pump bottle",
        sku: "MED-003",
        quantity: 3,
        price: 14.99,
        reorderThreshold: 8,
        categoryId: medical.id,
        locationId: coldStorage.id,
        createdById: seedUser.id,
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
