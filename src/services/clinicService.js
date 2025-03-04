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
export default {
    postClinicDescription,

}