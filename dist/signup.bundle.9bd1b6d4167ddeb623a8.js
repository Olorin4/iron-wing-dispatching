"use strict";(self.webpackChunkIron_Wing_Dispatching=self.webpackChunkIron_Wing_Dispatching||[]).push([[787],{6217:(n,e,t)=>{t(4637),t(6345);var A=t(5072),i=t.n(A),r=t(7825),o=t.n(r),a=t(7659),l=t.n(a),s=t(5056),d=t.n(s),c=t(540),m=t.n(c),B=t(1113),C=t.n(B),p=t(9159),g={};g.styleTagTransform=C(),g.setAttributes=d(),g.insert=l().bind(null,"head"),g.domAPI=o(),g.insertStyleElement=m(),i()(p.A,g),p.A&&p.A.locals&&p.A.locals;var I=t(7761),h=t.n(I);class u{constructor(n){this.form=n,this.inputs=n.querySelectorAll("input"),this.init()}init(){this.form.addEventListener("submit",(n=>{n.preventDefault();const e=document.getElementById("confirmation-message");this.validateForm()?(console.log("Form is valid!"),e.classList.remove("hidden"),this.submitForm()):(console.log("Form has errors."),e.classList.add("hidden"))}))}validateForm(){let n=!0;return this.inputs.forEach((e=>{this.validateField(e)||(n=!1)})),n}validateField(n){const e=n.value.trim(),t=n.type;return"first-name"===n.id&&(""===e||e.length<3)?(this.showError(n,"First name must be at least 3 characters."),!1):"last-name"===n.id&&(""===e||e.length<3)?(this.showError(n,"Last name must be at least 3 characters."),!1):"email"!==t||h().isEmail(e)?"fleet-size"!==n.id||""===e||h().isInt(e,{min:1})?"trailer-type"===n.id&&""===e?(this.showError(n,"Please enter the type of trailer."),!1):"plan-input"!==n.id||""!==e&&"No plan selected"!==e?(this.hideError(n),!0):(this.showError(n,"Please select a pricing plan."),!1):(this.showError(n,"Please enter a valid number of trucks."),!1):(this.showError(n,"Please enter a valid email address."),!1)}showError(n,e){const t=this.form.querySelector(`.error-message[data-error-for="${n.id}"]`);t?(t.textContent=e,t.classList.add("show-error"),n.style.borderColor="red"):console.warn(`Error element not found for input: ${n.id}`)}hideError(n){const e=this.form.querySelector(`.error-message[data-error-for="${n.id}"]`);e?(e.textContent="",e.classList.remove("show-error"),n.style.borderColor=""):console.warn(`Error element not found for input: ${n.id}`)}async submitForm(){const n={firstName:document.getElementById("first-name").value,lastName:document.getElementById("last-name").value,email:document.getElementById("e-mail").value,phone:document.getElementById("tel").value,fleetSize:document.getElementById("fleet-size").value,trailerType:document.getElementById("trailer-type").value,plan:document.getElementById("plan-input").value},e=document.querySelector(".primary-cta"),t=document.getElementById("confirmation-message");e.disabled=!0,t.innerText="Submitting...",console.log("📩 Submitting Form Data:",n);try{const A=await fetch("https://api.iron-wing-dispatching.com/sign-up-forms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!A.ok)throw new Error(`Server responded with ${A.status}`);const i=await A.json();console.log("Form successfully submitted!",i),e.classList.add("hidden"),t.classList.remove("hidden"),t.innerText="✅ Submission successful! We'll contact you soon."}catch(n){console.error("Error submitting form:",n),t.innerText=`⚠️ ${n.message||"Server error. Please try again later."}`}finally{e.disabled=!1}}}document.addEventListener("DOMContentLoaded",(()=>{console.log("Sign-Up Page JS Loaded"),function(){const n=document.getElementById("plan-name"),e=document.getElementById("plan-input");if(!e)return void console.error("❌ Error: Element with ID 'plan-input' not found.");const t=new URLSearchParams(window.location.search).get("plan");t?(n.textContent=t,e.value=t):(n.closest("legend").innerHTML='Please select a<span class="break"></span> pricing plan <a href="./index.html#pricing">here</a>.',e.value="No plan selected"),console.log("✅ Plan set to:",e.value)}();const n=document.querySelector("#sign-up-form");new u(n)}))},9159:(n,e,t)=>{t.d(e,{A:()=>a});var A=t(1354),i=t.n(A),r=t(6314),o=t.n(r)()(i());o.push([n.id,'main {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr;\n    justify-content: center;\n    align-items: center;\n}\n\n/* LEFT SIDE */\n.hero {\n    position: relative;\n    grid-column: 1;\n    width: 50vw;\n    height: 100vh;\n}\n\n.hero:before {\n    content: "";\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: linear-gradient(\n        172deg,\n        rgb(0, 98, 139) 0%,\n        rgba(0, 0, 0, 0.7) 100%\n    );\n    z-index: 1;\n}\n\n.hero img {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    z-index: 0;\n}\n\n.hero-text {\n    position: relative;\n    width: 60%;\n    margin: auto;\n    z-index: 2;\n    margin-top: auto;\n    line-height: 1.6;\n}\n\nh3 {\n    padding: 30px;\n    text-align: center;\n    color: rgb(178, 178, 178);\n}\n\n.logo-overlay {\n    position: relative;\n    top: 2rem;\n    left: 35%;\n    z-index: 2;\n}\n\n.logo-overlay img {\n    max-width: 350px;\n    height: auto;\n    opacity: 0.4;\n}\n\n/* RIGHT SIDE */\n.right-section {\n    grid-column: 2;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n    width: 50vw;\n    height: 100vh;\n}\n\n.form-container {\n    height: 75vh;\n    width: 100%;\n    padding-top: 35px;\n}\n\nform {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\nfieldset {\n    border: none;\n    height: 67%;\n    color: rgb(108, 105, 105);\n    padding: 15px;\n}\n\nlegend {\n    text-align: center;\n    padding-left: 20px;\n    padding-top: 20px;\n    font-weight: 700;\n    font-size: 1.5rem;\n}\n\nlegend a {\n    color: inherit !important;\n    text-decoration: underline !important;\n}\n\n.user-info {\n    display: flex;\n    margin: 25px;\n}\n\nlabel {\n    align-self: flex-start;\n    font-size: 0.58em;\n    font-weight: 700;\n    color: rgb(136, 132, 132);\n}\n\ninput {\n    border: 0.5px solid #e5e7eb;\n    border-radius: 3px;\n    height: 35px;\n}\n\n.first-name {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.last-name {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\n.e-mail {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.tel {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\n.fleet-size {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.trailer-type {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\ninput:hover {\n    background: rgba(200, 210, 239, 0.1);\n}\n\ninput:focus {\n    border: 1px solid blue;\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n}\n\n/* Show error message when input is invalid and submit button is clicked */\nspan.show-error {\n    position: absolute;\n    display: block;\n    font-size: 0.6rem;\n    color: red;\n    top: 33px;\n    left: 5px;\n}\n\n#confirmation-message.hidden,\n.primary-cta.hidden {\n    display: none;\n}\n\n#confirmation-message {\n    display: block;\n    margin-top: 2rem;\n    color: #4caf50; /* Green for success */\n    font-size: 1rem;\n    text-align: center;\n}\n\n@media (max-width: 1024px) {\n    .hero-text {\n        margin: 0;\n        width: 100%;\n    }\n    .logo-overlay {\n        top: 1.5rem;\n        left: 25%;\n        width: 250px;\n    }\n}\n@media (max-width: 768px) {\n    main {\n        grid-template-columns: 1fr;\n        grid-template-rows: 600px 880px;\n    }\n    .hero {\n        grid-column: 1;\n        grid-row: 2;\n        width: 100vw;\n    }\n    .hero-text {\n        margin: 0;\n        width: 100%;\n    }\n    .logo-overlay {\n        top: 1.5rem;\n        left: 35%;\n        width: 250px;\n    }\n    .right-section {\n        grid-column: 1;\n        grid-row: 1;\n        width: 100vw;\n        height: 65vh;\n    }\n    .form-container {\n        height: 80%;\n        padding-top: 0;\n    }\n    fieldset {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        padding: 0;\n    }\n    fieldset .user-info {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        margin: 0;\n    }\n    legend {\n        padding: 0;\n    }\n    .user-info div {\n        margin: 10px 0 0 0;\n    }\n    .user-info input {\n        width: 280px;\n    }\n    .primary-cta {\n        margin-top: 30px;\n        width: 280px;\n    }\n}\n\n@media (max-width: 428px) {\n    .logo-overlay {\n        top: 1rem;\n        left: 25%;\n        width: 250px;\n        transform: translateX(0%);\n    }\n}\n\n@media (max-width: 350px) {\n    .logo-overlay {\n        top: 1rem;\n        left: 10%;\n        width: 250px;\n        transform: translateX(0%);\n    }\n}\n',"",{version:3,sources:["webpack://./src/sign-up-form/sign-up.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,8BAA8B;IAC9B,uBAAuB;IACvB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA,cAAc;AACd;IACI,kBAAkB;IAClB,cAAc;IACd,WAAW;IACX,aAAa;AACjB;;AAEA;IACI,WAAW;IACX,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,WAAW;IACX,YAAY;IACZ;;;;KAIC;IACD,UAAU;AACd;;AAEA;IACI,kBAAkB;IAClB,MAAM;IACN,OAAO;IACP,WAAW;IACX,YAAY;IACZ,iBAAiB;IACjB,UAAU;AACd;;AAEA;IACI,kBAAkB;IAClB,UAAU;IACV,YAAY;IACZ,UAAU;IACV,gBAAgB;IAChB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,kBAAkB;IAClB,yBAAyB;AAC7B;;AAEA;IACI,kBAAkB;IAClB,SAAS;IACT,SAAS;IACT,UAAU;AACd;;AAEA;IACI,gBAAgB;IAChB,YAAY;IACZ,YAAY;AAChB;;AAEA,eAAe;AACf;IACI,cAAc;IACd,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,mBAAmB;IACnB,WAAW;IACX,aAAa;AACjB;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,iBAAiB;AACrB;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,yBAAyB;IACzB,aAAa;AACjB;;AAEA;IACI,kBAAkB;IAClB,kBAAkB;IAClB,iBAAiB;IACjB,gBAAgB;IAChB,iBAAiB;AACrB;;AAEA;IACI,yBAAyB;IACzB,qCAAqC;AACzC;;AAEA;IACI,aAAa;IACb,YAAY;AAChB;;AAEA;IACI,sBAAsB;IACtB,iBAAiB;IACjB,gBAAgB;IAChB,yBAAyB;AAC7B;;AAEA;IACI,2BAA2B;IAC3B,kBAAkB;IAClB,YAAY;AAChB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;IACI,kBAAkB;IAClB,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA;IACI,oCAAoC;AACxC;;AAEA;IACI,sBAAsB;IACtB,uCAAuC;AAC3C;;AAEA,0EAA0E;AAC1E;IACI,kBAAkB;IAClB,cAAc;IACd,iBAAiB;IACjB,UAAU;IACV,SAAS;IACT,SAAS;AACb;;AAEA;;IAEI,aAAa;AACjB;;AAEA;IACI,cAAc;IACd,gBAAgB;IAChB,cAAc,EAAE,sBAAsB;IACtC,eAAe;IACf,kBAAkB;AACtB;;AAEA;IACI;QACI,SAAS;QACT,WAAW;IACf;IACA;QACI,WAAW;QACX,SAAS;QACT,YAAY;IAChB;AACJ;AACA;IACI;QACI,0BAA0B;QAC1B,+BAA+B;IACnC;IACA;QACI,cAAc;QACd,WAAW;QACX,YAAY;IAChB;IACA;QACI,SAAS;QACT,WAAW;IACf;IACA;QACI,WAAW;QACX,SAAS;QACT,YAAY;IAChB;IACA;QACI,cAAc;QACd,WAAW;QACX,YAAY;QACZ,YAAY;IAChB;IACA;QACI,WAAW;QACX,cAAc;IAClB;IACA;QACI,aAAa;QACb,sBAAsB;QACtB,uBAAuB;QACvB,mBAAmB;QACnB,UAAU;IACd;IACA;QACI,aAAa;QACb,sBAAsB;QACtB,uBAAuB;QACvB,mBAAmB;QACnB,SAAS;IACb;IACA;QACI,UAAU;IACd;IACA;QACI,kBAAkB;IACtB;IACA;QACI,YAAY;IAChB;IACA;QACI,gBAAgB;QAChB,YAAY;IAChB;AACJ;;AAEA;IACI;QACI,SAAS;QACT,SAAS;QACT,YAAY;QACZ,yBAAyB;IAC7B;AACJ;;AAEA;IACI;QACI,SAAS;QACT,SAAS;QACT,YAAY;QACZ,yBAAyB;IAC7B;AACJ",sourcesContent:['main {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr;\n    justify-content: center;\n    align-items: center;\n}\n\n/* LEFT SIDE */\n.hero {\n    position: relative;\n    grid-column: 1;\n    width: 50vw;\n    height: 100vh;\n}\n\n.hero:before {\n    content: "";\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: linear-gradient(\n        172deg,\n        rgb(0, 98, 139) 0%,\n        rgba(0, 0, 0, 0.7) 100%\n    );\n    z-index: 1;\n}\n\n.hero img {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    z-index: 0;\n}\n\n.hero-text {\n    position: relative;\n    width: 60%;\n    margin: auto;\n    z-index: 2;\n    margin-top: auto;\n    line-height: 1.6;\n}\n\nh3 {\n    padding: 30px;\n    text-align: center;\n    color: rgb(178, 178, 178);\n}\n\n.logo-overlay {\n    position: relative;\n    top: 2rem;\n    left: 35%;\n    z-index: 2;\n}\n\n.logo-overlay img {\n    max-width: 350px;\n    height: auto;\n    opacity: 0.4;\n}\n\n/* RIGHT SIDE */\n.right-section {\n    grid-column: 2;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n    width: 50vw;\n    height: 100vh;\n}\n\n.form-container {\n    height: 75vh;\n    width: 100%;\n    padding-top: 35px;\n}\n\nform {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\nfieldset {\n    border: none;\n    height: 67%;\n    color: rgb(108, 105, 105);\n    padding: 15px;\n}\n\nlegend {\n    text-align: center;\n    padding-left: 20px;\n    padding-top: 20px;\n    font-weight: 700;\n    font-size: 1.5rem;\n}\n\nlegend a {\n    color: inherit !important;\n    text-decoration: underline !important;\n}\n\n.user-info {\n    display: flex;\n    margin: 25px;\n}\n\nlabel {\n    align-self: flex-start;\n    font-size: 0.58em;\n    font-weight: 700;\n    color: rgb(136, 132, 132);\n}\n\ninput {\n    border: 0.5px solid #e5e7eb;\n    border-radius: 3px;\n    height: 35px;\n}\n\n.first-name {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.last-name {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\n.e-mail {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.tel {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\n.fleet-size {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n}\n\n.trailer-type {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    margin-left: 20px;\n}\n\ninput:hover {\n    background: rgba(200, 210, 239, 0.1);\n}\n\ninput:focus {\n    border: 1px solid blue;\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n}\n\n/* Show error message when input is invalid and submit button is clicked */\nspan.show-error {\n    position: absolute;\n    display: block;\n    font-size: 0.6rem;\n    color: red;\n    top: 33px;\n    left: 5px;\n}\n\n#confirmation-message.hidden,\n.primary-cta.hidden {\n    display: none;\n}\n\n#confirmation-message {\n    display: block;\n    margin-top: 2rem;\n    color: #4caf50; /* Green for success */\n    font-size: 1rem;\n    text-align: center;\n}\n\n@media (max-width: 1024px) {\n    .hero-text {\n        margin: 0;\n        width: 100%;\n    }\n    .logo-overlay {\n        top: 1.5rem;\n        left: 25%;\n        width: 250px;\n    }\n}\n@media (max-width: 768px) {\n    main {\n        grid-template-columns: 1fr;\n        grid-template-rows: 600px 880px;\n    }\n    .hero {\n        grid-column: 1;\n        grid-row: 2;\n        width: 100vw;\n    }\n    .hero-text {\n        margin: 0;\n        width: 100%;\n    }\n    .logo-overlay {\n        top: 1.5rem;\n        left: 35%;\n        width: 250px;\n    }\n    .right-section {\n        grid-column: 1;\n        grid-row: 1;\n        width: 100vw;\n        height: 65vh;\n    }\n    .form-container {\n        height: 80%;\n        padding-top: 0;\n    }\n    fieldset {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        padding: 0;\n    }\n    fieldset .user-info {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        margin: 0;\n    }\n    legend {\n        padding: 0;\n    }\n    .user-info div {\n        margin: 10px 0 0 0;\n    }\n    .user-info input {\n        width: 280px;\n    }\n    .primary-cta {\n        margin-top: 30px;\n        width: 280px;\n    }\n}\n\n@media (max-width: 428px) {\n    .logo-overlay {\n        top: 1rem;\n        left: 25%;\n        width: 250px;\n        transform: translateX(0%);\n    }\n}\n\n@media (max-width: 350px) {\n    .logo-overlay {\n        top: 1rem;\n        left: 10%;\n        width: 250px;\n        transform: translateX(0%);\n    }\n}\n'],sourceRoot:""}]);const a=o}},n=>{n.O(0,[752,341],(()=>n(n.s=6217))),n.O()}]);
//# sourceMappingURL=signup.bundle.9bd1b6d4167ddeb623a8.js.map