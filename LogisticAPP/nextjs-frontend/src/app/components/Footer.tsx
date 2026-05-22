import React from "react";

export default function Footer() {
  return (
    <div className="contenitore mt-auto">
      <div className="contenuto p-6 text-gray-700 bg-gray-50">
        
    
      </div>

      <footer className="bg-gray-800 text-white text-center py-8">
        LogicAPP | Genova indirizzo a caso (Ge) ITALIA | P.Iva 000000000 <br />
        <a className="trans-color-text text-blue-400 hover:text-blue-300" href="#">logicAPP.info@gmail.com</a> | <span itemProp="telephone"><a href="#" className="hover:text-gray-300">+39 347 58 30 387</a></span>
        <br />

        <div className="social-cont mt-6">
          <ul className="social-list flex justify-center space-x-4 mb-4">
            <li><a target="_blank" href="#"><img src="https://www.chefstudio.it/img/instagram-icon.png" title="Instagram" alt="Instagram icon" className="w-8 h-8" /></a></li>
          </ul>
          <div className="floatstop clear-both"></div>
        </div>

        <div className="text-sm text-gray-400 mt-4">
          Designed by<br />
          <div className="credits flex justify-center mt-2">
            <a target="_blank" href="#"><img width="100" src="https://www.chefstudio.it/img/your-logo.png" title="#" alt="#" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}