/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        API_URL:"https://z-mart1.vercel.app/",
        DB_URI:"mongodb://localhost:27017/mart"
    },
    images:{
        domains:['res.cloudinary.com']
    }
};

export default nextConfig;
