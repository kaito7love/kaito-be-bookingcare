import { raw } from "body-parser";
import bcrypt from "bcrypt";
import db from "../models";
import { where } from "sequelize";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(email);
            let userData = {};
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ["id","email", "roleId", "password", "firstName", 'lastName'],
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `Ok`;
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = "3";
                        userData.errMessage = `Password incorrect`;
                        resolve(userData);
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not exist`;
                    resolve(userData);
                }
            } else {
                userData.errCode = `1`;
                userData.errMessage = `Email incorrect`;
                resolve(userData);
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "All") {
                users = db.User.findAll({
                    attributes: { exclude: ["password"] },
                    raw: true,
                });
            }
            if (userId && userId !== "All") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                    raw: true,
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: "Email used",
                });
            } else {
                // note check type @gmail.com before create
                let hashPasswordBcrypt = await hashUserPassword(data.password);
                let user = await db.User.create({
                    email: data.email,
                    password: hashPasswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    address: data.address,
                    phone: data.phone,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.gender === "M" ? "/images/doctor.png" : data.gender === "F" ? "/images/doctor2.png" : "",
                });
                resolve({
                    errCode: 0,
                    message: "Create user successful",
                    data: user
                });
            }
            console.log("data from userService Backend: ", data);
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (!user) {
            resolve({
                errCode: 2,
                message: "User not exist",
            });
        }
        await db.User.destroy({
            where: { id: userId },
        });
        resolve({
            errCode: 0,
            message: "User Deleted!",
        });
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("data update" ,data);

            if (!data.id) {
                resolve({
                    errCode: 2,
                    message:
                        "MIssing User ID is required for updating user data",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                // user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phone = data.phone;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.image = data.image;
                await user.save();

                resolve({
                    errCode: 0,
                    message: "User Updated!",
                    // user,
                });
            } else {
                resolve({ errCode: 2, message: "User Not Found" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let message = {}
            if (!typeInput) {
                // let allCodeData = await db.Allcode.findAll();
                // message.errCode = 0;
                // message.errMessage = "Get successful allcode data";
                // message.data = allCodeData;
                return res.status(200).json({
                    errCode: -1,
                    errMessage: "Missing Type Input"
                })
            } else {
                let allCodeData = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                message.errCode = 0;
                message.errMessage = "Get successful allcode data";
                message.data = allCodeData;
            }
            resolve(message)
        } catch (error) {
            reject(error)
        }
    })
}
export default {
    handleUserLogin,
    getAllUsers,
    createUser,
    deleteUser,
    updateUserData,
    getAllCodeService,
};
