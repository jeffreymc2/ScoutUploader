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
			  {
				protocol: 'https',
				hostname: '09d1d85a2275582e9dad-7b3e649a230e2ba2cff912d8af17e0b5.ssl.cf1.rackcdn.com',
			  },
			  {
				protocol: 'https',
				hostname: 'dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com',
			  },
		],
	}
};

export default nextConfig;
