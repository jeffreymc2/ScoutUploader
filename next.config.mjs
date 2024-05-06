/** @type {import('next').NextConfig} */
import { withNextVideo } from 'next-video/process';

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
				hostname: "avkhdvyjcweghosyfiiw.supabase.co",
				protocol: "https",
			},
			{
				hostname: "vyrybefhmqnaxzfijbpl.supabase.co",
				protocol: "https",
			},
			{
				hostname: "rfgveuhgzxqkaualspln.supabase.co",
				protocol: "https",
			},
			{
				hostname: "0ebf220f63c8a281d66e-20abd5688b9423eda60643010803535a.ssl.cf1.rackcdn.com",
				protocol: "https",
			},
			{
				protocol: 'https',
				hostname: 'avkhdvyjcweghosyfiiw.supabase.co',
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
			  {
				protocol: 'https',
				hostname: 'safe-images-cdn.drund.com',
			  },
			  {	
				protocol: 'https',
				hostname: 'ivs-cdn.drund.com',
			  },
			  
			 
		],
	},
	api: {
		bodyParser: {
		  sizeLimit: '500mb', // Adjust the size limit as needed
		},
	  },
	// images: {
	// 	loader: 'custom',
	// 	loaderFile: '@/lib/supabase/loader',
	//   },
};

export default withNextVideo(nextConfig);