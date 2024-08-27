import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import ListProducts from '../components/products/ListProducts';
import queryString from 'query-string';

// Define the type for searchParams
interface SearchParams {
  ratings: any;
  max: any;
  min: any;
  category: any;
  keyword?: string;
  page?: number;
}

const getProducts = async (searchParams: SearchParams) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
    category: searchParams.category,
    "price[gte]": searchParams.min,
    "price[lte]": searchParams.max,
    "ratings[gte]": searchParams.ratings,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.API_URL}/api/products?${searchQuery}`
  );
  return data;
};

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const productsData = await getProducts(searchParams);

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

      {/* Product List */}
      <ListProducts data={productsData} />
    </>
  );
};

export default HomePage;
