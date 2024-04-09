'use client';

import { LoginUserInput, loginUserSchema } from '@/lib/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from './_actions';
import toast from 'react-hot-toast';
import {supabaseBrowser} from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { FaMicrosoft } from 'react-icons/fa6';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const supabase = supabaseBrowser();

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    startTransition(async () => {
      const result = await signInWithEmailAndPassword(values);

      const { error } = JSON.parse(result);
      if (error?.message) {
        setError(error.message);
        toast.error(error.message);
        console.log('Error message', error.message);
        reset({ password: '' });
        return;
      }

      setError('');
      toast.success('successfully logged in');
      router.push('/');
    });
  };

  const loginWithAzure = () => {
    supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='w-full'>
      {error && (
        <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
      )}
      <div className='mb-6'>
        <Input
          type='email'
          {...register('email')}
          placeholder='Email address'
        />
        {errors['email'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['email']?.message as string}
          </span>
        )}
      </div>
      <div className='mb-6'>
        <Input
          type='password'
          {...register('password')}
          placeholder='Password'
        />
        {errors['password'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['password']?.message as string}
          </span>
        )}
      </div>
      <Button
        type='submit'
        className="flex w-full items-center justify-center cursor-pointer	gap-2 py-2 text-sm rounded-lg border border-gray-200 shadow-sm px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800 shadow-md"
        >
        {isPending ? 'loading...' : 'Sign In'}
      </Button>

      <div className='flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5'>
        <p className='text-center font-semibold mx-4 mb-0'>OR</p>
      </div>

      <div className="flex flex-col gap-4 w-full">
            <a
              className="flex items-center justify-center cursor-pointer	gap-2 py-2 text-sm rounded-lg border border-gray-200 shadow-sm px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800 shadow-md"
              onClick={() => loginWithAzure()}
            >
              <FaMicrosoft className="text-md" /> PG Account
            </a>
            
          </div>
        
    </form>
    
  );
};