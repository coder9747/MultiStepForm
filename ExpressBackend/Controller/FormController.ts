import { Request, Response, urlencoded } from "express";
import prisma from "../Db/Db.config";
import { deleteHeavyFile, removeEmptyAndSpecificValues } from "../Helpers/HelperAuth";
import { Step1, Step2, Step3, Step5, Step7 } from "@prisma/client";

//step1 
export const upsertFormStep1 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId && !data) {
        return res.json({ succes: false, message: "Data Required" });
    }
    try {
        //modifying data
        const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id', 'created_at', '']);

        const formData = await prisma.step1.upsert({
            where: { userId },
            update: {
                ...modifiedData,
            },
            create: {
                userId,
                ...modifiedData,
            }
        });
        return res.json({ succes: true, message: "Upserted Form Data", payload: formData });
    } catch (error: any) {
        console.log(error.message);
        res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const readFormStep1 = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "Cannot Find Form" });
    }
    try {
        const formData = await prisma.step1.findUnique({ where: { userId } });
        return res.json({ succes: true, message: "Data Fetched Succes", payload: formData });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }

}
//step2 
export const upsertFormStep2 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId && !data) {
        return res.json({ succes: false, message: "Data Required" });
    }
    const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id', 'created_at', '']);
    console.log(modifiedData);
    try {
        const formData = await prisma.step2.upsert({
            where: { userId },
            update: {
                ...modifiedData,
            },
            create: {
                userId,
                ...modifiedData,
            }
        });
        return res.json({ succes: true, message: "Upserted Form Data", });
    } catch (error: any) {
        console.log(error.message);
        res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const readFormStep2 = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "Cannot Find Form" });
    }
    try {
        const formData = await prisma.step2.findUnique({ where: { userId } });
        const newData = deleteHeavyFile(formData);
        return res.json({ succes: true, message: "Data Fetched Succes", payload: newData });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
//step2
export const uploadAddress = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!userId || !req.file) {
        return res.json({ succes: false, message: "Cannot Upload Data" });
    }
    const { buffer, mimetype } = req.file;
    try {
        await prisma.step2.upsert({
            where: { userId },
            update: {
                address_proof_file: buffer,
                address_proof_mimetype: mimetype,
            },
            create: {
                userId,
                address_proof_file: buffer,
                address_proof_mimetype: mimetype,
            }
        });
        return res.json({ succes: true, message: "File Uploaded Succesful" });


    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
//step3
export const upsertFormStep3 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
    try {
        const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id', 'created_at']);
        await prisma.step3.upsert({
            where: { userId },
            update: { ...modifiedData },
            create: {
                userId,
                ...modifiedData
            }
        });
        return res.json({ succes: true, message: "Upsert Succes" });

    } catch (error) {
        return res.json({ succes: false, message: "Credentials Required" });
    }

}
export const uploadStep3Docs = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const type = req.query.type as string;
    const file = req.file;
    if (!userId || !file || !type) {
        return res.json({ succes: false, message: "Upload Error" });
    };
    const buffer = req.file?.buffer;
    const mimetype = req.file?.mimetype;
    const data: Partial<Step3> = {};
    if (type == 'pan_card') {
        data.pan_card = buffer,
        data.pan_card_mimetype = mimetype;
    }
    else if (type == "aadhar_card") {
        data.aadhar_card = buffer,
        data.aadhar_card_mimetype = mimetype
    }
    else if (type == "cibil_report") {
        data.cibil_report = buffer,
        data.cibil_report_mimetype = mimetype
    }
    else {
        return res.json({ succes: false, message: "type Not Matched" });
    }
    try {
        await prisma.step3.upsert({
            where: { userId },
            update: {
                ...data
            },
            create: {
                userId,
                ...data
            }
        });
        return res.json({ succes: true, message: "Pan Uploaded Succesful" });
    } catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }

}
export const getStep3Data = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "UserId Required" });
    }
    try {
        const data = await prisma.step3.findUnique({
            where: { userId },

        });
        const modifiedData = removeEmptyAndSpecificValues(data, ['aadhar_card', 'pan_card', 'cibile_score']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    } catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
//step4
export const upsertStep4 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Details Required" });
    }
    try {
        const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id']);
        await prisma.step4.upsert({
            where: { userId },
            update: {
                ...modifiedData
            },
            create: {
                userId,
                ...modifiedData,
            }
        });
        res.json({ succes: true, message: "Upserted Succesful" });
    } catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }

}

