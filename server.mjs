import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { createServer as createViteServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const root = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 5173)

app.disable('x-powered-by')
app.use(express.json({ limit: '32kb' }))

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]))

app.post('/api/bookings', async (req, res) => {
  const { name, phone, from, to, date, time, carType, passengers, message } = req.body ?? {}
  const fields = { name, phone, from, to, date, time }
  if (Object.values(fields).some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' })
  }
  if (Object.values({ ...fields, carType, passengers, message }).some((value) => typeof value === 'string' && value.length > 1000)) {
    return res.status(400).json({ message: 'Thông tin nhập quá dài. Vui lòng kiểm tra lại.' })
  }

  const missingSmtp = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].filter((key) => !process.env[key])
  if (missingSmtp.length) {
    return res.status(503).json({ message: 'Chưa cấu hình SMTP. Hãy nhập mật khẩu ứng dụng Gmail vào SMTP_PASS trong tệp .env, sau đó khởi động lại máy chủ.' })
  }
  if (!process.env.MAIL_TO) {
    return res.status(503).json({ message: 'Chưa cấu hình địa chỉ email nhận yêu cầu đặt xe trong MAIL_TO.' })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const rows = [
    ['Họ và tên', name], ['Số điện thoại', phone], ['Điểm đi', from], ['Điểm đến', to],
    ['Ngày đi', date], ['Giờ đón', time], ['Loại xe', carType || 'Chưa chọn'],
    ['Số hành khách', passengers || 'Chưa chọn'], ['Lời nhắn', message || 'Không có'],
  ]
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const html = `<h2>Yêu cầu đặt xe mới</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#dce3ee">${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: process.env.SMTP_USER,
      subject: `Yêu cầu đặt xe mới — ${name.trim()}`,
      text,
      html,
    })
    return res.json({ message: 'Đã gửi yêu cầu đặt xe. Chúng tôi sẽ sớm liên hệ xác nhận với bạn.' })
  } catch (error) {
    console.error('Booking email delivery failed:', {
      code: error?.code,
      responseCode: error?.responseCode,
      message: error?.message,
    })
    if (error?.code === 'EAUTH' || error?.responseCode === 535) {
      return res.status(502).json({ message: 'Gmail từ chối đăng nhập SMTP. Kiểm tra SMTP_USER và dùng mật khẩu ứng dụng Gmail 16 ký tự trong SMTP_PASS.' })
    }
    if (['ECONNECTION', 'ETIMEDOUT', 'EDNS'].includes(error?.code)) {
      return res.status(502).json({ message: 'Không kết nối được máy chủ gửi thư. Kiểm tra mạng và cấu hình SMTP_HOST, SMTP_PORT.' })
    }
    return res.status(502).json({ message: 'Email chưa gửi được. Xem lỗi SMTP trong cửa sổ terminal đang chạy npm run dev; không chia sẻ mật khẩu.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(root, 'dist')))
  app.get('*', (_req, res) => res.sendFile(path.join(root, 'dist', 'index.html')))
} else {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.listen(port, () => console.log(`Xe ghép booking app listening on http://localhost:${port}`))
