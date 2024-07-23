import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Input, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { FormContext } from '@/components/Providers/FormProvider';
import { useSession } from 'next-auth/react';
import axios from 'axios';


const supportedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

interface EmploymentFormFields {
    companyName?: string;
    companyEmail?: string;
    companyLocation?: string;
    employeeId?: string;
    designation?: string;
    from?: string;
    to?: string;
    salary?: string;
    salarySlip?: File | null;
    reasonForLeaving?: string;
    relievingLetter?: File | null;
    experienceLetter?: File | null;
}

const fields = [
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "companyEmail", label: "Company Email ID", type: "email" },
    { name: "companyLocation", label: "Company Location", type: "text" },
    { name: "employeeId", label: "Employee ID", type: "text" },
    { name: "designation", label: "Designation", type: "text" },
    { name: "from", label: "From", type: "date" },
    { name: "to", label: "To", type: "date" },
    { name: "salary", label: "Salary in CTC(LPA)", type: "text" },
    { name: "salarySlip", label: "Upload Salary Slip", type: "file" },
    { name: "reasonForLeaving", label: "Reason for Leaving", type: "text" },
    { name: "relievingLetter", label: "Upload Relieving Letter", type: "file" },
    { name: "experienceLetter", label: "Upload Experience Letter", type: "file" },
];

const initialData: EmploymentFormFields = {
    companyName: "",
    companyEmail: "",
    companyLocation: "",
    employeeId: "",
    designation: "",
    from: "",
    to: "",
    salary: "",
    salarySlip: null,
    reasonForLeaving: "",
    relievingLetter: null,
    experienceLetter: null,
};

const Step5 = () => {
    const session = useSession();
    const [formData, setFormData] = useState<EmploymentFormFields>(initialData);
    const { state } = useContext(FormContext);
    const [file, setFile] = useState({ salarySlip: null, relievingLetter: null, experienceLetter: null });
    const [fileUrls, setFileUrls] = useState(false);
    const [isPreValFlag, setIsPreValFlag] = useState<boolean>(false);

    const uploadDocs = async (name: string, file: File, userId: string) => {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://localhost:10000/api/v1/form/uploaddocs/step5?userId=${userId}&type=${name}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.succes) {
                alert(name + " Uploaded")
            }
            else {
                alert("Failed To Upload")
            }
        }).catch(console.error);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files && files[0]) {
            if (!supportedImageTypes.includes(files[0].type)) {
                alert("File Not Supported");
                return;
            }
            if (session.status == "authenticated") {
                const userId = session?.data?.user?.id;
                uploadDocs(name, files[0], userId);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    useEffect(() => {
        if (session.status == "authenticated") {
            const userId = session.data.user.id;
            axios.post("http://localhost:10000/api/v1/form/get/step5", { userId })
                .then((res) => {
                    if (res.data.succes && res.data.payload) {
                        setFormData({ ...formData, ...res.data.payload });
                    }
                    setTimeout(() => setIsPreValFlag(true), 2000);
                })
        }
    }, [session])
    useEffect(() => {
        if (session.status == "authenticated" && isPreValFlag) {
            axios.post("http://localhost:10000/api/v1/form/upsert/step5", {
                userId: session.data.user.id,
                data: formData
            }).then((res) => {
                console.log(res.data);
            })
        }

    }, [session, formData])
    return (
        session.status == "authenticated" ? <div>
            <Grid container spacing={2} my={2} rowGap={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                {fields.map(field => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={field.name}>
                        {field.type === 'file' ? (
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="file"
                                name={field.name}
                                label={field.label}
                                InputLabelProps={{ shrink: true }}
                                onChange={handleChange}
                            />
                        ) : (
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                value={field.type === 'file' ? '' : formData[field.name as keyof EmploymentFormFields] || ""}
                                onChange={handleChange}
                                InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                            />
                        )}
                    </Grid>
                ))}

            </Grid>
            <div className=' px-10 flex justify-around w-full '>
                <button onClick={() => state.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                <button className='bg-blue-400 px-10 rounded  py-2' onClick={() => state?.next()}>Next</button>
            </div>
        </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default Step5;
