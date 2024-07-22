"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyAndSpecificValues = exports.deleteHeavyFile = exports.userWithoutPasswored = void 0;
const userWithoutPasswored = (user) => {
    delete user.password;
    return user;
};
exports.userWithoutPasswored = userWithoutPasswored;
const deleteHeavyFile = (formData) => {
    formData === null || formData === void 0 ? true : delete formData.address_proof_file;
    formData === null || formData === void 0 ? true : delete formData.address_proof_mimetype;
    return formData;
};
exports.deleteHeavyFile = deleteHeavyFile;
const removeEmptyAndSpecificValues = (obj, excludeKeys) => {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== "" && !excludeKeys.includes(key)));
};
exports.removeEmptyAndSpecificValues = removeEmptyAndSpecificValues;
