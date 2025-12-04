import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {

    const [images, setImages] = useState([null, null, null, null]); // Array for 4 images
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const { axios } = useContext(AppContext);
    const handleImageChange = (index, file) => {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation - check if at least one image is selected
            const selectedImages = images.filter(img => img !== null);
            if (selectedImages.length === 0) {
                toast.error("Please select at least one image");
                setLoading(false);
                return;
            }

            const productData = {
                name,
                description: description.split("\n"),
                category: [category], // Backend expects array
                price: Number(price),
                offerPrice: offerPrice ? Number(offerPrice) : undefined,
                instock: true, // Backend expects lowercase 'instock'
            };

            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            // append all selected images as "images"
            selectedImages.forEach(image => {
                formData.append("images", image);
            });

            const { data } = await axios.post("/api/product/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success("Product added successfully");

                // reset form
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setImages([null, null, null, null]);
                // Reset file inputs
                document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
            } else {
                toast.error(data.message || "Failed to add product");
            }
        } catch (err) {
            console.log("Product upload error:", err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-10 flex flex-col justify-between bg-white">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {images.map((image, index) => (
                            <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                <input 
                                    accept="image/*" 
                                    type="file" 
                                    id={`image${index}`}
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    className="hidden"
                                />
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                    {image ? (
                                        <img 
                                            src={URL.createObjectURL(image)} 
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="text-xs text-gray-500">Upload</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {images.filter(img => img !== null).length} of 4 images selected
                    </p>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input 
                        id="product-name" 
                        type="text" 
                        placeholder="Type here" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                        required 
                    />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea 
                        id="product-description" 
                        rows={4} 
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" 
                        placeholder="Type here"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select 
                        id="category" 
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {[{ name: 'vegetables' }, { name: 'fruits' }, { name: 'drinks' },{name:'instant'},{name: 'dairy'},{name:'bakery'},{name: 'grains'}].map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input 
                            id="product-price" 
                            type="number" 
                            placeholder="0" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                            required 
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input 
                            id="offer-price" 
                            type="number" 
                            placeholder="0" 
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" 
                        />
                    </div>
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-2.5 text-white font-medium rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                >
                    {loading ? 'Adding Product...' : 'ADD PRODUCT'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;