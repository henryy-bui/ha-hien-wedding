import { SIDE_CONFIG } from "../sideConfig";
import { useSide } from "../sideContext";
import "./Footer.css";

export default function Footer() {
  const sideData = SIDE_CONFIG[useSide()];
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-quote">
          "Tình yêu không phải là tìm kiếm người hoàn hảo,
          <br />
          mà là học cách yêu một người không hoàn hảo
          <br />
          theo cách hoàn hảo nhất."
        </p>

        <div className="footer-rule" />
        <p className="footer-names">
          {sideData.groomBrideNames[0]} &amp; {sideData.groomBrideNames[1]}
        </p>
        <p className="footer-date">31 · 05 · 2026</p>
        <p className="footer-credit">
          Copyright © 2026 by {sideData.groomBrideNames[0]} &amp;{" "}
          {sideData.groomBrideNames[1]}.
        </p>
      </div>
    </footer>
  );
}
