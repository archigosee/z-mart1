import React from 'react';
import Link from 'next/link';


const Services = async () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-gray-300 m-14 ">
              Products
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-white hover:text-gray-300 ml-11">
              Services
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Services;
