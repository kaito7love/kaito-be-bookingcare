import patientService from "../services/patientService";

let postBookingAppointment = async (req, res) => {
    try {
        let message = await patientService.postBookingAppointment(req.body);
        // console.log(message);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        let message = await patientService.postVerifyBookingAppointment(req.body);
        // console.log(message);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: " Err from Server",
        });
    }
}
export default {
    postBookingAppointment,
    postVerifyBookingAppointment,
};
