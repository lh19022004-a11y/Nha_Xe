import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2, ChevronDown, Clock3, Headphones, MapPin, Menu, MessageCircle, Navigation, Phone, ShieldCheck, Sparkles, Users, Wallet, X } from 'lucide-react'

const routes = [
  { from:'Đồng Văn', to:'Hà Nội', distance:'70 km', prices:['200k – 250k','400k – 450k','600k – 650k'] },
  { from:'Đồng Văn', to:'Sân bay Nội Bài', distance:'115 km', prices:['300k – 350k','600k – 700k','700k – 800k'] },
  { from:'Phủ Lý', to:'Hà Nội', distance:'65 km', prices:['200k – 250k','450k – 550k','650k – 750k'] },
  { from:'Phủ Lý', to:'Sân bay Nội Bài', distance:'110 km', prices:['250k – 400k','550k – 750k','750k – 850k'] },
  { from:'Kim Bảng', to:'Hà Nội', distance:'75 km', prices:['200k – 250k','450k – 650k','650k – 750k'] },
  { from:'Kim Bảng', to:'Sân bay Nội Bài', distance:'120 km', prices:['350k – 400k','650k – 750k','750k – 850k'] },
  { from:'Thanh Liêm', to:'Hà Nội', distance:'80 km', prices:['200k – 250k','500k – 600k','650k – 750k'] },
  { from:'Thanh Liêm', to:'Sân bay Nội Bài', distance:'125 km', prices:['350k – 400k','700k – 800k','800k – 900k'] },
  { from:'Bình Lục', to:'Hà Nội', distance:'90 km', prices:['200k – 300k','500k – 650k','650k – 800k'] },
  { from:'Bình Lục', to:'Sân bay Nội Bài', distance:'135 km', prices:['250k – 400k','700k – 850k','800k – 900k'] },
  { from:'Lý Nhân', to:'Hà Nội', distance:'95 km', prices:['200k – 300k','500k – 650k','650k – 800k'] },
  { from:'Lý Nhân', to:'Sân bay Nội Bài', distance:'140 km', prices:['350k – 400k','700k – 850k','800k – 900k'] },
]
const trips = [
  { code:'01', title:'Phủ Lý — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/ha-nam-6.jpg', place:'Hà Nam', desc:'Đón tận nơi, trả tận chỗ. Nhanh gọn, thoải mái.', time:'1 giờ 20 phút' },
  { code:'02', title:'Bình Lục — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/binh-luc.jpg', place:'Bình Lục, Hà Nam', desc:'Chuyến xe êm ái, tài xế thân thiện.', time:'1 giờ 45 phút' },
  { code:'03', title:'Thanh Liêm — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/thanh-liem.jpg', place:'Thanh Liêm, Hà Nam', desc:'Linh hoạt lịch đi, không lo lỡ chuyến.', time:'1 giờ 30 phút' },
  { code:'04', title:'Lý Nhân — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/ly-nhan.jpg', place:'Lý Nhân, Hà Nam', desc:'Đón khách trong khu vực, hỗ trợ hành lý.', time:'1 giờ 50 phút' },
  { code:'05', title:'Kim Bảng — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/ha-nam-4.jpg', place:'Kim Bảng, Hà Nam', desc:'Xe sạch, điều hòa mát, đi chung tiết kiệm.', time:'1 giờ 35 phút' },
  { code:'06', title:'Hà Nội — Sân bay', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/san-bay.jpg', place:'Hà Nội · Sân bay', desc:'Đón đúng giờ, hỗ trợ chuyến bay sớm.', time:'45 phút' },
  { code:'07', title:'Đồng Văn — Hà Nội', img:'https://dichvudatxe247.com/wp-content/uploads/2024/06/sdsd-500x400.jpg', place:'Đồng Văn, Hà Nam', desc:'Đặt trước nhanh, xác nhận chuyến tức thì.', time:'1 giờ 40 phút' },
  { code:'08', title:'Hà Nam — Sân bay', img:'https://dichvudatxe247.com/wp-content/uploads/2023/05/azzzxa.jpg', place:'Hà Nam · Sân bay Nội Bài', desc:'Đưa đón sân bay 24/7, giá trọn gói.', time:'1 giờ 40 phút' },
]
const benefits = [
  { icon:MapPin, title:'Đưa đón tận nơi', text:'Với các điểm trả khách phổ biến, chúng tôi chủ động đón bạn gần nhà và trả tận nơi đến, giúp hành trình dễ dàng hơn.' },
  { icon:Wallet, title:'Tiết kiệm chi phí', text:'Bạn sẽ được trải nghiệm dịch vụ đi xe ghép với mức giá hợp lý, tiết kiệm đến 50% so với đi taxi đường dài thông thường.' },
  { icon:ShieldCheck, title:'An toàn & uy tín', text:'Tài xế có kinh nghiệm, nhiệt tình, phục vụ khách hàng tận tâm. Mỗi chuyến đi luôn được theo dõi để bạn yên tâm.' },
  { icon:Headphones, title:'Đặt nhanh — hỗ trợ 24/7', text:'Hotline luôn sẵn sàng hỗ trợ bạn đặt chuyến, giải đáp mọi thắc mắc và xử lý nhanh những thay đổi phát sinh.' },
]

function Button({children, variant='primary', className='', ...props}) { return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button> }
function SectionHeading({eyebrow, children, text, light=false}) { return <div className={`section-heading ${light?'light':''}`}><span className="eyebrow">{eyebrow}</span><h2>{children}</h2>{text && <p>{text}</p>}</div> }

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('success')
  const [submitting, setSubmitting] = useState(false)
  const [bookingVisible, setBookingVisible] = useState(false)
  const today = new Date().toISOString().slice(0,10)
  useEffect(() => {
    const form = document.querySelector('.booking-form')
    if (!form || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setBookingVisible(entry.isIntersecting), { threshold: 0.08 })
    observer.observe(form)
    return () => observer.disconnect()
  }, [])
  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gửi yêu cầu chưa thành công.')
      setNoticeType('success')
      setNotice(result.message)
      form.reset()
    } catch (error) {
      setNoticeType('error')
      setNotice(error.message || 'Không thể gửi yêu cầu. Vui lòng thử lại hoặc gọi hotline 0976 557 789.')
    } finally {
      setSubmitting(false)
    }
  }
  return <div className="page-shell">
    <header className="topbar"><div className="nav-wrap">
      <a className="brand" href="#home"><img className="brand-logo" src="/brand-logo.png" alt="Logo Nhà xe Minh Châu"/><span>XE GHÉP <b>HÀ NAM</b><small>CHUYẾN ĐI AN TÂM</small></span></a>
      <button className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Mở menu">{menuOpen?<X/>:<Menu/>}</button>
      <nav className={menuOpen?'nav-links open':'nav-links'}><a href="#routes" onClick={()=>setMenuOpen(false)}>Dịch vụ đặt xe 247</a><a href="#home" onClick={()=>setMenuOpen(false)}>Trang chủ</a><a href="#why" onClick={()=>setMenuOpen(false)}>Dịch vụ của chúng tôi</a><a href="#trips" onClick={()=>setMenuOpen(false)}>Về chúng tôi</a><a href="#routes" onClick={()=>setMenuOpen(false)}>Bảng giá</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Liên hệ chúng tôi</a></nav>
      <a className="nav-phone" href="tel:0976557789"><Phone size={13}/> Hotline: 0976 557 789</a><Button className="nav-cta" onClick={()=>document.querySelector('#booking').scrollIntoView({behavior:'smooth'})}>Đặt xe ngay <ArrowUpRight size={14}/></Button><span className="account-icon"><Users size={15}/></span>
    </div></header>

    <main>
      <section className="hero hero-banner" id="home"><div className="hero-grid"><div className="hero-copy"><span className="hero-kicker"><span className="live-dot"/> ĐẶT XE NGAY · PHỤC VỤ 24/7</span><h1>Hệ thống xe ghép chuyên tuyến<br/><span>Hà Nam – Hà Nội – Nội Bài</span></h1><p className="hero-lede">Đặt xe ngay, phục vụ 24/7<br/>Đón tận nhà — trả tận sảnh, cửa, cổng<br/>Xe đưa đón khách đi — về <b>SÂN BAY</b>, các <b>BỆNH VIỆN</b>, <b>TRƯỜNG HỌC</b>, <b>NHÀ RIÊNG</b> trên toàn thành phố Hà Nội và tỉnh Hà Nam</p><p className="hero-promise">AN TOÀN · TIẾT KIỆM THỜI GIAN · GIẢM CHI PHÍ ĐI LẠI</p><div className="hero-actions"><a className="hero-call" href="tel:0976557789"><Phone size={24}/> <span>Gọi ngay: <b>0976 557 789</b></span></a></div></div>
        </div></section>

      <section className="routes section" id="routes"><SectionHeading eyebrow="BẢNG GIÁ MINH BẠCH" text="Vững đường đón xe ghép hành trình chỉ với một thao tác đặt xe. Bảng giá tham khảo, vui lòng liên hệ để được tư vấn chính xác.">Hệ thống xe ghép tuyến Hà Nam –<br className="desktop-break"/> Hà Nội · Nội Bài</SectionHeading><div className="table-wrap"><table><thead><tr><th>Tuyến đường xe ghép</th><th>Giá xe ghép</th><th>Bao xe 4–5 chỗ</th><th>Bao xe 7 chỗ</th><th>Thao tác</th></tr></thead><tbody>{routes.map((r,i)=><tr key={r.from+r.to}><td><b className="row-number">{i+1}.</b> {r.from} ↔ {r.to}</td><td className="green-text">{r.prices[0]}</td><td className="blue-text">{r.prices[1]}</td><td className="gold-text">{r.prices[2]}</td><td><button className="table-book" onClick={()=>{document.querySelector('#booking').scrollIntoView({behavior:'smooth'});setNotice(`Bạn đang quan tâm tuyến ${r.from} – ${r.to}. Vui lòng điền thông tin để đặt xe.`)}}>Đặt xe</button></td></tr>)}</tbody></table></div><div className="price-notes"><div><span className="note-disc"><Navigation/></span><p><b>Tuyến Sân bay Chuyên Biệt</b><br/>Hà Nam → Sân bay: chỉ từ <em>220.000đ</em> | Sân bay → Hà Nam: từ <em>250.000đ</em><br/><small>(Giá tham khảo và có thể thay đổi tùy vị trí đón)</small></p></div><div><span className="note-disc"><BadgeCheck/></span><p><b>Dịch vụ đi tỉnh theo yêu cầu</b><br/>Xe 5 chỗ: từ <em>12.000đ/km</em> | Xe 7 chỗ: từ <em>15.000đ/km</em><br/><small>Không có phí dừng đỗ, dễ dàng đặt xe đi tỉnh 50km+</small></p></div></div><p className="table-footnote">* Giá chỉ mang tính chất tham khảo, áp dụng cho các tuyến phổ biến. Giá có thể thay đổi theo điểm đón, thời gian và số lượng hành khách.</p></section>

      <section className="trips section" id="trips"><SectionHeading eyebrow="CHUYẾN XE HÀNG NGÀY" text="Gọi trước để chọn khung giờ phù hợp — chuyến xe luôn sẵn sàng đồng hành cùng bạn.">Lộ trình chuyến tuyến phục vụ phố biến</SectionHeading><div className="trip-grid">{trips.map(t=><article className="trip-card" key={t.code}><div className="trip-image"><img src={t.img} alt={t.place} loading="lazy"/><span className="trip-code">Tuyến #{t.code}</span><span className="trip-distance"><Navigation size={12}/>{t.time}</span></div><div className="trip-body"><h3>{t.title}</h3><p className="trip-desc">{t.place} · {t.desc}</p><ul><li><CheckCircle2/> Đón trả tận nơi, đúng giờ</li><li><CheckCircle2/> An toàn · Tài xế thân thiện</li><li><CheckCircle2/> Giá minh bạch, dễ đặt</li></ul><Button className="trip-button" onClick={()=>{document.querySelector('#booking').scrollIntoView({behavior:'smooth'});setNotice(`Đặt chuyến tuyến ${t.title}. Vui lòng điền thông tin bên dưới.`)}}><CarFront size={14}/> Đặt xe ngay</Button></div></article>)}</div><div className="safe-note"><ShieldCheck size={16}/> Đặt xe ngay — đồng hành phục vụ 24/7.</div></section>

      <section className="why section" id="why"><SectionHeading eyebrow="LÍ DO TIN TƯỞNG" text="Trải nghiệm dịch vụ chuyên nghiệp, tận tâm trên từng hành trình đồng hành cùng phụ huynh và khách hàng.">Tại sao nên chọn dịch vụ đặt xe 247?</SectionHeading><div className="benefit-grid">{benefits.map(({icon:Icon,title,text},i)=><article className="benefit-card" key={title}><div className={`benefit-icon color-${i}`}><Icon size={19}/></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="booking section" id="booking"><div className="booking-aside" id="contact"><span className="eyebrow">HỖ TRỢ 24/7</span><h2>Đặt xe ngay <span>24/7</span></h2><p>Tổng đài đặt xe ghép và xe đường dài, đón tận nơi tại Hà Nam. Tư vấn lộ trình, thời gian và chi phí minh bạch.</p><div className="call-card"><div className="call-label"><span className="live-dot"/> TỔNG ĐÀI HỖ TRỢ TRỰC TUYẾN</div><a href="tel:0976557789" className="big-phone">0976 557 789</a><p>Miễn phí tổng đài đặt xe đi đường dài — tư vấn lộ trình và giờ đón phù hợp.</p><a href="tel:0976557789" className="call-button"><Phone size={15}/> GỌI TRỰC TIẾP MIỄN PHÍ</a><div className="call-spark"><Sparkles size={15}/></div></div><ul className="support-list"><li><CheckCircle2/> Xe riêng, xe ghép linh hoạt — không tăng giá</li><li><CheckCircle2/> Đón đúng giờ — tài xế thân thiện, tận tâm</li><li><CheckCircle2/> Hỗ trợ xe khách khi cần thay đổi lịch trình</li></ul></div>
        <form className="booking-form" onSubmit={submit}><div className="form-heading"><span className="form-icon"><CalendarDays size={18}/></span><div><h3>Phiếu Đăng Ký Chuyến Đi Nhanh</h3><p>Điền thông tin — chúng tôi sẽ liên hệ ngay</p></div><span className="secure"><ShieldCheck size={13}/> Bảo mật</span></div>{notice && <div className={`form-notice ${noticeType === 'error' ? 'form-notice-error' : ''}`} role="status"><CheckCircle2 size={16}/>{notice}</div>}<div className="form-grid"><label>Họ và tên <i>*</i><input name="name" required maxLength="120" placeholder="VD: Nguyễn Văn A"/></label><label>Số điện thoại <i>*</i><input name="phone" required type="tel" maxLength="40" placeholder="VD: 0976 557 789"/></label><label className="full-field">Điểm đi <i>*</i><span className="input-icon"><MapPin/><input name="from" required maxLength="300" placeholder="VD: Số 20 Lê Hoàn, Phủ Lý"/></span></label><label className="full-field">Điểm đến <i>*</i><span className="input-icon destination"><MapPin/><input name="to" required maxLength="300" placeholder="VD: Bệnh viện Bạch Mai / Sân bay Nội Bài"/></span></label><label>Ngày đi <i>*</i><span className="input-icon"><CalendarDays/><input name="date" required type="date" defaultValue={today}/></span></label><label>Giờ đón <i>*</i><span className="input-icon"><Clock3/><input name="time" required type="time" defaultValue="08:00"/></span></label><label>Loại xe ghép<select name="carType" defaultValue=""><option value="" disabled>Chọn loại xe (Tùy chọn)</option><option>Xe ghép 4 chỗ</option><option>Xe ghép 7 chỗ</option><option>Bao xe riêng 4–5 chỗ</option><option>Bao xe riêng 7 chỗ</option></select></label><label>Số hành khách<select name="passengers" defaultValue="1"><option value="1">1 Người</option><option value="2">2 Người</option><option value="3">3 Người</option><option value="4">4 Người</option><option value="5+">Trên 4 người</option></select></label><label className="full-field">Lời nhắn (nếu có)<textarea name="message" rows="2" maxLength="1000" placeholder="VD: Có hành lý, cần đón tận nơi, số ghế..."/></label></div><button className="submit-button" type="submit" disabled={submitting}><ArrowRight size={16}/> {submitting ? 'ĐANG GỬI YÊU CẦU...' : 'GỬI YÊU CẦU ĐẶT XE'}</button><p className="form-privacy"><ShieldCheck size={12}/> Thông tin của bạn được bảo mật và chỉ dùng để xác nhận chuyến đi.</p></form></section>
    </main>

    <footer className="footer"><div className="footer-grid"><div><a className="brand footer-brand" href="#home"><img className="brand-logo" src="/brand-logo.png" alt="Logo Nhà xe Minh Châu"/><span>XE GHÉP <b>HÀ NAM</b><small>CHUYẾN ĐI AN TÂM</small></span></a><p>Phục vụ mọi lúc, mọi nơi. Dịch vụ nhanh, an toàn — Giá hợp lý — Tài xế thân thiện.</p><div className="footer-badges"><span><ShieldCheck/> Hoạt động 24/7</span><span><BadgeCheck/> Bảo đảm giá tốt</span></div></div><div><h4>THÔNG TIN LIÊN HỆ</h4><p><MapPin/> Địa chỉ: Thành phố Phủ Lý, Hà Nam</p><p><Phone/> SĐT: <a href="tel:0976557789">0976 557 789</a></p><p><MessageCircle/> Email: <a href="mailto:datxe@dichvu247.vn">datxe@dichvu247.vn</a></p></div><div><h4>LIÊN KẾT NHANH</h4><a href="#home">Trang chủ</a><a href="#why">Dịch vụ của chúng tôi</a><a href="#trips">Lộ trình hàng ngày</a><a href="#routes">Chính sách bảo mật</a><a href="#contact">Chính sách dịch vụ</a><a href="#contact">Điều khoản dịch vụ</a></div></div><div className="footer-bottom"><span>© 2024 dichvuxe247. Bảo lưu mọi quyền.</span><span><ShieldCheck/> Tốc độ & An toàn <b>·</b> <Clock3/> Tuyến 24/7</span></div></footer>
    <a className={`floating-zalo${bookingVisible ? ' floating-hidden' : ''}`} href="https://zalo.me/0976557789" target="_blank" rel="noreferrer" aria-label="Chat Zalo với số 0976557789"><span>Zalo</span><i className="zalo-ping"/></a>
    <a className={`floating-call${bookingVisible ? ' floating-hidden' : ''}`} href="tel:0976557789" aria-label="Gọi hotline"><Phone size={21}/><span className="call-ping"/></a>
  </div>
}
