"use client";

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const ThankYouPage = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Box className="bg-white p-6 rounded-lg shadow-md text-center">
                <Typography variant="h4" component="h1" className="mb-4 text-green-500">
                    Thank You!
                </Typography>
                <Typography variant="body1" className="mb-6">
                    Thanks for submitting the form. We appreciate your time and effort.
                    You  Can Update Any Fields Any Document In  Form Any Time But Only Admin Can Read The Form
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoHome}
                    className="mt-4"
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default ThankYouPage;
