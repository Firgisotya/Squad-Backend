const { login_aio } = require('../config/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    login: async (req, res) => {
        try {
            const { nik, password } = req.body;
            const query = await login_aio.query(`
            SELECT * FROM php_ms_login
            WHERE lg_nik = '${nik}' AND lg_aktif = 1
            `);

            
            if (query[0][0]){
                const hashPassword = crypto.createHash('md5').update(password).digest('hex');
                if (hashPassword !== query[0][0].lg_password){
                    return res.status(401).json({
                        message: "Password salah",
                    });
                }

                const token = jwt.sign({
                    nik: query[0][0].lg_nik,
                    nama: query[0][0].lg_nama,
                }, process.env.SECRET_KEY, { expiresIn: '1h' });

                return res.status(200).json({
                    message: "Login success",
                    token: token,
                    user: {
                        nik: query[0][0].lg_nik,
                        nama: query[0][0].lg_name,
                        email: query[0][0].lg_email_aio,
                    }
                });
            } else {
                return res.status(401).json({
                    message: "NIK tidak ditemukan"
                });
            }
    
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}