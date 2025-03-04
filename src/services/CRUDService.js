import bcrypt from "bcrypt";
import db from "../models";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let createUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender === "1" ? true : false,
                address: data.address,
                phone: data.phone,
                roleId: data.roleId,
                positionId: data.positionId,
                image: data.image,
            });
            resolve();
            console.log(data);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = db.User.findAll({ raw: true });
            resolve(user);
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
let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });

            if (user) {
                resolve(user);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    console.log("update from server", data);
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                throw new Error("User ID is required for updating user data");
            }
            let user = await db.User.findOne({ where: { id: data.id }, raw: false, });
            if (user) {
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                let allUsers = await db.User.findAll({ raw: true });
                resolve(allUsers);
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteById = (id) => {

    return new Promise(async (resolve, reject) => {
        console.log("delete from server", id);
        try {
            if (!id) {
                throw new Error("User ID is required for updating user data");
            }
            let user = await db.User.findOne({ where: { id: id } });
            console.log("before delete from server", user);
            if (user) {
                await db.User.destroy({
                    where: { id: id },
                });
                let allUsers = await db.User.findAll({ raw: true });
                resolve(allUsers);
            } else {
                resolve();
            }

        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createUser: createUser,
    getAllUser: getAllUser,
    getUserById: getUserById,
    updateUserData: updateUserData,
    deleteById: deleteById,
};