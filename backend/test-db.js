import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Brand from "./src/models/Brand.js";
import Bill from "./src/models/Bill.js";

dotenv.config();

async function runTest() {
  try {
    // 1. Connect to your local MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/diligent";
    await mongoose.connect(mongoUri);
    console.log("⚡ Connected to MongoDB successfully.");

    // Clean up old test records to avoid unique index conflicts
    await User.deleteMany({ email: "test-salesman@manikyapriya.com" });
    await Brand.deleteMany({ code: "GFC_LIGHTS" });
    await Bill.deleteMany({});

    // 2. Create a Mock Salesman User
    const salesman = await User.create({
      name: "Ramesh Kumar",
      email: "test-salesman@manikyapriya.com",
      role: "salesman",
      salesmanId: "SM-101"
    });
    console.log(`✅ Created Salesman: ${salesman.name} (${salesman.salesmanId})`);

    // 3. Create a Mock Brand
    const brand = await Brand.create({
      name: "Gold Flake Kings",
      code: "GFC_LIGHTS",
      price: { wholesale: 140, retail: 150 }
    });
    console.log(`✅ Created Brand: ${brand.name} with Retail Price: ₹${brand.price.retail}`);

    // 4. Create a Dummy Bill Document to test our calculation logic
    const testBill = await Bill.create({
      salesmanId: salesman._id,
      billingDate: "2026-06-01",
      status: "draft",
      items: [
        {
          brandId: brand._id,
          quantity: 10, // 10 packs
          rateSnapShot: brand.price.retail // Snapshotting the ₹150 rate
        }
      ]
      // Notice we are NOT passing totalBillValue here! The middleware should compute it.
    });

    console.log("\n🚀 --- MIDDLEWARE EXTRACTION RESULT ---");
    console.log(`Billing Date: ${testBill.billingDate}`);
    console.log(`Items Sent: ${testBill.items[0].quantity} packs of Brand ID: ${testBill.items[0].brandId}`);
    console.log(`Calculated Total Bill Value in DB: ₹${testBill.totalBillValue}`);
    
    // Validation: 10 packs * ₹150 rate should equal ₹1500 exactly
    if (testBill.totalBillValue === 1500) {
      console.log("🎉 SUCCESS! Pre-save calculation middleware works beautifully!");
    } else {
      console.log("❌ FAILURE: Math calculation doesn't match.");
    }

  } catch (error) {
    console.error("❌ Test crashed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

runTest();