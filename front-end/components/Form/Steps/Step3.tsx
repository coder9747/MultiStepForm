import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { FormContext } from '@/components/Providers/FormProvider';
import { useSession } from 'next-auth/react';
import axios from 'axios';

let baseUrl = 'http://localhost:10000';

interface ReferenceFormFields {
    ref_name?: string;
    ref_designation?: string;
    company_name?: string;
    ref_contact_num?: string;
    ref_email?: string;
    ref_relationship?: string;
}

const fields = [
    { name: "ref_name", label: "Reference Name", type: "text" },
    { name: "ref_designation", label: "Reference Designation", type: "text" },
    { name: "company_name", label: "Reference Company Name", type: "text" },
    { name: "ref_contact_num", label: "Reference Contact Number", type: "text" },
    { name: "ref_email", label: "Reference Email", type: "email" },
    { name: "ref_relationship", label: "Relationship to Candidate", type: "text" },
];

const initialData: ReferenceFormFields = {
    ref_name: "",
    ref_designation: "",
    company_name: "",
    ref_contact_num: "",
    ref_email: "",
    ref_relationship: "",
};

const Step3 = () => {
    const session = useSession();
    const [formData, setFormData] = useState<ReferenceFormFields>(initialData);
    const { state } = useContext(FormContext);
    const [isPreValFlag, setIsPreValFlag] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        let timeOut: NodeJS.Timeout | null = null;
        if (session.status == "authenticated" && isPreValFlag) {
            timeOut = setTimeout(() => {
                axios.post(`${baseUrl}/api/v1/form/upsert/step4`, {
                    userId: session?.data.user.id,
                    data: formData
                })
                    .then((res) => {
                        console.log(res.data);
                    }).catch((err) => {
                        console.log('cancel')
                    })
            }, 3000);
        };
        return () => clearTimeout(timeOut);
    }, [formData])
    useEffect(() => {
        if (session.status == "authenticated") {
            axios.post(`${baseUrl}/api/v1/form/get/step4`, { userId: session?.data?.user?.id })
                .then((res) => {
                    setFormData({ ...formData, ...res.data.payload });
                }).catch((error) => {
                    console.error(error);
                }).finally
            {
                setTimeout(() => setIsPreValFlag(true), 2000);
            }
        }
    }, [session])

    return (
        (session.status == "authenticated") ? <div >
            <Grid container spacing={2} my={2} rowGap={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                {fields.map(field => (
                    <Grid item xs={12} sm={4} md={4} lg={3} key={field.name}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label={field.label}
                            type={field.type}
                            name={field.name}
                            value={formData[field.name as keyof ReferenceFormFields] || ""}
                            onChange={handleChange}
                        />
                    </Grid>
                ))}
                <div className=' px-10 flex justify-around w-full '>
                    <button onClick={() => state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                    <button className='bg-blue-400 px-10 rounded  py-2' onClick={() => state?.next()}>Next</button>
                </div>
            </Grid>
        </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default Step3;
