import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name] || ""}
    required
  />
);

const AddAddress = () => {
  const {axios,user,navigate} = useAppContext();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Handle input change for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Submit handler
  const onSubmitHandler = async (e) => {
   try{
    e.preventDefault();
    const response = await axios.post("/api/address/add", {
      userId: user._id,
      address: address,
    });
    if(response.data.success){
      toast.success(response.data.message || "Address added successfully");
      navigate('/cart');
    }
    else {
      toast.error(response.data.message);
    }
   }
   catch(error){
      toast.error(error.message || "Failed to add address. Please try again.");
   }
  };

  useEffect(() => {
    if(!user){
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div>
      <div className="mt-16 pb-16">
        <p className="text-2xl md:text-3xl text-gray-500">
          Add Shipping <span className="font-semibold text-primary">Address</span>
        </p>

        <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
          {/* Form Section */}
          <div className="flex-1 max-w-md">
            <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">

              {/* First + Last Name */}
              <div>
                <InputField
                  handleChange={handleChange}
                  address={address}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
                <InputField
                  handleChange={handleChange}
                  address={address}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
              </div>

              {/* Email */}
              <InputField
                type="email"
                placeholder="Email"
                name="email"
                handleChange={handleChange}
                address={address}
              />

              {/* Street */}
              <InputField
                type="text"
                placeholder="Street"
                name="street"
                handleChange={handleChange}
                address={address}
              />

              {/* City */}
              <InputField
                type="text"
                placeholder="City"
                name="city"
                handleChange={handleChange}
                address={address}
              />

              {/* State */}
              <InputField
                type="text"
                placeholder="State"
                name="state"
                handleChange={handleChange}
                address={address}
              />

              {/* Zipcode */}
              <InputField
                type="number"
                placeholder="Zipcode"
                name="zipCode"
                handleChange={handleChange}
                address={address}
              />

              {/* Country */}
              <InputField
                type="text"
                placeholder="Country"
                name="country"
                handleChange={handleChange}
                address={address}
              />

              {/* Phone */}
              <InputField
                type="text"
                placeholder="Phone Number"
                name="phone"
                handleChange={handleChange}
                address={address}
              />

              {/* Submit Button */}
              <button className="mt-4 bg-primary text-white px-6 py-3 rounded-md">
                Save Address
              </button>
            </form>
          </div>

          {/* Address Image */}
          <img
            className="md:mr-16 mb-16 md:mb-0"
            src={assets.add_address_image}
            alt="Add Address"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
