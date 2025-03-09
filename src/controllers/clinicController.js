import clinicService from "../services/clinicService";

let postClinicDescription = async (req, res) => {
    try {


        let message = await clinicService.postClinicDescription(req.body);
        console.log(message);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
}
let getAllClinic = async (req, res) => {
    try {
        // console.log(req.body);
        let message = await clinicService.getAllClinic();

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let message = await clinicService.getDetailClinicById(req.query.clinicId, req.query.location);
        // console.log("from controller", message);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
};
export default {
    postClinicDescription,
    getAllClinic,
    getDetailClinicById,
}