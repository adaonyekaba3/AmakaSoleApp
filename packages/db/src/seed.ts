import { db } from './client';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';

async function seed(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Hash password for all test users
  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Clean existing data (in reverse order of dependencies)
  console.log('Cleaning existing data...');
  await db.delete(schema.brandPartnerOrders);
  await db.delete(schema.orders);
  await db.delete(schema.subscriptions);
  await db.delete(schema.orthoticDesigns);
  await db.delete(schema.gaitAnalyses);
  await db.delete(schema.footScans);
  await db.delete(schema.userProfiles);
  await db.delete(schema.refreshTokens);
  await db.delete(schema.brandPartners);
  await db.delete(schema.users);

  // Create Brand Partner
  console.log('Creating brand partner...');
  const [brandPartner] = await db
    .insert(schema.brandPartners)
    .values({
      name: 'LuxeBrand Demo',
      apiKeyHash: await bcrypt.hash('amaka_test_sk_demo1234', 12),
      webhookUrl: 'https://demo.luxebrand.com/webhooks/amakasole',
      logoUrl: 'https://placehold.co/200x60/5B2D8E/FFFFFF/png?text=LuxeBrand',
      themeConfig: JSON.stringify({
        primaryColor: '#000000',
        secondaryColor: '#C9952A',
        fontFamily: 'Playfair Display',
      }),
      revenueSharePercent: '12.00',
      isActive: true,
    })
    .returning();

  // Create Users
  console.log('Creating users...');

  const [consumer] = await db
    .insert(schema.users)
    .values({
      email: 'consumer@amakasole.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Johnson',
      authProvider: 'EMAIL',
      role: 'CONSUMER',
      isEmailVerified: true,
    })
    .returning();

  const [_brandUser] = await db
    .insert(schema.users)
    .values({
      email: 'brand@luxebrand.com',
      passwordHash,
      firstName: 'Michael',
      lastName: 'Chen',
      authProvider: 'EMAIL',
      role: 'BRAND_PARTNER',
      isEmailVerified: true,
    })
    .returning();

  const [_admin] = await db
    .insert(schema.users)
    .values({
      email: 'admin@amakasole.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      authProvider: 'EMAIL',
      role: 'ADMIN',
      isEmailVerified: true,
    })
    .returning();

  // Create Consumer Profile
  console.log('Creating user profiles...');
  const [_consumerProfile] = await db
    .insert(schema.userProfiles)
    .values({
      userId: consumer.id,
      dateOfBirth: new Date('1995-06-15'),
      weightKg: 68,
      heightCm: 168,
      primaryActivity: ['Running', 'Heels', 'Work/Professional'],
      knownConditions: ['Plantar Fasciitis'],
      shoeCollection: JSON.stringify([
        {
          brand: 'Nike',
          style: 'Air Max 90',
          color: 'White/Black',
          shoeType: 'SNEAKER',
          notes: 'Daily running shoes',
        },
        {
          brand: 'Christian Louboutin',
          style: 'So Kate 120',
          color: 'Black Patent',
          shoeType: 'HEEL',
          notes: 'Special occasions',
        },
        {
          brand: 'Nike',
          style: 'Free RN',
          color: 'Gray/Pink',
          shoeType: 'SPORT',
          notes: 'Gym workouts',
        },
      ]),
      footHealthScore: 78,
    })
    .returning();

  // Create Foot Scans
  console.log('Creating foot scans...');

  const [scan1] = await db
    .insert(schema.footScans)
    .values({
      userId: consumer.id,
      scanDate: new Date('2024-01-15T10:30:00Z'),
      leftFootKey: `scans/${consumer.id}/scan1/left.ply`,
      rightFootKey: `scans/${consumer.id}/scan1/right.ply`,
      status: 'COMPLETE',
      pointCloudUrl: 'https://cdn.amakasole.com/scans/scan1/pointcloud.ply',
      meshUrl: 'https://cdn.amakasole.com/scans/scan1/preview_mesh.png',
      measurements: JSON.stringify({
        left: {
          length_mm: 243,
          width_mm: 91,
          arch_height_mm: 18,
          heel_width_mm: 72,
          ball_width_mm: 95,
        },
        right: {
          length_mm: 245,
          width_mm: 92,
          arch_height_mm: 17,
          heel_width_mm: 73,
          ball_width_mm: 96,
        },
      }),
      scanMetadata: JSON.stringify({
        deviceModel: 'iPhone 14 Pro',
        captureAngles: 6,
        processingTimeSeconds: 45,
        qualityScore: 92,
      }),
    })
    .returning();

  const [scan2] = await db
    .insert(schema.footScans)
    .values({
      userId: consumer.id,
      scanDate: new Date('2024-02-20T14:15:00Z'),
      leftFootKey: `scans/${consumer.id}/scan2/left.ply`,
      rightFootKey: `scans/${consumer.id}/scan2/right.ply`,
      status: 'COMPLETE',
      pointCloudUrl: 'https://cdn.amakasole.com/scans/scan2/pointcloud.ply',
      meshUrl: 'https://cdn.amakasole.com/scans/scan2/preview_mesh.png',
      measurements: JSON.stringify({
        left: {
          length_mm: 243,
          width_mm: 91,
          arch_height_mm: 19,
          heel_width_mm: 72,
          ball_width_mm: 94,
        },
        right: {
          length_mm: 245,
          width_mm: 92,
          arch_height_mm: 18,
          heel_width_mm: 73,
          ball_width_mm: 95,
        },
      }),
      scanMetadata: JSON.stringify({
        deviceModel: 'iPhone 14 Pro',
        captureAngles: 6,
        processingTimeSeconds: 42,
        qualityScore: 95,
      }),
    })
    .returning();

  // Create Gait Analyses
  console.log('Creating gait analyses...');

  const [_gait1] = await db
    .insert(schema.gaitAnalyses)
    .values({
      footScanId: scan1.id,
      videoKey: `scans/${consumer.id}/scan1/gait.mp4`,
      pronationType: 'OVERPRONATION',
      confidenceScore: 87,
      heatmapUrl: 'https://cdn.amakasole.com/scans/scan1/gait_heatmap.png',
      analysisData: JSON.stringify({
        avgAnkleAngle: 7.2,
        ankleAngles: [6.5, 7.1, 7.8, 6.9, 7.4, 7.3, 7.0, 7.5],
        frameCount: 120,
        stepsAnalyzed: 10,
        pressureDistribution: {
          heel: 0.35,
          medialArch: 0.28,
          lateralArch: 0.12,
          ball: 0.2,
          toes: 0.05,
        },
      }),
    })
    .returning();

  const [_gait2] = await db
    .insert(schema.gaitAnalyses)
    .values({
      footScanId: scan2.id,
      videoKey: `scans/${consumer.id}/scan2/gait.mp4`,
      pronationType: 'NEUTRAL',
      confidenceScore: 91,
      heatmapUrl: 'https://cdn.amakasole.com/scans/scan2/gait_heatmap.png',
      analysisData: JSON.stringify({
        avgAnkleAngle: 2.1,
        ankleAngles: [1.8, 2.3, 2.0, 2.5, 1.9, 2.2, 2.1, 2.4],
        frameCount: 125,
        stepsAnalyzed: 10,
        pressureDistribution: {
          heel: 0.3,
          medialArch: 0.18,
          lateralArch: 0.17,
          ball: 0.25,
          toes: 0.1,
        },
      }),
    })
    .returning();

  // Create Orthotic Designs
  console.log('Creating orthotic designs...');

  const [design1] = await db
    .insert(schema.orthoticDesigns)
    .values({
      footScanId: scan1.id,
      userId: consumer.id,
      shoeType: 'HEEL',
      useCase: 'EVERYDAY',
      material: 'MEMORY_FOAM',
      archHeightPref: 'MEDIUM',
      cadSpecUrl: 'https://cdn.amakasole.com/designs/design1/cad_spec.json',
      cadSpec: JSON.stringify({
        arch_height_mm: 20,
        heel_cup_depth_mm: 15,
        metatarsal_pad_x: 68,
        metatarsal_pad_y: 22,
        toe_box_width: 85,
        insole_length_mm: 241,
        insole_width_mm: 93,
      }),
      previewImageUrl: 'https://cdn.amakasole.com/designs/design1/insole_preview.png',
      status: 'ORDERED',
    })
    .returning();

  const [_design2] = await db
    .insert(schema.orthoticDesigns)
    .values({
      footScanId: scan2.id,
      userId: consumer.id,
      shoeType: 'SNEAKER',
      useCase: 'SPORT',
      material: 'CARBON_FIBER',
      archHeightPref: 'HIGH',
      cadSpecUrl: 'https://cdn.amakasole.com/designs/design2/cad_spec.json',
      cadSpec: JSON.stringify({
        arch_height_mm: 24,
        heel_cup_depth_mm: 18,
        metatarsal_pad_x: 70,
        metatarsal_pad_y: 24,
        toe_box_width: 95,
        insole_length_mm: 243,
        insole_width_mm: 94,
      }),
      previewImageUrl: 'https://cdn.amakasole.com/designs/design2/insole_preview.png',
      status: 'DRAFT',
    })
    .returning();

  const [design3] = await db
    .insert(schema.orthoticDesigns)
    .values({
      footScanId: scan2.id,
      userId: consumer.id,
      shoeType: 'SNEAKER',
      useCase: 'EVERYDAY',
      material: 'EVA_FOAM',
      archHeightPref: 'MEDIUM',
      cadSpecUrl: 'https://cdn.amakasole.com/designs/design3/cad_spec.json',
      cadSpec: JSON.stringify({
        arch_height_mm: 21,
        heel_cup_depth_mm: 16,
        metatarsal_pad_x: 69,
        metatarsal_pad_y: 23,
        toe_box_width: 94,
        insole_length_mm: 243,
        insole_width_mm: 93,
      }),
      previewImageUrl: 'https://cdn.amakasole.com/designs/design3/insole_preview.png',
      status: 'CONFIRMED',
    })
    .returning();

  // Create Subscription
  console.log('Creating subscription...');
  const [_subscription] = await db
    .insert(schema.subscriptions)
    .values({
      userId: consumer.id,
      stripeSubscriptionId: 'sub_test_1234567890',
      status: 'ACTIVE',
      plan: 'PREMIUM',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .returning();

  // Create Orders
  console.log('Creating orders...');

  const [_order1] = await db
    .insert(schema.orders)
    .values({
      userId: consumer.id,
      orthoticDesignId: design1.id,
      stripePaymentIntentId: 'pi_test_delivered_1234',
      amount: 19700,
      currency: 'usd',
      status: 'DELIVERED',
      trackingNumber: '1Z999AA10123456784',
      trackingCarrier: 'UPS',
      shippingAddress: JSON.stringify({
        fullName: 'Sarah Johnson',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      }),
    })
    .returning();

  const [order2] = await db
    .insert(schema.orders)
    .values({
      userId: consumer.id,
      orthoticDesignId: design3.id,
      brandPartnerId: brandPartner.id,
      stripePaymentIntentId: 'pi_test_manufacturing_5678',
      amount: 16200,
      currency: 'usd',
      status: 'MANUFACTURING',
      shippingAddress: JSON.stringify({
        fullName: 'Sarah Johnson',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      }),
    })
    .returning();

  // Create Brand Partner Order
  await db.insert(schema.brandPartnerOrders).values({
    brandPartnerId: brandPartner.id,
    orderId: order2.id,
    externalOrderRef: 'LUXE-2024-001',
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Created:');
  console.log(`   - 3 Users (consumer, brand partner, admin)`);
  console.log(`   - 1 Brand Partner`);
  console.log(`   - 2 Foot Scans`);
  console.log(`   - 2 Gait Analyses`);
  console.log(`   - 3 Orthotic Designs`);
  console.log(`   - 2 Orders`);
  console.log(`   - 1 Subscription`);
  console.log('\n👤 Test Accounts:');
  console.log('   Consumer:  consumer@amakasole.com / Password123!');
  console.log('   Partner:   brand@luxebrand.com / Password123!');
  console.log('   Admin:     admin@amakasole.com / Password123!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
