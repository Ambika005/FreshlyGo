export default function NewsLetter() {
    return (
        <div className="w-full bg-primary/5 px-4 text-center text-primary py-20 flex flex-col items-center justify-center">

            <p className="text-primary font-medium tracking-wide">
                Stay Updated
            </p>

            <h1 className="max-w-xl font-semibold text-3xl md:text-4xl mt-2 text-primary">
                Subscribe to get updates — never miss amazing deals!
            </h1>

            <div className="flex items-center justify-center mt-10 border border-primary/30 focus-within:outline focus-within:outline-primary text-sm rounded-full h-14 max-w-md w-full bg-white shadow-sm">
                
                <input 
                    type="text" 
                    className="bg-transparent outline-none rounded-full px-4 h-full flex-1 text-primary placeholder:text-primary/50" 
                    placeholder="Enter your email address"
                />
                
                <button className="bg-primary text-white rounded-full h-11 mr-1 px-8 flex items-center justify-center hover:bg-primary/90 transition">
                    Subscribe
                </button>

            </div>
        </div>
    );
}
