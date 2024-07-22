"use client";

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const response = await toast.promise(fetch(`http://localhost:10000/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }), {
      pending: "Connecting To Server...",
      error: "Unable To Register",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.succes) {
        toast.success(data.message);
        setTimeout(() => {
          router.push("/api/auth/signin");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } else {
      toast.error("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4 sm:p-8 sm:space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-2"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full"
        >
          Register
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
