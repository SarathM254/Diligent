import Brand from '../models/Brand.js';

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const upsertBrand = async (req, res) => {
  try {
    const { id, name, code, wholesalePrice, retailPrice } = req.body;
    
    if (id) {
      const brand = await Brand.findByIdAndUpdate(
        id, 
        { name, code, wholesalePrice, retailPrice },
        { new: true }
      );
      return res.status(200).json(brand);
    } else {
      const newBrand = new Brand({ name, code, wholesalePrice, retailPrice });
      await newBrand.save();
      return res.status(201).json(newBrand);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
