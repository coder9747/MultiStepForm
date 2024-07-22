"use client";
import React from 'react';
import { Box, Button, Typography, Paper, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';

const SignInPrompt = () => {
    const router = useRouter();

    const handleSignIn = () => {
        // Redirect to the sign-in page
        router.push('/api/auth/signin');
    };

    return (
        <CssBaseline>
            <Box component="div" className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <Paper component="div" className="w-full max-w-md p-6 sm:p-8 text-center">
                    <Typography variant="h4" gutterBottom>
                        Please Sign In
                    </Typography>
                    <Typography variant="body1" paragraph>
                        You need to be signed in to access this form. Please sign in to continue.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleSignIn}>
                        Sign In
                    </Button>
                </Paper>
            </Box>
        </CssBaseline>
    );
};

export default SignInPrompt;
