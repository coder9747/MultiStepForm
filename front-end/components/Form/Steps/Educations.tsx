import React, { useState, useContext, useEffect } from 'react';
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import { FormContext } from '@/components/Providers/FormProvider';
import axios, { Axios } from 'axios';
import { useSession } from 'next-auth/react';
import { checkFile } from '@/components/Helpers/CheckFileSize';
import { supportedImageTypes } from './Step2';

interface EducationFormFields {
    course_name?: string;
    heighest_qualify?: string;
    university_name?: string;
    country?: string;
    state?: string;
    city?: string;
    duration_start?: string;
    duration_end?: string;
    passing_year?: string;
    gpa_percentage?: string;
    roll_number?: string;
    certificate_number?: string;
    certificate?: File | null;
}

const fields = [
    { name: "course_name", label: "Course Name", type: "text" },
    {
        name: "heighest_qualify",
        label: "Highest Qualification",
        type: "select",
        options: [
            { label: "12th", value: "12th" },
            { label: "Graduation", value: "Graduation" },
            { label: "Master's", value: "Master's" },
            { label: "PhD", value: "PhD" },
            { label: "Other", value: "Other" },
        ],
    },
    { name: "university_name", label: "College/University Name", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "duration_start", label: "Start Year", type: "date" },
    { name: "duration_end", label: "End Year", type: "date" },
    { name: "passing_year", label: "Passing Year", type: "date" },
    { name: "gpa_percentage", label: "GPA/Percentage", type: "text" },
    { name: "roll_number", label: "Roll Number", type: "text" },
    { name: "certificate_number", label: "Highest Education Certificate Number", type: "text" },
    { name: "certificate", label: "Upload Highest Certificate", type: "file" },
];

const initialData: EducationFormFields = {
    course_name: "",
    heighest_qualify: "",
    university_name: "",
    country: "",
    state: "",
    city: "",
    duration_start: "",
    duration_end: "",
    passing_year: "",
    gpa_percentage: "",
    roll_number: "",
    certificate_number: "",
};

const EducationForm = () => {
    const session = useSession();
    const [formData, setFormData] = useState<EducationFormFields>(initialData);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const { state } = useContext(FormContext);
    const [isPreValFlag, setIsPreValFlag] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (session.status == "authenticated") {
            const userId = session?.data?.user.id;
            const { name, files } = e.target;
            if (checkFile(files[0]) && supportedImageTypes.includes(files[0].type)) {
                const formData = new FormData();
                formData.append("file", files[0]);
                axios.post(`http://localhost:10000/api/v1/form/upload/step6doc?userId=${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    if (res.data.succes) {
                        alert("File Uploade Succesful");
                        const imageUrl = URL.createObjectURL(files[0]);
                        setFileUrl(imageUrl);
                    }
                    setIsFileUploaded(res.data.succes);
                }
                ).catch((error) => console.error(error));

            }
            else {
                alert("File Should Be Less Than 200 Kb And In Jpeg Jpg Png format");
            }

        }
        else {
            alert("You Are Not Authanticated");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        state.next();
        console.log(formData);
    };
    useEffect(() => {
        let token = () => { };
        if (session.status == "authenticated" && isPreValFlag) {
            const userId = session?.data.user.id;
            const insertData = async () => {
                axios.post("http://localhost:10000/api/v1/form/upsert/step6", {
                    userId,
                    data: formData,
                }, {
                    cancelToken: new axios.CancelToken((c) => token = c),
                }).then((res) => {
                    console.log(res.data);
                }).catch(err => {
                    console.error(err);
                }
                )
            }
            insertData();
        }
        return () => token();

    }, [formData]);
    useEffect(() => {
        if (session.status == "authenticated") {
            const userId = session?.data?.user?.id;
            axios.post("http://localhost:10000/api/v1/form/getanydocs", {
                userId,
                stepNumber: 'step6',
                fileToGet: 'certificate'
            }, { responseType: "arraybuffer" }).then((res) => {
                const imageBlob = new Blob([res.data], { type: "image/jpg" });
                if (imageBlob.size) {
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setFileUrl(imageUrl);
                }
            }).catch((error) => {
                console.log(error);
            })

            axios.post("http://localhost:10000/api/v1/form/getstep6data", { userId })
                .then((res) => {
                    setFormData((pre) => {
                        return { ...pre, ...res.data.payload }
                    });
                }).catch((err) => console.error(err)).finally
            {
                setTimeout(() => {
                    setIsPreValFlag(true);
                }, 2000)
            }



        }
    }, [session])

    return (
        session.status == "authenticated" ?
            <div >
                <Grid container spacing={2} my={2} rowGap={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                    {fields.map(field => (
                        <Grid item xs={12} sm={4} md={4} lg={3} key={field.name}>
                            {field.type === 'select' ? (
                                <TextField
                                    select
                                    fullWidth
                                    variant="outlined"
                                    label={field.label}
                                    name={field.name}
                                    value={formData[field.name as keyof EducationFormFields] || ""}
                                    onChange={handleChange}
                                >
                                    {field.options?.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : field.type === 'file' ? (
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
                                    label={field.label}
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name as keyof EducationFormFields] || ""}
                                    onChange={handleChange}
                                    InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                                />
                            )}
                        </Grid>
                    ))}
                </Grid>
                {fileUrl && <div className='ms-10 w-56'>
                    <img src={fileUrl} alt="" />
                    <p className='text-sm font-bold my-2 text-center'>Highest Certificate</p>
                </div>}
                <div className=' px-10 flex justify-around w-full '>
                    <button  onClick={() => state?.pre()} className='bg-blue-400 py-2 px-10 rounded disabled:bg-gray-600 disabled:text-white '>Pre</button>
                    <button className='bg-blue-400 px-10 rounded  py-2' onClick={() => state?.next()}>Next</button>

                </div>

            </div> : <div className='h-screen flex justify-center items-center'>Loading...</div>
    );
};

export default EducationForm;
