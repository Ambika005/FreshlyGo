import { footerLinks,assets } from "../assets/assets";

const Footer = () => {
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
            
            {/* Top Section */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-gray-300/40 text-gray-600">
                
                {/* Logo + Description */}
                <div>
                    <img 
                        className="w-32" 
                        src={assets.logo} 
                        alt="FreshlyGo Logo" 
                    />
                    <p className="max-w-[420px] mt-6 text-sm leading-relaxed">
                        FreshlyGo delivers groceries, daily essentials, and fresh produce 
                        straight to your doorstep — fast, reliable, and always fresh.  
                        Your comfort, your time, and your convenience are our top priorities.
                    </p>
                </div>

                {/* Dynamic Footer Links */}
                <div className="flex flex-wrap justify-between w-full md:w-[50%] gap-6">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 mb-3">
                                {section.title}
                            </h3>

                            <ul className="text-sm space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a 
                                            href={link.url} 
                                            className="text-primary/80 hover:text-primary hover:underline transition"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom Section */}
            <p className="py-5 text-center text-sm text-gray-500">
                © 2025 
                <span className="text-primary font-semibold"> FreshlyGo</span>
                — Delivering Freshness, Every Day.
            </p>

        </div>
    );
};

export default Footer;
