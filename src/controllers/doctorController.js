import doctorService from "../services/doctorService";

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = "5";
    }

    try {
        let doctors = await doctorService.getTopDoctor(+limit);
        // console.log(doctors);

        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor();
        // console.log(doctors);

        return res.status(200).json(doctors);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};
let postInfoDoctor = async (req, res) => {
    try {
        let message = await doctorService.postInfoDoctor(req.body);
        // console.log("from controller",message);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let message = await doctorService.getDetailDoctorById(req.query.id);
        // console.log("from controller", message);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        // console.log("from controller", req.body);
        let message = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let message = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
};

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let message = await doctorService.getExtraInfoDoctorById(req.query.doctorId);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
};
let getProfileDoctorById = async (req, res) => {
    try {
        let message = await doctorService.getProfileDoctorById(req.query.doctorId);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
};
let getListPatientForDoctor = async (req, res) => {
    try {
        // console.log(req.query.doctorId, req.query.date);

        let message = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
};


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
};
