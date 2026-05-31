import React from "react";

function Header({onOpenSettings}) {
    return (
      <div className="header">
        <div className="logo">∴</div>

        <div>
          <h1>Therefore</h1>
          <p>Think beyond the claim.</p>
        </div>

        <button className="menu-button" onClick={onOpenSettings}>•••</button>
      </div>
    );
  }

  export default Header;