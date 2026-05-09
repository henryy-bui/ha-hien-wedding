import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-monogram">VH &amp; TH</div>

        <p className="footer-quote">
          "Tình yêu không phải là tìm kiếm người hoàn hảo,<br />
          mà là học cách yêu một người không hoàn hảo<br />
          theo cách hoàn hảo nhất."
        </p>

        <div className="footer-rule" />
        <p className="footer-names">Van Ha &amp; Thanh Hien</p>
        <p className="footer-date">31 · 05 · 2026</p>
        <p className="footer-credit">Được tạo với ❤️ cho ngày trọng đại của chúng mình</p>
      </div>
    </footer>
  )
}
