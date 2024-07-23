import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Input, Typography } from '@mui/material';
import { FormContext } from '@/components/Providers/FormProvider';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const fields = [
    { name: "aadharNumber", label: "Aadhaar Card Number", type: "text" },
    { name: "aadharUpload", label: "Upload Aadhaar Card", type: "file" },
    { name: "panNumber", label: "PAN Card Number", type: "text" },
    { name: "panUpload", label: "Upload PAN Card", type: "file" },
    { name: "drivingLicenseNumber", label: "Driving License Number", type: "text" },
    { name: "drivingLicenseUpload", label: "Upload Driving License", type: "file" },
];

const initialData = {
    aadharNumber: "",
    panNumber: "",
    drivingLicenseNumber: "",
};
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const FatherDocument = () => {
    const session = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState(initialData);
    const { state } = useContext(FormContext);
    const [isPreValFlag, setIsPreValFlag] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState({
        aadharUpload: "",
        drivingLicenseUpload: "",
        panUpload: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            if (session.status === "authenticated") {
                if (files[0] && supportedImageTypes.includes(files[0].type)) {
                    const formData = new FormData();
                    formData.append("file", files[0]);
                    const userId = session.data.user.id;
                    axios.post(`http://localhost:10000/api/v1/form/upsert/doc/step7?userId=${userId}&type=${name}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((res) => {
                        console.log(res.data);
                        const imageUrl = URL.createObjectURL(files[0]);
                        setFileUrl((pre) => {
                            return { ...pre, [name]: imageUrl }
                        });
                    }).catch(console.error);
                } else {
                    alert("Unsupported file type");
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: e.target.value }));
        }
    };
    const getDocs = async (userId: string, fileName: string) => {
        axios.post("http://localhost:10000/api/v1/form/getanydocs", {
            userId,
            stepNumber: 'step7',
            fileToGet: fileName,
        }, { responseType: "arraybuffer" }).then((res) => {
            const imageBlob = new Blob([res.data], { type: "image/jpg" });
            if (imageBlob.size) {
                const imageUrl = URL.createObjectURL(imageBlob);
                setFileUrl((pre) => {
                    return { ...pre, [fileName]: imageUrl }
                });
            }
        }).catch((error) => {
            console.log(error);
        })
    }


    useEffect(() => {
        let timeOutId: NodeJS.Timeout | null = null;
        if (session.status === "authenticated") {
            const userId = session.data.user.id;
            timeOutId = setTimeout(() => {
                axios.post('http://localhost:10000/api/v1/form/upsert/step7', {
                    userId,
                    data: formData,
                }).then((res) => {
                    console.log(res.data);
                }).catch(console.error);
            }, 3000);
        };
        return () => clearTimeout(timeOutId);
    }, [formData, session]);
    useEffect(() => {
        let token = () => { };
        if (session.status == "authenticated") {
            const userId = session.data.user.id;
            axios.post("http://localhost:10000/api/v1/form/get/step7", { userId })
                .then((res) => {
                    setFormData((pre) => {
                        return { ...pre, ...res?.data?.payload }
                    });
                }).catch(console.error).finally
            {
                setTimeout(() => setIsPreValFlag(true), 2000);
            }
            getDocs(userId,'aadharUpload');
            getDocs(userId,'drivingLicenseUpload');
            getDocs(userId,'panUpload');
        }
    }, [session]);
    const handleFinish = () => {
        router.push("/greeting");
    }
    return (
        session.status == "authenticated" ? <div>
            <Grid container spacing={2} my={2} rowGap={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                {fields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={field.name}>
                        {field.type === "file" ? (
                            <>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="file"
                                    name={field.name}
                                    label={field.label}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleChange}
                                />
                            </>
                        ) : (
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
            <div className='flex justify-around items-center my-2 flex-wrap'>
                {
                    Object.entries(fileUrl).map(([key, value]: [string, string]) => {
                        if (value) {
                            return <div className=' flex flex-col justify-center items-center'>
                                <img className='h-32' src={value} alt="" />
                                <p className='text-sm'>{key}</p>
                            </div>
                        }
                        return null;
                    })
                }
            </div>
            <div className=' px-10 flex justify-around w-full '>
                <button onClick={() => state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                <button className='bg-green-400 px-10 rounded  py-2' onClick={handleFinish}>Finish</button>
            </div>
        </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default FatherDocument;
