import Bill from '../models/Bill.js';                                // THESE CONTOLLERS NEED TO BE STUDIED 

// 1. Create or Update Draft Bill
export const createOrUpdateDraftBill = async (req, res) => {
  try {
    const { salesmanId, billingDate, items } = req.body;
    
    // Look for an existing draft bill for the salesman on the specified date
    let bill = await Bill.findOne({ salesmanId, billingDate, status: 'draft' });

    if (bill) {
      // Update its items array
      bill.items = items;
      await bill.save();
      return res.status(200).json(bill);
    } else {
      // Create a new draft bill
      bill = new Bill({
        salesmanId,
        billingDate,
        items,
        status: 'draft'
      });
      await bill.save();
      return res.status(201).json(bill);
    }
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

    // Change status (e.g., to 'delivered')
    if (status) {
      bill.status = status;
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
    });
    
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
