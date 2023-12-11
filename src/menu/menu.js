import React from 'react';

import {
    Link
  } from "react-router-dom";

function Menu() {
  return (
    <nav className="menu" 
    aria-label="Main menu"
    itemScope
    itemType="https://schema.org/SiteNavigationElement">
    <ul>

      <li><Link itemProp="url" to="/" tabIndex="2">Homepage</Link></li>

      <li><Link itemProp="url" to="/about" tabIndex="3">About</Link></li>

      <li><Link itemProp="url" to="/login" tabIndex="4">Login</Link></li>
      <li>
        <Link to="https://google.com" tabIndex="5" target="blank">Google</Link>
      </li>
    </ul>
  </nav>
  );
}

export default Menu;