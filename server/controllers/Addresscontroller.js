import Address from "../models/Address.js";

// Add Address : POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    await Address.create({ ...address, userId });
    return res.json({
      success: true,
      message: "Address added successfully"
    });

  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export const getAddress = async (req, res) => {
    try {
        const userId = req.userId; // Get from JWT middleware
        
        if (!userId) {
            return res.json({ success: false, message: 'Not authenticated' });
        }
        
        const addresses = await Address.find({ userId });
        return res.json({
            success: true,
            addresses
        });
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};  