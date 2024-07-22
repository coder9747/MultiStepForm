import React, { useState, useEffect, useContext } from 'react';
import { Grid, MenuItem, TextField, InputLabel, FormControl, Button } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { FormContext } from '@/components/Providers/FormProvider';
import { toast } from 'react-toastify';

const fields = [
    { name: "country_id", label: "Country", type: "text" },
    { name: "state_id", label: "State", type: "text" },
    { name: "district_id", label: "District", type: "text" },
    { name: "city_id", label: "City", type: "text" },
    { name: "postal_id", label: "Zip/Postal Code", type: "text" },
    { name: "house_type", label: "House Type", type: "select", options: ["Apartment", "House", "Condo"] },
    { name: "stay_from_date", label: "Stay From Date", type: "date" },
    { name: "stay_till_date", label: "Stay Till Date", type: "date" },
    { name: "full_address", label: "Full Address", type: "text" },
    // { name: "address_proof_file", label: "Address Proof File", type: "file" }
];
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const initialData = {
    country_id: "",
    state_id: "",
    district_id: "",
    city_id: "",
    postal_id: "",
    house_type: "",
    stay_from_date: "",
    stay_till_date: "",
    full_address: "",
};

const Step2 = () => {
    const session = useSession();
    const { state } = useContext(FormContext);
    const [formData, setFormData] = useState(initialData);
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | boolean>(false);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // state.next();
    };
    useEffect(() => {
        let token: any = () => { };
        if (session.status == "authenticated") {
            const userId = session.data.user.id;
            axios.post("http://localhost:10000/api/v1/form/upsert/step2", {
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
        if (session.status == "authenticated") {
            const userId = session.data.user.id;
            axios.post("http://localhost:10000/api/v1/form/get/step2", { userId }).then((res) => {
                const data = res.data;
                if (data.payload) {
                    setFormData({ ...formData, ...data.payload });
                }
            }).catch((error) => {
                console.error('failed to get previews data');
            })
        };
    }, [session]);
    const handleFile = async (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    useEffect(() => {
        if (file) {
            const isSupported = supportedImageTypes.includes(file?.type);
            if (isSupported) {
                const formData = new FormData();
                formData.append('file', file);
                const userId = session.data?.user.id;
                axios.post(`http://localhost:10000/api/v1/form/uploadfile/address?userId=${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    const data = res.data;
                    if (data.succes) {
                        alert("file uploaded");
                    }
                }).finally
                {
                    setFileError(false);
                }
            }
            else {
                setFile(null);
                setFileError(true);
            }
        }
    }, [file])
    return (
        session.status == "authenticated"  ? <div >
            <Grid container spacing={2} my={'20px'} rowGap={3} px={{
                xs: "20px", sm: "30px", md: '40px', lg: '50px'
            }}>
                {fields.map(field => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={field.name}>
                        {field.type === 'select' ? (
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    label={field.label}
                                >
                                    {field.options?.map(option => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        ) : field.type === 'file' ? (
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                                InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                            />
                        )}

                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4} lg={3} >
                    <TextField
                        fullWidth
                        variant="outlined"
                        type={'file'}
                        onChange={handleFile}
                        error={fileError}
                        helperText={'Please Select png , jpg , jpeg'}
                    />
                </Grid>
            </Grid>
            <div className=' px-10 flex justify-around w-full '>
                <button  onClick={()=>state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                <button className='bg-blue-400 px-10 rounded  py-2' onClick={()=>state?.next()}>Next</button>
            </div>
        </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default Step2;
