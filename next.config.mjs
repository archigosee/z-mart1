/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        API_URL:"https://z-mart1.vercel.app/",
        DB_URI:"mongodb+srv://kaleab:%40Rch1g0s@new.rtiisbo.mongodb.net/?retryWrites=true&w=majority&appName=new"
    },
    images:{
        domains:['res.cloudinary.com']
    }
};

export default nextConfig;
