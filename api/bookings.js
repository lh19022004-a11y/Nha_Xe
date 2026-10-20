import nodemailer from 'nodemailer'

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]))

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Phương thức gửi không được hỗ trợ.' })
  }

  const { name, phone, from, to, date, time, carType, passengers, message } = req.body ?? {}
  const required = { name, phone, from, to, date, time }
  if (Object.values(required).some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' })
  }
  if (Object.values({ ...required, carType, passengers, message }).some((value) => typeof value === 'string' && value.length > 1000)) {
    return res.status(400).json({ message: 'Thông tin nhập quá dài. Vui lòng kiểm tra lại.' })
  }

  const missing = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'].filter((key) => !process.env[key])
  if (missing.length) {
    console.error('Booking email configuration missing:', missing.join(', '))
    return res.status(503).json({ message: 'Hệ thống nhận đặt xe chưa được cấu hình email. Vui lòng gọi hotline 0976 557 789.' })
  }

  const rows = [
    ['Họ và tên', name], ['Số điện thoại', phone], ['Điểm đi', from], ['Điểm đến', to],
    ['Ngày đi', date], ['Giờ đón', time], ['Loại xe', carType || 'Chưa chọn'],
    ['Số hành khách', passengers || 'Chưa chọn'], ['Lời nhắn', message || 'Không có'],
  ]
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const html = `<h2>Yêu cầu đặt xe mới</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#dce3ee">${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: process.env.SMTP_USER,
      subject: `Yêu cầu đặt xe mới — ${name.trim()}`,
      text,
      html,
    })
    return res.status(200).json({ message: 'Đã gửi yêu cầu đặt xe. Chúng tôi sẽ sớm liên hệ xác nhận với bạn.' })
  } catch (error) {
    console.error('Booking email delivery failed:', { code: error?.code, responseCode: error?.responseCode })
    if (error?.code === 'EAUTH' || error?.responseCode === 535) {
      return res.status(502).json({ message: 'Email chưa gửi được. Hãy kiểm tra mật khẩu ứng dụng Gmail trong cấu hình Vercel.' })
    }
    return res.status(502).json({ message: 'Email chưa gửi được. Vui lòng gọi hotline 0976 557 789.' })
  }
}
