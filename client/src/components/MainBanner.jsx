import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const MainBanner = () => {
  return (
    <div className="relative w-full">

      {/* Desktop Banner */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />

      {/* Text + Button */}
      <div className="absolute top-10 left-8 md:left-16 lg:left-24 xl:left-32 space-y-4">
        <h1 className="text-black text-2xl md:text-4xl font-semibold max-w-xl">
          Your trusted source for Daily Essentials
        </h1>

        <Link
          to="/products"
          className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer inline-flex"
        >
          Shop now
          <img
            className="md:hidden transition group-hover:translate-x-1"
            src={assets.white_arrow_icon}
            alt="arrow"
          />
        </Link>
        <Link
  to="/products"
  className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
>
  Explore deals
  <img
    className="transition group-hover:translate-x-1"
    src={assets.black_arrow_icon}
    alt="arrow"
  />
</Link>

      </div>

      {/* Mobile Banner */}
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden"
      />
    </div>
  )
}

export default MainBanner
