"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnyDocsFile = exports.getFormData = exports.getStep7Data = exports.upsertStep7Doc = exports.upsertStep7 = exports.getStep6Data = exports.upsertStep6Docs = exports.upsertStep6 = exports.uploadDocsStep5 = exports.getStep5Data = exports.upsertStep5 = exports.getStep4Data = exports.upsertStep4 = exports.getStep3Data = exports.uploadStep3Docs = exports.upsertFormStep3 = exports.uploadAddress = exports.readFormStep2 = exports.upsertFormStep2 = exports.readFormStep1 = exports.upsertFormStep1 = void 0;
const Db_config_1 = __importDefault(require("../Db/Db.config"));
const HelperAuth_1 = require("../Helpers/HelperAuth");
//step1 
const upsertFormStep1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId && !data) {
        return res.json({ succes: false, message: "Data Required" });
    }
    try {
        //modifying data
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id', 'created_at', '']);
        const formData = yield Db_config_1.default.step1.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Upserted Form Data", payload: formData });
    }
    catch (error) {
        console.log(error.message);
        res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertFormStep1 = upsertFormStep1;
const readFormStep1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "Cannot Find Form" });
    }
    try {
        const formData = yield Db_config_1.default.step1.findUnique({ where: { userId } });
        return res.json({ succes: true, message: "Data Fetched Succes", payload: formData });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.readFormStep1 = readFormStep1;
//step2 
const upsertFormStep2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId && !data) {
        return res.json({ succes: false, message: "Data Required" });
    }
    const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id', 'created_at', '']);
    console.log(modifiedData);
    try {
        const formData = yield Db_config_1.default.step2.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Upserted Form Data", });
    }
    catch (error) {
        console.log(error.message);
        res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertFormStep2 = upsertFormStep2;
const readFormStep2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "Cannot Find Form" });
    }
    try {
        const formData = yield Db_config_1.default.step2.findUnique({ where: { userId } });
        const newData = (0, HelperAuth_1.deleteHeavyFile)(formData);
        return res.json({ succes: true, message: "Data Fetched Succes", payload: newData });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.readFormStep2 = readFormStep2;
//step2
const uploadAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    if (!userId || !req.file) {
        return res.json({ succes: false, message: "Cannot Upload Data" });
    }
    const { buffer, mimetype } = req.file;
    try {
        yield Db_config_1.default.step2.upsert({
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
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.uploadAddress = uploadAddress;
//step3
const upsertFormStep3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
    try {
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id', 'created_at']);
        yield Db_config_1.default.step3.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Upsert Succes" });
    }
    catch (error) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
});
exports.upsertFormStep3 = upsertFormStep3;
const uploadStep3Docs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.query.userId;
    const type = req.query.type;
    const file = req.file;
    if (!userId || !file || !type) {
        return res.json({ succes: false, message: "Upload Error" });
    }
    ;
    const buffer = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
    const mimetype = (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype;
    const data = {};
    if (type == 'pan_card') {
        data.pan_card = buffer,
            data.pan_card_mimetype = mimetype;
    }
    else if (type == "aadhar_card") {
        data.aadhar_card = buffer,
            data.aadhar_card_mimetype = mimetype;
    }
    else if (type == "cibil_report") {
        data.cibil_report = buffer,
            data.cibil_report_mimetype = mimetype;
    }
    else {
        return res.json({ succes: false, message: "type Not Matched" });
    }
    try {
        yield Db_config_1.default.step3.upsert({
            where: { userId },
            update: Object.assign({}, data),
            create: Object.assign({ userId }, data)
        });
        return res.json({ succes: true, message: "Pan Uploaded Succesful" });
    }
    catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.uploadStep3Docs = uploadStep3Docs;
const getStep3Data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "UserId Required" });
    }
    try {
        const data = yield Db_config_1.default.step3.findUnique({
            where: { userId },
        });
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['aadhar_card', 'pan_card', 'cibil_report']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    }
    catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.getStep3Data = getStep3Data;
//step4
const upsertStep4 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Details Required" });
    }
    try {
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id']);
        yield Db_config_1.default.step4.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        res.json({ succes: true, message: "Upserted Succesful" });
    }
    catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertStep4 = upsertStep4;
