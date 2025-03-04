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
export default {
    postClinicDescription,

}