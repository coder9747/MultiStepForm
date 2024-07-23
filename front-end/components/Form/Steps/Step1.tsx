import React, { useContext, useEffect, useState } from 'react';
import { Grid, MenuItem, TextField, InputLabel, FormControl, Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FormContext } from '@/components/Providers/FormProvider';

interface Step1 {
  notify_candidate?: string;
  notify_client?: string;
  notify_admin?: string;
  form_filled_by?: string;
  client_id?: string;
  process?: string;
  name?: string;
  gender?: string;
  dob?: Date | string;
  father_name?: string;
  mobile_no?: string;
  email_id?: string;
}

const step1fields = [
  {
    name: "notify_candidate",
    label: "Email Notification to candidate",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    name: "notify_client",
    label: "E-mail Notification to client",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    name: "notify_admin",
    label: "E-mail Notification to admin",
    type: "select",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    name: "form_filled_by",
    label: "Form Filled By",
    type: "select",
    options: [
      { label: "Candidate", value: "Candidate" },
      { label: "Data Internal Team", value: "Data Internal Team" },
    ],
  },
  {
    name: "client_id",
    label: "Company (Auto Assign to Client Portal)",
    type: "text",
  },
  {
    name: "process",
    label: "Process (Auto Assign to Client Portal)",
    type: "text",
  },
  { name: "name", label: "Candidate Name", type: "text" },
  {
    name: "gender",
    label: "Candidate Gender",
    type: "select",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
    required: true,
  },
  { name: "dob", label: "Candidate DOB", type: "date" },
  { name: "father_name", label: "Candidate Father's Name", type: "text" },
  { name: "mobile_no", label: "Candidate Mobile No", type: "text" },
  { name: "email_id", label: "Candidate Email ID", type: "email" },
];

const initialData = {
  notify_candidate: "",
  notify_client: "",
  notify_admin: "",
  form_filled_by: "",
  client_id: "",
  process: "",
  name: "",
  gender: "",
  dob: "",
  father_name: "",
  mobile_no: "",
  email_id: "",
};

const Step1 = () => {
  const session = useSession();
  const [step1Data, setStep1Data] = useState<Step1>(initialData);
  const [isPreValFlag, setIsPreValFlag] = useState(false);
  useEffect(() => {
    let timeOut: NodeJS.Timeout | null = null;
    if (session.status == "authenticated" && isPreValFlag) {
      const userId = session.data.user.id;
      timeOut = setTimeout(() => {
        axios.post("http://localhost:10000/api/v1/form/upsert/step1", {
          userId,
          data: step1Data,
        })
          .then((res) => {
            console.log(res.data);
          }).catch((err) => {
            console.log('canceled');
          })
      }, 3000);
    }
    return () => clearTimeout(timeOut);

  }, [step1Data]);
  useEffect(() => {
    if (session.status == "authenticated") {
      const userId = session.data.user.id;
      axios.post("http://localhost:10000/api/v1/form/get/step1", { userId }).then((res) => {
        const data = res.data;
        if (data.payload) {
          setStep1Data({ ...step1Data, ...data.payload });
        }
      }).catch((error) => {
        console.error('failed to get previews data');
      }).finally(() => setTimeout(() => setIsPreValFlag(true), 500));
    };
  }, [session]);

  const { state } = useContext(FormContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setStep1Data(prev => ({ ...prev, [name as keyof Step1]: value }));
  };
  const handleNext = () => {

    if (step1Data.gender == null) {
      alert("Gender Required");
      return;
    }
    else {
      state?.next();
    }
  }

  return (
    session.status == "authenticated" ? <div>
      <Grid container spacing={2} my={'20px'} rowGap={3} px={
        { xs: "20px", sm: "30px", md: '40px', lg: '50px' }
      }>
        {step1fields.map(field => (
          <Grid item xs={12} sm={4} md={4} lg={3} key={field.name}>



            {field.type === 'select' ? (
              <FormControl fullWidth variant="outlined">
                <TextField
                  select
                  name={field.name}
                  value={step1Data[field.name as keyof Step1] || ""}
                  onChange={handleChange}
                  label={field.label}
                >
                  {field.options?.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                label={field.label}
                type={field.type}
                name={field.name}
                value={step1Data[field.name as keyof Step1] || ""}
                onChange={handleChange}
                InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
              />
            )}
          </Grid>
        ))}
        <div className=' px-10 flex justify-around w-full '>
          <button disabled={true} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
          <button className='bg-blue-400 px-10 rounded  py-2' onClick={handleNext}>Next</button>

        </div>
      </Grid>

    </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>


  );
};

export default Step1;
