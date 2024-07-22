import { Step2 } from "@prisma/client";

export const userWithoutPasswored = (user: any) => {
    delete user.password;
    return user;
}
export const deleteHeavyFile = (formData: any) => {
    delete formData?.address_proof_file;
    delete formData?.address_proof_mimetype;
    return formData;
}
export const removeEmptyAndSpecificValues = (obj: any, excludeKeys: string[]) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value != null && value !== "" && !excludeKeys.includes(key))
    );
};