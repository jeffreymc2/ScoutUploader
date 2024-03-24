/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
			},
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
			},
			{
				hostname: "rfgveuhgzxqkaualspln.supabase.co",
				protocol: "https",
			},
			{
				hostname: "vyrybefhmqnaxzfijbpl.supabase.co",
				protocol: "https",
			},
			{
				protocol: 'https',
				hostname: 'rfgveuhgzxqkaualspln.supabase.co',
				pathname: '/storage/v1/upload/resumable/**',
			  },
		],
	}
};

export default nextConfig;
