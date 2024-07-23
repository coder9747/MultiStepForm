import React, { useState, useEffect, useContext } from 'react';
import { Grid, MenuItem, TextField, InputLabel, FormControl, Button, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FormContext } from '@/components/Providers/FormProvider';

let baseUrl = 'http://localhost:10000';

interface FormData {
    pan_number?: string;
    cibil_score?: string;
    aadhar_number?: string;
};
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const fields = [
    { name: "pan_number", label: "PAN Number", type: "text" },
    { name: "pan_card", label: "Upload PAN Card", type: "file" },
    { name: "cibil_score", label: "CIBIL Score", type: "text" },
    { name: "cibil_report", label: "Upload CIBIL Report", type: "file" },
    { name: "aadhar_number", label: "Aadhar Number", type: "text" },
    { name: "aadhar_card", label: "Upload Aadhar Card", type: "file" },
];

const initialData: FormData = {
    pan_number: "",
    cibil_score: "",
    aadhar_number: "",
};

const Step4 = () => {
    const { data: session, status } = useSession();
    const { state } = useContext(FormContext);
    const [formData, setFormData] = useState<FormData>(initialData);
    const [fileData, setFileData] = useState({
        "pan_card": null,
        "aadhar_card": null,
        "cibil_report": null,
    });
    const [isPreValFlag, setIsPreValFlag] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        console.log(files);
        if (files[0] && supportedImageTypes.includes(files[0].type)) {
            setFileData((pre) => {
                return { ...pre, [name]: files[0] }
            });
        }
        else {
            alert("Unsupported Type");
        }
    };
    useEffect(() => {
        if (status == 'authenticated') {
            const userId = session.user.id;
            if (fileData.aadhar_card != null) {
                const formData = new FormData();
                formData.append("file", fileData.aadhar_card);
                axios.post(`${baseUrl}/api/v1/form/upload/docs?userId=${userId}&type=aadhar_card`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    if (res.data.succes) {
                        alert("Adhar uploaded Succesful");
                    }
                    else {
                        alert("Adhar upload error");
                    }
                })
            }
            else if (fileData.cibil_report != null) {
                const formData = new FormData();
                formData.append("file", fileData.cibil_report);
                axios.post(`${baseUrl}/api/v1/form/upload/docs?userId=${userId}&type=pan_card`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    if (res.data.succes) {
                        alert("Cibil uploaded Succesful");
                    }
                    else {
                        alert("Cibil upload error");
                    }
                })
            }
            else if (fileData.pan_card != null) {
                const formData = new FormData();
                formData.append("file", fileData.pan_card);
                axios.post(`${baseUrl}/api/v1/form/upload/docs?userId=${userId}&type=pan_card`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    if (res.data.succes) {
                        alert("pan uploaded Succesful");
                    }
                    else {
                        alert("pan upload error");
                    }
                })
            }

        }
    }, [fileData, session])

    useEffect(() => {
        let token: any = () => { };
        if (status == "authenticated" && isPreValFlag) {
            const userId = session.user.id
            axios.post("http://localhost:10000/api/v1/form/upsert/step3", {
                userId,
                data: formData,
            }, { cancelToken: new axios.CancelToken((c) => token = c) })
                .then((res) => {
                    console.log(res.data);
                }).catch((err) => {
                    console.log('canceled');
                })
        }
        return () => token();

    }, [formData]);
    useEffect(() => {
        if (status == "authenticated") {
            const fetchData = async () => {
                const res = await axios.post(`${baseUrl}/api/v1/form/get/step3`, {
                    userId: session?.user.id
                });
                if(res.data.succes){
                    setFormData({ ...formData, ...res.data.payload });
                    setTimeout(()=>setIsPreValFlag(true),2000);
                }
            }
            fetchData();
        }


    }, [session])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        state.next();
    };
    return (status == "authenticated" && state ?
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
                {fields.map(field => (
                    <Grid item xs={12} sm={6} key={field.name}>
                        {field.type === 'file' ? (
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="file"
                                name={field.name}
                                label={field.label}
                                InputLabelProps={{ shrink: true }}
                                onChange={handleFileChange}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                variant="outlined"
                                type={field?.type}
                                name={field?.name}
                                label={field?.label}
                                value={formData[field?.name as keyof FormData] || ""}
                                onChange={handleChange}
                                InputLabelProps={field?.type === 'date' ? { shrink: true } : {}}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
            <div>
                Data
            </div>
            <div className=' px-10 my-2 flex justify-around w-full '>
                <button onClick={() => state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                <button className='bg-blue-400 px-10 rounded  py-2' onClick={() => state?.next()}>Next</button>
            </div>
        </Box> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default Step4;
