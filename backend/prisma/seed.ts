import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@routelyn.test' },
    update: {},
    create: { name: 'Admin User', email: 'admin@routelyn.test', passwordHash: pwd, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'staff@routelyn.test' },
    update: {},
    create: { name: 'Ops Staff', email: 'staff@routelyn.test', passwordHash: pwd, role: 'STAFF' },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@routelyn.test' },
    update: {},
    create: { name: 'Alex Driver', email: 'driver@routelyn.test', passwordHash: pwd, role: 'DRIVER' },
  });

  const driver = await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: {
      userId: driverUser.id,
      vehicleType: 'Van',
      vehicleNumber: 'RL-123-AB',
      isAvailable: true,
    },
  });

  const existing = await prisma.shipment.findUnique({ where: { trackingNumber: 'RLN-20394820' } });
  if (!existing) {
    await prisma.shipment.create({
      data: {
        trackingNumber: 'RLN-20394820',
        status: 'IN_TRANSIT',
        senderName: 'Tunde Stores',
        senderPhone: '+2348000000001',
        pickupAddress: 'Ikeja, Lagos',
        pickupLatitude: 6.6018,
        pickupLongitude: 3.3515,
        recipientName: 'Chioma Okafor',
        recipientPhone: '+2348000000002',
        destinationAddress: 'Victoria Island, Lagos',
        destinationLatitude: 6.4281,
        destinationLongitude: 3.4219,
        estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 6),
        driverId: driver.id,
        trackingEvents: {
          create: [
            { status: 'CREATED', description: 'Shipment created', latitude: 6.6018, longitude: 3.3515 },
            { status: 'PICKED_UP', description: 'Picked up from sender', latitude: 6.6018, longitude: 3.3515 },
            { status: 'IN_TRANSIT', description: 'In transit to destination', latitude: 6.5602, longitude: 3.3674 },
          ],
        },
        deliveryLocations: {
          create: [{ driverId: driver.id, latitude: 6.5602, longitude: 3.3674, accuracy: 12 }],
        },
      },
    });
  }

  console.log('✅ Seeded Routelyn.');
  console.log('   admin@routelyn.test  / password123');
  console.log('   staff@routelyn.test  / password123');
  console.log('   driver@routelyn.test / password123');
  console.log('   Sample tracking number: RLN-20394820');
}

main().finally(() => prisma.$disconnect());