const getStep4Data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = yield Db_config_1.default.step4.findUnique({
            where: { userId }
        });
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: data });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.getStep4Data = getStep4Data;
//step 5
const upsertStep5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
    const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id']);
    try {
        yield Db_config_1.default.step5.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Step 5 Upserted Data Succesful" });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertStep5 = upsertStep5;
const getStep5Data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    ;
    try {
        const formData = yield Db_config_1.default.step5.findUnique({ where: { userId } });
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(formData, ['userId', 'id', 'salarySlip', 'relievingLetter', 'experienceLetter']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    }
    catch (error) {
        console.log(error);
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.getStep5Data = getStep5Data;
const uploadDocsStep5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = req.query.userId;
    const type = req.query.type;
    const file = req.file;
    if (!userId || !file || !type) {
        return res.json({ succes: false, message: "Details Required" });
    }
    ;
    const buffer = (_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer;
    const mimeType = (_d = req.file) === null || _d === void 0 ? void 0 : _d.mimetype;
    let data = {};
    if (type == "salarySlip") {
        data.salarySlip = buffer;
        data.salarySlipMimeType = mimeType;
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
        yield Db_config_1.default.step5.upsert({
            where: { userId },
            update: Object.assign({}, data),
            create: Object.assign({ userId }, data)
        });
        return res.json({ succes: true, message: "Data Uploaded Succesful" });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.uploadDocsStep5 = uploadDocsStep5;
//step 6
const upsertStep6 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succes: false, message: "Credentials Required" });
    }
    ;
    const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id']);
    try {
        yield Db_config_1.default.step6.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Data Upserted Succesful" });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertStep6 = upsertStep6;
const upsertStep6Docs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    if (!userId || !req.file) {
        return res.json({ succes: false, message: "Data Required" });
    }
    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    try {
        yield Db_config_1.default.step6.upsert({
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
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertStep6Docs = upsertStep6Docs;
const getStep6Data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = yield Db_config_1.default.step6.findUnique({ where: { userId } });
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['certificate', 'certificateMimeType']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    }
    catch (error) {
        return res.json({ succes: false, message: "User Id Required" });
    }
});
exports.getStep6Data = getStep6Data;
//step 7
const upsertStep7 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, data } = req.body;
    if (!userId || !data) {
        return res.json({ succces: false, message: "Deails Required" });
    }
    ;
    const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'id']);
    try {
        yield Db_config_1.default.step7.upsert({
            where: { userId },
            update: Object.assign({}, modifiedData),
            create: Object.assign({ userId }, modifiedData)
        });
        return res.json({ succes: true, message: "Upserted Step 7 Data" });
    }
    catch (error) {
        return res.json({ succces: false, message: "Internal Server Error" });
    }
});
exports.upsertStep7 = upsertStep7;
const upsertStep7Doc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const type = req.query.type;
    console.log(type, userId, req.file);
    if (!userId || !req.file || !type) {
        return res.json({ succes: false, message: "Data Required" });
    }
    try {
        const buffer = req.file.buffer;
        const memeType = req.file.mimetype;
        const data = {};
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
        yield Db_config_1.default.step7.upsert({
            where: { userId },
            update: data,
            create: Object.assign({ userId }, data)
        });
        return res.json({ succes: true, message: "Document Uploaded Succesful" });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.upsertStep7Doc = upsertStep7Doc;
const getStep7Data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    ;
    try {
        const data = yield Db_config_1.default.step7.findUnique({ where: { userId } });
        const modifiedData = (0, HelperAuth_1.removeEmptyAndSpecificValues)(data, ['userId', 'aadharUpload', 'aadharUploadMimeType', 'panUpload', 'panUploadMimeType', 'drivingLicenseUpload', 'drivingLicenseUploadMimeType', 'id']);
        return res.json({ succes: true, message: "Data Fetched Succesful", payload: modifiedData });
    }
    catch (error) {
        return res.json({ succes: false, message: " Internal Server Error" });
    }
});
exports.getStep7Data = getStep7Data;
const getFormData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.json({ succes: false, message: "User Id Required" });
    }
    try {
        const data = yield Db_config_1.default.user.findUnique({
            where: { id }, include: {
                step1: true,
                step2: true,
                step3: true,
                Step4: true,
                Step5: true, Step6: true, Step7: true
            }
        });
        return res.json({ succes: true, message: "Data Fetched Succesful", data });
    }
    catch (error) {
        return res.json({ succes: false, message: "Internal Server Error" });
    }
});
exports.getFormData = getFormData;
//get any docs
const getAnyDocsFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructure and validate inputs
    const { userId, stepNumber, fileToGet } = req.body;
    if (!userId || !stepNumber || !fileToGet) {
        return res.status(400).json({ success: false, message: "Data Required To Fetch" });
    }
    ;
    try {
        const stepModel = Db_config_1.default[stepNumber];
        // Fetch the document and select the required field
        //@ts-ignore
        const data = yield stepModel.findUnique({
            where: { userId },
            select: {
                [fileToGet]: true
            }
        });
        res.setHeader("Content-Type", "image/*");
        return res.send(data[fileToGet]);
    }
    catch (error) {
        console.log(error);
        console.error("Error fetching file:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAnyDocsFile = getAnyDocsFile;