export const getStep4Data = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = await prisma.step4.findUnique({
            where: { userId }
        });
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: data });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
//step 5
export const upsertStep5 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
    const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id']);
    try {
        await prisma.step5.upsert({
            where: { userId },
            update: {
                ...modifiedData,
            },
            create: {
                userId,
                ...modifiedData
            }
        });
        return res.json({ succes: true, message: "Step 5 Upserted Data Succesful" });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const getStep5Data = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    };
    try {
        const formData = await prisma.step5.findUnique({ where: { userId } });
        const modifiedData = removeEmptyAndSpecificValues(formData, ['userId', 'id', 'salarySlip', 'relievingLetter', 'experienceLetter']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });

    } catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const uploadDocsStep5 = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const type = req.query.type as string;
    const file = req.file;
    if (!userId || !file || !type) {
        return res.json({ succes: false, message: "Details Required" });
    };
    const buffer = req.file?.buffer;
    const mimeType = req.file?.mimetype;
    let data: Partial<Step5> = {}
    if (type == "salarySlip") {
        data.salarySlip = buffer;
        data.salarySlipMimeType = mimeType
    }
    else if (type == "relievingLetter") {
        data.relievingLetter = buffer;
        data.relievingLetterMimeType = mimeType;
    }
    else if (type == "experienceLetter") {
        data.experienceLetter = buffer;
        data.experienceLetterMimeType = mimeType;
    }
    else {
        return res.json({ succes: false, message: "Unknown Type" });
    }
    try {
        await prisma.step5.upsert({
            where: { userId },
            update: { ...data },
            create: { userId, ...data }
        })
        return res.json({ succes: true, message: "Data Uploaded Succesful" });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" })
    }

}
//step 6
export const upsertStep6 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    };
    const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id']);
    try {
        await prisma.step6.upsert({
            where: { userId },
            update: {
                ...modifiedData
            },
            create: {
                userId,
                ...modifiedData,
            }
        });
        return res.json({ succes: true, message: "Data Upserted Succesful" });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const upsertStep6Docs = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId || !req.file) {
        return res.json({ succes: false, message: "Data Required" });
    }

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    try {
        await prisma.step6.upsert({
            where: { userId },
            update: {
                certificate: buffer,
                certificateMimeType: mimeType
            },
            create: {
                userId,
                certificate: buffer,
                certificateMimeType: mimeType
            }
        });
        return res.json({ succes: true, message: "Data Uploaded Succesful" });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}
export const getStep6Data = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = await prisma.step6.findUnique({ where: { userId } });
        const modifiedData = removeEmptyAndSpecificValues(data, ['certificate', 'certificateMimeType']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });

    } catch (error) {
        return res.json({ succes: false, message: "User Id Required" });
    }
}
//step 7
export const upsertStep7 = async (req: Request, res: Response) => {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succces: false, message: "Deails Required" });
    };
    const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'id']);
    try {
        await prisma.step7.upsert({
            where: { userId },
            update: {
                ...modifiedData
            },
            create: {
                userId,
                ...modifiedData
            }
        });
        return res.json({ succes: true, message: "Upserted Step 7 Data" });
    } catch (error) {
        return res.json({ succces: false, message: "Internal Server Error" });
    }
}
export const upsertStep7Doc = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const type = req.query.type;
    console.log(type, userId, req.file);
    if (!userId || !req.file || !type) {
        return res.json({ succes: false, message: "Data Required" });
    }
    try {
        const buffer = req.file.buffer;
        const memeType = req.file.mimetype;
        const data: Partial<Step7> = {};
        if (type == "aadharUpload") {
            data.aadharUpload = buffer;
            data.aadharUploadMimeType = memeType;
        }
        else if (type == 'panUpload') {
            data.panUpload = buffer;
            data.panUploadMimeType = memeType;
        }
        else if (type == "drivingLicenseUpload") {
            data.drivingLicenseUpload = buffer;
            data.drivingLicenseUploadMimeType = memeType;
        }
        else {
            return res.json({ succes: false, message: "Undefined  Type" });
        }
        await prisma.step7.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data
            }
        });
        return res.json({ succes: true, message: "Document Uploaded Succesful" });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });

    }
}
export const getStep7Data = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    };
    try {
        const data = await prisma.step7.findUnique({ where: { userId } });
        const modifiedData = removeEmptyAndSpecificValues(data, ['userId', 'aadharUpload', 'aadharUploadMimeType', 'panUpload', 'panUploadMimeType', 'drivingLicenseUpload', 'drivingLicenseUploadMimeType', 'id']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    } catch (error) {
        return res.json({ succes: false, message: " Internal Server Error" });
    }

}
export const getFormData = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = await prisma.user.findUnique({
            where: { id }, include: {
                step1: true,
                step2: true,
                step3: true,
                Step4: true,
                Step5: true, Step6: true, Step7: true
            }
        });
        return res.json({ succes: true, message: "Data Fetched Succesful", data });

    } catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
}







