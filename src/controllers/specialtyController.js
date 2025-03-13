import specialtyService from "../services/specialtyService";


let postSpecialtyDescription = async (req, res) => {
    try {
        // console.log(req.body);


        let message = await specialtyService.postSpecialtyDescription(req.body);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        // console.log(req.body);


        let message = await specialtyService.getAllSpecialty();

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Error from Server",
        });
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {

        let message = await specialtyService.getDetailSpecialtyById(req.query.specialtyId, req.query.location);
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
    postSpecialtyDescription,
    getAllSpecialty,
    getDetailSpecialtyById,
}