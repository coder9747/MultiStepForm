import React, { useState, useEffect, useContext } from 'react';
import { Grid, MenuItem, TextField, InputLabel, FormControl, Button, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FormContext } from '@/components/Providers/FormProvider';
import { checkFile } from '@/components/Helpers/CheckFileSize';

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
    const [filesUrl, setFilesUrl] = useState({
        "pan_card": "",
        "aadhar_card": "",
        "cibil_report": "",
    });


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
    const uploadDocs = async (userId: string, type: string, file: File) => {
        if (checkFile(file) && supportedImageTypes.includes(file.type)) {
            const formData = new FormData();
            formData.append("file", file);
            axios.post(`${baseUrl}/api/v1/form/upload/docs?userId=${userId}&type=${type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                if (res.data.succes) {
                    alert(type + " uploaded Succesful");
                    const imageUrl = URL.createObjectURL(file);
                    setFilesUrl((pre) => {
                        return { ...pre, [type]: imageUrl };
                    })
                }
                else {
                    alert("Adhar upload error");
                }
            })
        }
        else {
            alert("Unsupported Data");
        }
    }
    const getPreDocs = async (userId: string, fileName: string) => {
        axios.post("http://localhost:10000/api/v1/form/getanydocs", {
            userId,
            stepNumber: 'step3',
            fileToGet: fileName,
        }, { responseType: "arraybuffer" }).then((res) => {
            const imageBlob = new Blob([res.data], { type: "image/jpg" });
            if (imageBlob.size) {
                const imageUrl = URL.createObjectURL(imageBlob);
                setFilesUrl((pre) => {
                    return { ...pre, [fileName]: imageUrl }
                });
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    useEffect(() => {
        if (status == 'authenticated') {
            const userId = session.user.id;
            if (fileData.aadhar_card != null) {
                uploadDocs(userId, 'aadhar_card', fileData.aadhar_card);
            }
            else if (fileData.cibil_report != null) {
                uploadDocs(userId, 'cibil_report', fileData.cibil_report);
            }
            else if (fileData.pan_card != null) {
                uploadDocs(userId, 'pan_card', fileData.pan_card);
            }
        }
    }, [fileData, session])

    useEffect(() => {

        let timeOutId: any = null;
        if (status == "authenticated" && isPreValFlag) {
            const userId = session.user.id
            timeOutId = setTimeout(() => {
                axios.post("http://localhost:10000/api/v1/form/upsert/step3", {
                    userId,
                    data: formData,
                })
                    .then((res) => {
                        console.log(res.data);
                    }).catch((err) => {
                        console.log('canceled');
                    })

            }, 3000);
        }
        return () => clearTimeout(timeOutId);

    }, [formData]);
    useEffect(() => {
        if (status == "authenticated") {
            const userId = session?.user?.id;
            const fetchData = async () => {
                const res = await axios.post(`${baseUrl}/api/v1/form/get/step3`, {
                    userId,
                });
                if (res.data.succes) {
                    setFormData({ ...formData, ...res.data.payload });
                    setTimeout(() => setIsPreValFlag(true), 2000);
                }
            }
            fetchData();
            getPreDocs(userId, 'pan_card');
            getPreDocs(userId, 'aadhar_card');
            getPreDocs(userId, 'cibil_report');
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
            <div className='flex flex-wrap justify-around  my-5'>
                {
                    Object.entries(filesUrl).map(([key, value]: [string, string]) => {
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
            <div className=' px-10 my-6 flex justify-around w-full '>
                <button onClick={() => state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                <button className='bg-blue-400 px-10 rounded  py-2' onClick={() => state?.next()}>Next</button>
            </div>
        </Box> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default Step4;
