import { where, Op } from "sequelize";
import db from "../models";
import _, { includes, reject } from "lodash";
import { raw } from "body-parser";
import emailService from "./emailService";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ["password"] },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["value_en", "value_vi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["value_en", "value_vi"],
                    },
                ],
                raw: true,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            console.log(error);

            reject(error);
        }
    });
};

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: { exclude: ["password", "image"] },
                // include: [
                //     { model: db.Allcode, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                //     { model: db.Allcode, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                // ],
                raw: true,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let requiredFields = (data) => {
    console.log("from service", data);
    const requiredFields = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'selectedClinic',
        'selectedSpecialty',
    ];
    let isValid = true;
    let element = "";
    for (let field of requiredFields) {
        if (!data[field]) {
            isValid = false;
            element = field;
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let postInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let checkInput = requiredFields(data)
            if (!checkInput.isValid) {
                resolve({
                    errCode: 1,
                    message:
                        `MIssing :${checkInput.element} is required for updating doctor information`,
                });
            } else {
                let doctor = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                });

                if (doctor) {
                    // Nếu đã tồn tại, cập nhật thông tin
                    doctor = await db.Markdown.update(
                        {
                            contentHTML: data.contentHTML,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                        },
                        {
                            where: { doctorId: data.doctorId },
                        }
                    );
                    resolve({
                        errCode: 0,
                        message: "Update markdown successful",
                        data: doctor,
                    });
                } else {
                    // Nếu chưa tồn tại, tạo mới
                    doctor = await db.Markdown.create({
                        doctorId: data.doctorId,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,

                    });
                    resolve({
                        errCode: 0,
                        message: "Create markdown successful",
                        data: doctor,
                    });
                }

                let doctorInfo = await db.Doctor_info.findOne({
                    where: { doctorId: data.doctorId },
                });
                // console.log("back end",doctorInfo);

                if (doctorInfo) {
                    // Nếu đã tồn tại, cập nhật thông tin
                    doctor = await db.Doctor_info.update(
                        {
                            priceId: data.selectedPrice,
                            paymentId: data.selectedPayment,
                            provinceId: data.selectedProvince,
                            nameClinic: data.nameClinic,
                            addressClinic: data.addressClinic,
                            note: data.note,
                            clinicId: data.selectedClinic,
                            specialtyId: data.selectedSpecialty,
                        },
                        {
                            where: { doctorId: data.doctorId },
                        }
                    );
                    resolve({
                        errCode: 0,
                        message: "Update DoctorInfo successful",
                        data: doctor,
                    });
                } else {
                    // Nếu chưa tồn tại, tạo mới
                    doctor = await db.Doctor_info.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        paymentId: data.selectedPayment,
                        provinceId: data.selectedProvince,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                        clinicId: data.clinicId,
                        specialtyId: data.specialtyId,
                    });
                    resolve({
                        errCode: 0,
                        message: "Create DoctorInfo successful",
                        data: doctor,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: 1,
                message: "Error PostInfoDoctor",
            });
        }
    });
};

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("from service id", id);
            if (!id) {
                reject({
                    errCode: 1,
                    message: "Missing Id",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: { exclude: ["password"] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ["contentHTML", "contentMarkdown", "description"],
                        },
                        {
                            model: db.Doctor_info,
                            // attributes: ["contentHTML", "contentMarkdown", "description",],
                            include: [
                                { model: db.Allcode, as: "priceTypeData", attributes: ["value_en", "value_vi"], },
                                { model: db.Allcode, as: "paymentTypeData", attributes: ["value_en", "value_vi"] },
                                { model: db.Allcode, as: "provinceTypeData", attributes: ["value_en", "value_vi"] },
                            ]
                        },
                        { model: db.Allcode, as: "positionData", attributes: ["value_en", "value_vi"] },
                    ],
                    raw: false,
                    // nest: true,
                });
                // console.log("data doctor from be ser", data);
                if (data) {
                    resolve({
                        errCode: 0,
                        message: "Get detail successful",
                        data: data,
                    });
                } else {
                    reject({
                        errCode: 2,
                        message: "Doctor not found",
                        data: {},
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    message: "Missing required param!",
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }
                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                });

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                // console.log(toCreate);

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    message: "Create Schedule Successful!",
                });
            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    });
};

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(doctorId, date);

            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: "Missing required param!",
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['value_en', 'value_vi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true
                });

                // console.log(dataSchedule);

                resolve({
                    errCode: 0,
                    message: "Fetch Data Schedule Successful!",
                    data: dataSchedule || []
                })

            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    })
}

let getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log("from service id", doctorId);
            if (!doctorId) {
                reject({
                    errCode: 1,
                    message: "Missing Id",
                });
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    limit: 1,
                    attributes: { exclude: ["id"] },
                    include: [
                        { model: db.Allcode, as: "priceTypeData", attributes: ["value_en", "value_vi"], },
                        { model: db.Allcode, as: "paymentTypeData", attributes: ["value_en", "value_vi"] },
                        { model: db.Allcode, as: "provinceTypeData", attributes: ["value_en", "value_vi"] },
                    ],
                    raw: false,
                    nest: true,
                });
                // console.log("from service", data);
                if (data) {
                    resolve({
                        errCode: 0,
                        message: "Get extra detail successful",
                        data: data
                    });
                } else {
                    reject({
                        errCode: 2,
                        message: "Doctor not found",
                        data: {},
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get extra detail",
            });
        }
    });
}

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log("from service id", doctorId);
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    message: "Missing Id",
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: { exclude: ["email", "password"] },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ["description"],
                        },
                        {
                            model: db.Doctor_info,
                            // attributes: ["contentHTML", "contentMarkdown", "description",],
                            include: [
                                { model: db.Allcode, as: "priceTypeData", attributes: ["value_en", "value_vi"], },
                                { model: db.Allcode, as: "paymentTypeData", attributes: ["value_en", "value_vi"] },
                                { model: db.Allcode, as: "provinceTypeData", attributes: ["value_en", "value_vi"] },
                            ]
                        },
                        { model: db.Allcode, as: "positionData", attributes: ["value_en", "value_vi"] },
                    ],
                    raw: false,
                    nest: true,
                });
                // console.log("from service", data);
                if (data) {
                    resolve({
                        errCode: 0,
                        message: "Get detail successful",
                        data: data,
                    });
                } else {
                    reject({
                        errCode: 2,
                        message: "Doctor not found",
                        data: {},
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get extra detail",
            });
        }
    });
}


let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(doctorId, date);

            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: "Missing required param!",
                });
            } else {
                let dataSchedule = await db.Booking.findAll({
                    where: { statusId: { [Op.ne]: "S1" }, doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender', 'phone'],
                            include: [{
                                model: db.Allcode, as: 'genderData', attributes: ['value_en', 'value_vi'],
                            },
                            ]

                        }, {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['value_en', 'value_vi'],
                        }, {
                            model: db.Allcode, as: 'statusDataPatient', attributes: ['value_en', 'value_vi'],
                        }
                    ],
                    raw: true,
                    nest: true
                });

                // console.log(dataSchedule);

                resolve({
                    errCode: 0,
                    message: "Fetch Data Schedule Successful!",
                    data: dataSchedule || []
                })

            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    })
}

let sendBill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("check data to send remedy", data);

            if (!data) {
                resolve({
                    errCode: 1,
                    message: "Missing required param!",
                });
            } else {
                // 
                let doctorId = data.data.doctorId
                let date = data.data.date.toString();
                let patientId = data.data.patientId
                let dataSchedule = await db.Booking.findOne({
                    where: { statusId: { [Op.ne]: "S1" }, doctorId: doctorId, date: date, patientId: patientId },
                    raw: false,
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['firstName', 'email'],
                        }
                    ],
                });

                if (dataSchedule) {
                    dataSchedule.statusId = "S3"
                    await dataSchedule.save();
                }
                // console.log(dataSchedule);
                // send email
                await emailService.sendBill({
                    receiverEmail: data.data.email,
                    img: data.data.img,
                    patientName: dataSchedule.patientData.firstName,
                    language: data.language,
                    // imagePath: data.language,
                })

                dataSchedule = await getListPatientForDoctor(doctorId, date);

                resolve({
                    errCode: 0,
                    message: "Fetch Data Successful!",
                    data: dataSchedule || []
                })

            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    })
}


let cancelBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("check data to cancel booking", data);

            if (!data) {
                resolve({
                    errCode: 1,
                    message: "Missing required param!",
                });
            } else {
                // // 
                let doctorId = data.data.doctorId
                let date = data.data.date.toString();
                let patientId = data.data.patientId
                let dataSchedule = await db.Booking.findOne({
                    where: { statusId: { [Op.ne]: "S1" }, doctorId: doctorId, date: date, patientId: patientId },
                    raw: false,
                });

                if (dataSchedule) {
                    dataSchedule.statusId = "S4"
                    await dataSchedule.save();
                }
                // console.log(dataSchedule);
                dataSchedule = await getListPatientForDoctor(doctorId, date);

                resolve({
                    errCode: 0,
                    message: "Fetch Data  Successful!",
                    data: dataSchedule || []
                })

            }
        } catch (error) {
            console.log(error);
            reject({
                errCode: -1,
                message: "Error get detail",
            });
        }
    })
}


export default {
    getTopDoctor,
    getAllDoctor,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendBill,
    cancelBooking,
};
