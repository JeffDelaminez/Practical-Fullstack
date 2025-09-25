import React from "react";
import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Project. All rights reserved.</p>
    </footer>
  );
}
