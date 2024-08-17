import React from 'react';
import axios from 'axios';
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

  return <ListProducts data={productsData} />;
};

export default HomePage;