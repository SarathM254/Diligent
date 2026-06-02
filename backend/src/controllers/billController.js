import Bill from '../models/Bill.js';
import User from '../models/User.js';
import Brand from '../models/Brand.js';                                // THESE CONTOLLERS NEED TO BE STUDIED 

// 1. Create or Update Draft Bill
export const createOrUpdateDraftBill = async (req, res) => {
  try {
    let { items, totalAmount } = req.body;
    
    // Fallback salesmanId if not provided by frontend (since no login)
    let salesmanId = req.body.salesmanId;
    if (!salesmanId) {
      const defaultUser = await User.findOne({ role: 'salesman' });
      salesmanId = defaultUser ? defaultUser._id : null;
    }

    const billingDate = new Date().toISOString().split('T')[0];

    // Map items to include rateSnapShot
    const mappedItems = await Promise.all(items.map(async (item) => {
      const brand = await Brand.findById(item.brandId);
      return {
        brandId: item.brandId,
        quantity: item.quantity,
        rateSnapShot: brand ? brand.retailPrice : 0,
        brandName: brand ? brand.name : 'Unknown Brand'
      };
    }));
    
    const existingBill = await Bill.findOne({ salesmanId, billingDate });
    if (existingBill && existingBill.status !== 'draft' && existingBill.status !== 'submitted') {
      return res.status(400).json({ error: "Bill for today is already processed by the owner." });
    }

    const bill = await Bill.findOneAndUpdate(
      { salesmanId, billingDate },
      {
        salesmanId,
        billingDate,
        items: mappedItems,
        totalBillValue: totalAmount || 0,
        status: 'submitted'
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    return res.status(201).json(bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 2. Submit Bill
export const submitBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id);

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Change status from 'draft' to 'submitted'
    if (bill.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft bills can be submitted' });
    }

    bill.status = 'submitted';
    await bill.save();

    return res.status(200).json(bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 3. Update Bill Status by Owner
export const updateBillStatusByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pushDate } = req.body;

    const bill = await Bill.findById(id);

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check if status is transitioning to delivered
    const isBecomingDelivered = status === 'delivered' && bill.status !== 'delivered';

    // Change status (e.g., to 'delivered')
    if (status) {
      bill.status = status;
    }

    if (isBecomingDelivered) {
      // Add the bill amount to the salesman's BF balance
      const salesman = await User.findById(bill.salesmanId);
      if (salesman) {
        salesman.broughtForwardDebt += bill.totalBillValue;
        await salesman.save();
      }
    }

    // Push the date to the next operational date
    if (pushDate) {
      bill.isPushedToNextDay = true;
      const nextDate = new Date(bill.billingDate);
      nextDate.setDate(nextDate.getDate() + 1); // Simplistic 1-day push, can adjust for business logic
      bill.billingDate = nextDate;
    }

    await bill.save();

    return res.status(200).json(bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 4. Get Salesman Bill History
export const getSalesmanBillHistory = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    // Fetch all historical bills for the specific salesmanId, sorted by billingDate descending
    const bills = await Bill.find({ salesmanId }).sort({ billingDate: -1 });
    
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 5. Get Pending Bills for Admin
export const getPendingBillsForAdmin = async (req, res) => {
  try {
    // Fetch all bills where status is 'submitted', 'delivered', or 'billed'
    const bills = await Bill.find({ 
      status: { $in: ['submitted', 'delivered', 'billed'] } 
    }).populate('salesmanId', 'name');
    
    // Map to frontend expected shape
    const mappedBills = bills.map(b => ({
      _id: b._id,
      salesmanName: b.salesmanId ? b.salesmanId.name : 'Unknown',
      totalAmount: b.totalBillValue,
      status: b.status,
      date: b.billingDate,
      items: b.items
    }));

    return res.status(200).json(mappedBills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
