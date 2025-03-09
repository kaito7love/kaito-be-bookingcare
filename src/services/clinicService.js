import { reject } from "lodash"
import db from "../models";
require('dotenv').config();

let postClinicDescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);

            if (!data.clinicName || !data.descriptionMarkdown || !data.descriptionHTML || !data.address) {
                resolve({
                    errCode: 1,
                    message: "Missing parameters",
                })
            } else {

                let Clinic = await db.Clinic.findOrCreate({
                    where: { name: data.clinicName, },
                    defaults: {
                        descriptionMarkdown: data.descriptionMarkdown,
                        descriptionHTML: data.descriptionHTML,
                        description: data.description,
                        address: data.address,
                        // image: data.image, // update later
                    }
                });

                resolve({
                    errCode: 0,
                    message: "OK",
                    data: Clinic
                })
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let specialty = await db.Clinic.findAll();
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

let getDetailClinicById = (clinicId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId || !location) {
                reject({
                    errCode: -1,
                    message: "Missing parameter",
                });
            } else {
                let data = {};

                data = await db.Clinic.findOne({
                    where: {
                        id: clinicId
                    },
                    attributes: ['descriptionMarkdown', 'descriptionHTML'],
                })

                if (data) {
                    let doctorSpecialty = {};
                    if (location == 'all') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                clinicId: clinicId,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                clinicId: clinicId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctor = doctorSpecialty;
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
    postClinicDescription,
    getAllClinic,
    getDetailClinicById,

}