const admin = require("firebase-admin")


admin.initializeApp()


const db = admin.firestore();
const cl_authorization_code = db.collection("authorization_code");



const getCode = async (the_email = null) => {
    if(null === the_email) return null;

    let the_code = Math.floor(100000 + Math.random() * 900000),
        the_id = "id_" + Math.floor(100000000 + Math.random() * 900000000);


    let res_cl = await cl_authorization_code.doc(the_id).set({
        email: the_email,
        code: the_code,
        created_at: new Date().getTime()
    })
        .then(res => res)
        .catch(e => null) ;

    return {code: the_code, the_id: the_id};

}; //

module.exports.getCode = getCode;