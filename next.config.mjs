/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
        API_URL: "https://wagamart.azurewebsites.net/",
        DB_URI: "mongodb+srv://kaleabnew21:kaleab1221@mart.tywhp.mongodb.net/?retryWrites=true&w=majority&appName=Mart"
    },
    images: {
        domains: ['res.cloudinary.com']
    }
};

export default nextConfig;
