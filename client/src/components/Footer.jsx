import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#071024] text-gray-300 py-8 mt-auto">
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-10 w-10 rounded  flex items-center justify-center font-bold">
              <img src="/images/logouppng.png" alt="" />
            </div>
            <div>
              <div className="font-bold">BIZORA</div>
              <div className="text-sm text-gray-400">
                Ignite. Innovate. Prosper.
              </div>
            </div>
            
          </div>
          <div className="mt-4 text-sm text-gray-400">
            © {new Date().getFullYear()} Bizora. All rights reserved.
          </div>
          
        </div>

        {/* Links */}
        <div className="text-sm">
          <div className="font-semibold mb-4">Products</div>
          <ul className="space-y-1 text-gray-400">
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/messages">Message</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-sm flex flex-col">
          <div className="font-semibold mb-2">Contact</div>
          <div className="text-gray-400">bizoraltd@gmail.com</div>
          <div className="mt-3 text-gray-400">Follow us</div>
          <div className="flex gap-4 justify-center mt-2">
            <Link to="https://facebook.com"><img class="logo1" src="/images/facebook.png"  alt="facebook" /></Link>
            <Link to="https://instagram.com//mhmd.pp_"><img class="logo1" src="/images/instagram.png" alt="instagram" /></Link>
            <Link to="https://x.com"><img class="logo1" src="/images/twitter.png" alt="twitter" /></Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
