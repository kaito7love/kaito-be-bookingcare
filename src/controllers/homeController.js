import { raw } from "body-parser";
import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createUser(req.body);
    console.log(message);

    return res.send("post crud from server");
};
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser({
        raw: true,
    });
    return res.render("DisplayCRUD.ejs", {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);

    if (userId) {
        let userData = await CRUDService.getUserById(userId);

        return res.render("editCRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("Wrong User");
    }
};
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("DisplayCRUD.ejs", {
        dataTable: allUsers,
    });
};
let getDeleteCRUD = async (req, res) => {
    let id = req.query.id;
    console.log(id)
    if (id) {
        let allUsers= await CRUDService.deleteById(id);
        return res.render("DisplayCRUD.ejs", {
        dataTable: allUsers,
    });
    }else{
        return res.send("delete wrong")
    }
    
    
    
};
// object: {
//     key: '',
//     value: ''
// }
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    getDeleteCRUD: getDeleteCRUD,
    putCRUD: putCRUD,
};
