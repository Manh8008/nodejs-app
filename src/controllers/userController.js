const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const SECRET_KEY = '123456789'
const expiresIn = '1h'
const crypto = require('crypto')


// Tạo Token JWT
const createToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Xác thực và giải mã một JSON Web Token
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Gửi email xác nhận
const sendConfirmationEmail = (user, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'manhnhps33084@fpt.edu.vn',
            pass: 'enqc dypr risz bpbf'
        }
    })

    const mailOptions = {
        from: 'Nguyễn Hữu Mạnh',
        to: user.email,
        subject: 'Xác nhận tài khoản',
        text: `Vui lòng xác nhận tài khoản bằng cách nhập mã xác thực sau: ${verificationCode}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Lỗi gửi email xác nhận:', error)
        } else {
            console.log('Email xác nhận đã được gửi:', info.response)
        }
    })
}

class UserController {

    async getUsers(req, res, next) {
        try {
            const users = await User.find({})
            res.json(users)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Xóa người dùng
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /users/register
    async register(req, res, next) {
        const { username, phone, email, password, gender, address, dateOfBirth, role } = req.body
        try {
            const hashedPassword = await bcryptjs.hash(password, 10)
            const verificationCode = crypto.randomBytes(3).toString('hex')

            console.log(`Verification code: ${verificationCode}`)
            const newUser = new User({
                username,
                phone,
                email,
                password: hashedPassword,
                gender,
                address,
                dateOfBirth,
                verificationCode,
                role: role || 'user',
                isConfirmed: false
            })
            await newUser.save()
            sendConfirmationEmail(newUser, verificationCode)
            res.status(201).json({
                message: 'Người dùng đã đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản của bạn.',
                userId: newUser._id
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }


    // [POST] /users/login
    async login(req, res, next) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' })
            }

            if (!user.isConfirmed) {
                return res.status(400).json({ error: 'Tài khoản chưa được xác thực' }) // Sửa lỗi 404 thành 400
            }

            const isMatch = await bcryptjs.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ error: 'Thông tin không hợp lệ!' })
            }

            const token = createToken({ id: user._id, username: user.username, role: user.role })
            res.status(200).json({ token, username: user.username, role: user.role })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }


    // [GET] /users/profile
    async profile(req, res, next) {
        let token = req.headers['authorization']
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }

        if (!token) {
            return res.status(401).json({ error: 'Không có mã thông báo nào được cung cấp!' })
        }

        try {
            const decoded = verifyToken(token)
            const user = await User.findById(decoded.id).select('-password')
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' })
            }
            res.json(user)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }


    // [POST] /users/reset-password
    async resetPassword(req, res, next) {
        const { email } = req.body
        try {

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' })
            }

            // Tạo mật khẩu mới và gửi email
            const newPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcryptjs.hash(newPassword, 10)
            user.password = hashedPassword
            await user.save()

            // Cấu hình gửi email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'manhnhps33084@fpt.edu.vn',
                    pass: 'enqc dypr risz bpbf'
                }
            })

            const mailOptions = {
                from: 'Nguyễn Hữu Mạnh',
                to: user.email,
                subject: 'Password Reset',
                text: `Your new password is: ${newPassword}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ error: error.message })
                }
                res.json({ message: 'Đặt lại mật khẩu thành công. Vui lòng kiểm tra email của bạn để biết mật khẩu mới.' })
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // [POST] /users/changePassword
    async changePassword(req, res, next) {
        const { oldPassword, newPassword } = req.body
        const token = req.headers['authorization']

        if (!token) {
            return res.status(401).json({ error: 'Không có mã thông báo nào được cung cấp !' })
        }

        try {
            const decoded = verifyToken(token)
            const user = await User.findById(decoded.id)

            if (!user) {
                return res.status(401).json({ error: 'Không tìm thấy người dùng !' })
            }

            const isMatch = await bcryptjs.compare(oldPassword, user.password)
            if (!isMatch) {
                return res.status(400).json({ error: 'Mật khẩu cũ không đúng !' })
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 10)
            user.password = hashedPassword
            await user.save()
            res.json({ message: 'Đã thay đổi mật khẩu thành công !' })
        } catch {
            res.status(500).json({ error: error.message })
        }
    }

    // [POST] /users/verifyCode/:userId
    async verifyCode(req, res, next) {
        const { userId } = req.params
        const { verificationCode } = req.body

        try {
            const user = await User.findById(userId)

            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' })
            }

            if (user.verificationCode !== verificationCode) {
                return res.status(400).json({ error: 'Mã xác thực không đúng' })
            }

            user.isConfirmed = true
            user.verificationCode = undefined
            await user.save()
            res.json({ message: 'Tài khoản đã được xác thực thành công!' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

module.exports = new UserController()
