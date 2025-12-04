import product from '../models/Product.js';
import { cloudinary } from '../configs/cloudinary.js';
//Get Product List : GET api/product/list
export const ProductList = async(req,res)=>{
    try{
            const products = await product.find().sort({createdAt:-1});
            res.json({success:true,products});
    }
    catch(error){
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}

//AddProduct : POST api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    if (!images || images.length === 0) {
      return res.json({ success: false, message: "Please select at least one image" });
    }

    // Upload each image to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url; // return Cloudinary imageURL
      })
    );

    // Save product with imageURLs in MongoDB
    await product.create({
      ...productData,
      image: imagesUrl,
    });

    return res.json({ success: true, message: "Product added successfully" });

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


//Get Product By Id : GET api/product/:id
export const ProductById = async(req,res)=>{
    try{
        const {id} = req.body;
        const prod = await product.findById(id);
        res.json({success:true,prod});
    }
    catch(error){
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }   
}
//Change stock : POST api/product/stock
export const ChangeStock = async(req,res)=>{
    try{
        const{id,inStock} = req.body;
        await product.findByIdAndUpdate(id,{instock:inStock});
        res.json({success:true,message:"Stock updated successfully"});
    }
    catch(error){
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}