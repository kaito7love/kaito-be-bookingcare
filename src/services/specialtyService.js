import { reject } from "lodash"
import db from "../models";
require('dotenv').config();

let postSpecialtyDescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.specialty || !data.descriptionMarkdown || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    message: "Missing parameters",
                })
            } else {

                let specialty = await db.Specialty.findOrCreate({
                    where: { name: data.specialty, },
                    defaults: {
                        descriptionMarkdown: data.descriptionMarkdown,
                        descriptionHTML: data.descriptionHTML,
                        description: data.description,
                        // image: data.image, // update later
                    }
                });

                resolve({
                    errCode: 0,
                    message: "OK",
                    data: specialty
                })
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let specialty = await db.Specialty.findAll();
            resolve({
                errCode: 0,
                message: "Get all specialty successful",
                data: specialty
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}

let getDetailSpecialtyById = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                reject({
                    errCode: -1,
                    message: "Missing parameter",
                });
            } else {
                let data = {};

                data = await db.Specialty.findOne({
                    where: {
                        id: specialtyId
                    },
                    attributes: ['descriptionMarkdown', 'descriptionHTML'],
                })

                if (data) {
                    let doctorSpecialty = {};
                    if (location == 'all') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId: specialtyId,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId: specialtyId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
                }

                resolve({
                    errCode: 0,
                    message: "Get Data Specialty Successful!",
                    data: data || {}
                })



            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail specialty",
            });
        }
    })
}
export default {
    postSpecialtyDescription,
    getAllSpecialty,
    getDetailSpecialtyById,
}