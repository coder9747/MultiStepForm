import express from "express";
import {  getAnyDocsFile, getFormData, getStep3Data, getStep4Data, getStep5Data, getStep6Data, getStep7Data, readFormStep1, readFormStep2, uploadAddress, uploadDocsStep5, uploadStep3Docs, upsertFormStep1, upsertFormStep2, upsertFormStep3, upsertStep4, upsertStep5, upsertStep6, upsertStep6Docs, upsertStep7, upsertStep7Doc } from "../Controller/FormController";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({storage});



const FormRouter = express.Router();


FormRouter.post("/upsert/step1", upsertFormStep1);
FormRouter.post('/get/step1', readFormStep1);
FormRouter.post("/upsert/step2", upsertFormStep2);
FormRouter.post('/get/step2', readFormStep2);
FormRouter.post("/uploadfile/address",upload.single("file"),uploadAddress);
FormRouter.post("/upsert/step3",upsertFormStep3);
FormRouter.post("/upload/docs",upload.single("file"),uploadStep3Docs);
FormRouter.post("/get/step3",getStep3Data);
FormRouter.post("/upsert/step4",upsertStep4);
FormRouter.post("/get/step4",getStep4Data);
FormRouter.post("/upsert/step5",upsertStep5);
FormRouter.post("/get/step5",getStep5Data);
FormRouter.post("/uploaddocs/step5",upload.single("file"),uploadDocsStep5);
FormRouter.post("/upsert/step6",upsertStep6);
FormRouter.post("/upload/step6doc",upload.single("file"),upsertStep6Docs);
FormRouter.post("/getstep6data",getStep6Data);
FormRouter.post("/upsert/step7",upsertStep7);
FormRouter.post("/upsert/doc/step7",upload.single("file"),upsertStep7Doc);
FormRouter.post("/get/step7",getStep7Data);
FormRouter.post("/get/data",getFormData);
FormRouter.post("/getanydocs",getAnyDocsFile);

export default FormRouter;