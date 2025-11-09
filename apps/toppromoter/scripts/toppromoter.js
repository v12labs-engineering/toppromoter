let ToppromoterDomainRoot = 'https://app.toppromoter.io';
if(window.location.href.includes('toppromoterTestingMode=true')){
  ToppromoterDomainRoot = 'http://localhost:9000';
}
const ToppromoterAPIRoot = ToppromoterDomainRoot+'/api/v1';
const rootDomain = window.location.origin;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const toppromoterVerifyParam = urlParams.get("toppromoterVerify");
const toppromoterReferralParam = urlParams.get("via") ? urlParams.get("via") : urlParams.get("ref") ? urlParams.get("ref") : null;
const toppromoterRetrieveReferralParam = urlParams.get("referral") ? urlParams.get("referral") : null;
let toppromoterReferralObject = localStorage.getItem('toppromoterReferral');
const toppromoterInnerScript = document.querySelector("script[data-toppromoter]");
let scrolledPercentage = (((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100).toFixed(0));

//Define base Toppromoter class.
class tpr {
  details(){
    return({
      companyId: toppromoterInnerScript.getAttribute("data-toppromoter") ? toppromoterInnerScript.getAttribute("data-toppromoter") : null,
      rootDomain: rootDomain,
      domains: toppromoterInnerScript.getAttribute("data-domains") ? toppromoterInnerScript.getAttribute("data-domains") : null,
      hidePopup: toppromoterInnerScript.getAttribute("hidePopup") ? true : false,
      privacyCompliance: toppromoterInnerScript.getAttribute("privacyCompliance") ? true : false,
      apiUrl: ToppromoterAPIRoot
    })
  }
  async checkDomainVerification(){
    return await fetch(ToppromoterAPIRoot+'/verify-company').then(function(response) {
      return response.json();
    });
  }
  async impression(referralCode, companyId){
    if(!referralCode || !companyId) console.warn("Toppromoter.io: could not track impression. Referral code / companyId not found.");
    
    return await fetch(ToppromoterAPIRoot+'/record-referral', {
      method: 'POST',
      body: JSON.stringify({
        referralCode: referralCode,
        companyId: companyId
      }),
    }).then(function (response) {
      return response.json();
    })
  }
  async campaignDetails(referralCode, companyId){
    if(!referralCode || !companyId) console.warn("Toppromoter.io: could not get campaign details. Referral code / companyId not found.");
    
    return await fetch(ToppromoterAPIRoot+'/campaign-details', {
      method: 'POST',
      body: JSON.stringify({
        referralCode: referralCode,
        companyId: companyId
      }),
    }).then(function (response) {
      return response.json();
    })
  }
  checkCookie(){
    let name = "toppromoterData=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        try {
          return JSON.parse(c.substring(name.length, c.length))
        } catch (error) {
          return {
            "error": true
          };
        }
      }
    }
    return null;
  }
  deleteCookie(){
    document.cookie = 'toppromoterData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return "cookie_deleted";
  }
  consentRequired(){
    if(Intl.DateTimeFormat().resolvedOptions().timeZone && Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") >= 0 && Toppromoter.details().privacyCompliance === true){
      return true;
    }

    return false;
  }
  cookieEligible(){
    if(toppromoterReferralParam !== null && Toppromoter.details().companyId !== null && Toppromoter.checkCookie() === null){
      return true;
    }

    return false;
  }
  cookieExists(){
    if(Toppromoter.checkCookie() === null){
      return false;
    }

    return true;
  }
  checkForOtherDomains(){
    //If multiple domains, add referral to other domain
    if(Toppromoter.details().domains && Toppromoter.checkCookie() !== null){
      if(Toppromoter.details().domains?.includes(",")){
        document.querySelectorAll("[href]").forEach(link => {
          let baseUrl = new URL(link.href);

          if(baseUrl.origin !== Toppromoter.details().rootDomain){
            Toppromoter.details().domains.replace(/”/g, '').split(',').map(domain => {              
              if(baseUrl.origin === domain.trim()){
              
                let searchParams = baseUrl.searchParams;
                
                searchParams.set('referral', Toppromoter.checkCookie()?.referral_id);
                
                baseUrl.search = searchParams.toString();
                
                let newUrl = baseUrl.toString();
        
                link.href = newUrl;
              }
            })
          }
        });
      }

      return true;
    } else {
      return false;
    }
  }
  consentCleanup(){
    if(document.getElementById('toppromoter-confirm-modal')){
      document.getElementById('toppromoter-confirm-modal').parentNode.removeChild(document.getElementById('toppromoter-confirm-modal'));
    }
    if(document.getElementById('toppromoter-confirm')){
      document.getElementById('toppromoter-confirm').parentNode.removeChild(document.getElementById('toppromoter-confirm'));
    }
    if(document.getElementById('toppromoter-confirm-styles')){
      document.getElementById('toppromoter-confirm-styles').parentNode.removeChild(document.getElementById('toppromoter-confirm-styles'));
    }
    if(document.getElementById('toppromoter-consent')){
      document.getElementById('toppromoter-consent').parentNode.removeChild(document.getElementById('toppromoter-consent'));
    }
  }
  async register(){
    if(Toppromoter.cookieEligible() === true){
      if(document.getElementById('toppromoter-confirm-button')){
        document.getElementById('toppromoter-confirm-button').innerText = "Loading...";
      }

      const trackImpression = await Toppromoter.impression(toppromoterReferralParam, Toppromoter.details().companyId);
      
      if(trackImpression?.referral_details){
        //Set cookie
        document.cookie = `toppromoterData=${JSON.stringify(trackImpression?.referral_details)}; expires=${trackImpression?.referral_details?.cookie_date}`;

        Toppromoter.checkForOtherDomains();
      } else {
        Toppromoter.consentCleanup();
      }
    }    
  }
  async showPopup(){

    //If already denied popup, don't get campaign details etc and show popup again.
    if(localStorage.getItem('toppromoterNoConsent')) return false;

    //Gets public campaign details and discounts from API
    const campaign = await Toppromoter.campaignDetails(toppromoterReferralParam, Toppromoter.details().companyId);

    //If API call is invalid, don't show popup.
    if(!campaign?.campaign_details) return false;
    
    //Add cookie poup to body
    const popupHtml = `
      <div id="toppromoter-confirm-modal">
        <div id="toppromoter-confirm">
          <div id="toppromoter-content-top">
          ${campaign?.campaign_details?.discount_value !== null && campaign?.campaign_details?.discount_type === 'fixed' && campaign?.campaign_details?.company_currency ?
              "<p id='toppromoter-content-title'>You've earned <span>"+campaign?.campaign_details?.company_currency+""+campaign?.campaign_details?.discount_value+" off</span> from a referral.</p>"
            : campaign?.campaign_details?.discount_value !== null ?
              "<p id='toppromoter-content-title'>You've earned <span>"+campaign?.campaign_details?.discount_value+"% off</span> from a referral.</p>"
            :
              "<p id='toppromoter-content-title'>The person who sent you here can earn a referral."
          }
            <p id="toppromoter-content-subtitle">To receive the discount code, please confirm that you consent to using cookies.</p>
          </div>
          <div id="toppromoter-buttons">
            <div id="toppromoter-confirm-button">Accept cookie & get discount</div>
            <div id="toppromoter-cancel-button">No thanks</div>
          </div>
          <div id="toppromoter-content-bottom">
            <p>Please confirm that you're ok for a cookie to be set for our <span>privacy-friendly referral system</span>. The person who sent you here will earn a referral reward, and you'll be given a discount code to use on this site.</p>
          </div>
        </div>
      </div>
    `;
    if(!document.getElementById('toppromoter-confirm')){
      document.body.innerHTML += popupHtml;
    }
    
    setTimeout(() => {
      document.getElementById('toppromoter-confirm-modal').classList.add('toppromoter-appear');
    }, 500);

    //Add fresh stylesheet to body
    if(!document.getElementById('toppromoter-confirm-styles')){
      const popupStyles = `
        #toppromoter-confirm-modal {
          position: fixed;
          z-index: 2147483646;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transition: all 0.4s ease-in-out;
          transition-delay: 1s;
        }
        #toppromoter-confirm-modal.toppromoter-appear {
          background-color: rgba(0,0,0,0.5);
        }
        #toppromoter-confirm {
          position: fixed;
          bottom: 0%;
          left: 50%;
          margin-bottom: 30px;
          transform: translate(-50%, 15%);
          text-align: center;
          font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
          border-radius: 15px;
          overflow: hidden;
          z-index: 2147483647;
          background-color: #FFFFFF;
          border: 4px solid #c2c2c2;
          padding: 18px;
          width: 92%;
          max-width: 320px;
          box-shadow: 0 0 250px rgba(255,255,255,0.60);
          color: #000000;
          opacity: 0;
          transition: all 0.8s ease-in-out;
          transition-delay: 1.5s;
        }
        #toppromoter-confirm-modal.toppromoter-appear #toppromoter-confirm{
          opacity: 1;
          transform: translate(-50%, 0%);
        }
        #toppromoter-confirm * {
          box-sizing: border-box;
        }
        #toppromoter-content-top {
          width: 100%;
        }
        #toppromoter-content-title {
          font-size: 16px;
          line-height: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        #toppromoter-content-title span {
          text-decoration: underline; 
        }
        #toppromoter-content-subtitle {
          font-size: 15px;
          line-height: 20px;
        }
        #toppromoter-confirm-button {
          padding: 15px;
          border-radius: 15px;
          font-size: 16px;
          font-weight: bold;
          background: #ddd;
          cursor: pointer;
          margin-top: 15px;
          border: 2px solid #cccccc;
          color: #000;
        }
        #toppromoter-confirm-button:hover {
          background-color: #cccccc;
        }
        #toppromoter-cancel-button {
          margin-top: 10px;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
        }
        #toppromoter-content-bottom {
          width: 100%;
          margin-top: 15px;
          padding-bottom: 10px;
          border-top: 4px solid #e3e3e3;
        }
        #toppromoter-content-bottom p {
          margin-top: 15px;
          font-size: 13px;
          line-height: 18px;
          color: #848484;
        }
        #toppromoter-content-bottom span {
          font-weight: bold;
        }
        #toppromoter-buttons {
          width: 100%;
        }
        #toppromoter-discount-code {
          width: 100%;
        }
        #toppromoter-discount-code-input {
          font-size: 18px;
          font-weight: bold;
          padding: 10px 20px;
          background: #efefef;
          border: 4px solid #cccccc;
          width: 100%;
          display: block;
          margin-top: 10px;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          text-align: center;
          color: #000;
        }
        #toppromoter-discount-code-text {
          margin-top: 10px;
        }
        #toppromoter-discount-code-text p {
          font-size: 14px;
          line-height: 19px;
          font-style: italic;
          font-weight: bold;
          color: #848484;
        }
        #toppromoter-close-button {
          margin-top: 10px;
          font-size: 16px;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          text-decoration: underline;
        }
      `;
      let styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = popupStyles;
      styleSheet.setAttribute('id','toppromoter-confirm-styles');
      document.head.appendChild(styleSheet);
    }

    //On popup confirm button click
    if(document.getElementById('toppromoter-confirm-button')){
      document.getElementById('toppromoter-confirm-button').addEventListener("click", function() {
        if(document.getElementById('toppromoter-buttons')){
          const buttonsReplace = `
            <div id="toppromoter-discount-code">
              <input value="${campaign?.campaign_details?.discount_code}" id="toppromoter-discount-code-input" type="text" name="toppromoter-discount-code-input"/>
            </div>
            <div>
              <div id="toppromoter-close-button">Close popup</div>
            </div>
          `;
          document.getElementById('toppromoter-buttons').innerHTML = buttonsReplace;

          if(document.getElementById('toppromoter-content-subtitle')){
            document.getElementById('toppromoter-content-subtitle').innerText = 'Use the below discunt code at checkout:';
          }

          if(document.getElementById('toppromoter-discount-code-input') && campaign?.campaign_details?.discount_code){
            document.getElementById('toppromoter-discount-code-input').addEventListener("click", function() {
              document.getElementById('toppromoter-discount-code-input').select();
              document.execCommand('copy');
              document.getElementById('toppromoter-discount-code').innerHTML += `
                <div id="toppromoter-discount-code-text">
                  <p>Copied to clipboard</p>
                </div>
              `;
            });
          }

          if(document.getElementById('toppromoter-close-button')){
            document.getElementById('toppromoter-close-button').addEventListener("click", function() {
              Toppromoter.consentCleanup();
            });
          }
        }
        Toppromoter.register();
      });
    }

    //On popup cancel button click
    if(document.getElementById('toppromoter-cancel-button')){
      document.getElementById('toppromoter-cancel-button').addEventListener("click", function() {
        Toppromoter.consentCleanup();
        localStorage.setItem('toppromoterNoConsent', true);
      });
    }
  }
  async signup(email){
    console.log('Toppromoter.io: Running signup function');

    if(!email || Toppromoter.checkCookie() === null){
      console.warn("Toppromoter.io: Signup could not be tracked.")
      return false;
    }
    
    const convertData = await fetch(ToppromoterAPIRoot+'/signup-referral', {
      method: 'POST',
      body: JSON.stringify({
        referralId: Toppromoter.checkCookie().referral_id,
        cookieDate: Toppromoter.checkCookie().cookie_date,
        email: email
      }),
    }).then(function (response) {
      return response.json();
    });

    if(convertData?.signup_details !== "error"){
      console.log('Toppromoter.io: Signup function successful');
    }

    return convertData;
  }
  getReferralId(){
    if(Toppromoter.checkCookie() !== null){
      if(Toppromoter.checkCookie().referral_id){
        return Toppromoter.checkCookie().referral_id;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  async retrieve(referralId, companyId){
    const referralData = await fetch(ToppromoterAPIRoot+'/retrieve-referral', {
      method: 'POST',
      body: JSON.stringify({
        referralId: referralId,
        companyId: companyId
      }),
    }).then(function (response) {
      return response.json();
    });

    if(referralData !== null){
      console.log("Toppromoter cookie was set")
      //Set cookie
      document.cookie = `toppromoterData=${JSON.stringify(referralData?.referral_details)}; expires=${referralData?.referral_details?.cookie_date}`;
      return true;
    }

    return false;
  }
}

//Activate global class.
var Toppromoter = new tpr;

function activatePopup(){
  if(scrolledPercentage >= 33 && Toppromoter.details().hidePopup === false && Toppromoter.consentRequired() === true && Toppromoter.cookieExists() === false){
    setTimeout(() => {
      Toppromoter.showPopup();
    }, 2000);
  }
}

//Tracking script verification from server 
if(toppromoterVerifyParam !== null){
  if(toppromoterVerifyParam === "true"){
    Toppromoter.checkDomainVerification().then((response) => {
      if(response?.verified === true){
        console.log("Domain verified:")
        console.log("Redirect string: ", `${ToppromoterDomainRoot}/dashboard/${Toppromoter.details().companyId}/setup/verify`)
        window.location.href = `${ToppromoterDomainRoot}/dashboard/${Toppromoter.details().companyId}/setup/verify`
      }
    });
  }
}

if(Toppromoter.consentRequired() === false && Toppromoter.cookieEligible() === true){
  Toppromoter.register();
}

//On load, check for external links etc
document.addEventListener("DOMContentLoaded", function() {
  Toppromoter.checkForOtherDomains();
});

//Initially activate the function to check if already scrolled past 33% of the page.
activatePopup();

//Continually checks if 33% of the page has been scrolled etc.
window.addEventListener("scroll", function checkScrollPercentage() {
  scrolledPercentage = (((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100).toFixed(0));

  if(scrolledPercentage >= 33){
    window.removeEventListener("scroll", checkScrollPercentage, false);
    activatePopup();
  }

}, false);

if(toppromoterRetrieveReferralParam !== null && Toppromoter.cookieExists() === false){
  console.log("Running referral retrieve function")
  Toppromoter.retrieve(toppromoterRetrieveReferralParam, Toppromoter.details().companyId)
}

//If cookie already exists, double check and remove all consent banners.
if(Toppromoter.cookieExists() === true){
  Toppromoter.consentCleanup();
}

window.addEventListener('load', function () {
  //If data-toppromoter form exists, add referral id to the form.
  if(document.querySelector('form[data-toppromoter]') && Toppromoter.checkCookie() !== null){
    const toppromoterForms = document.querySelectorAll('form[data-toppromoter]');
    toppromoterForms.forEach((form) => {
      let newReferralInput = document.createElement('input');
      newReferralInput.type = 'hidden';
      newReferralInput.name = 'toppromoter_referral_id';
      newReferralInput.id = 'toppromoter_referral_id';
      newReferralInput.value = Toppromoter.checkCookie().referral_id;
      form.appendChild(newReferralInput);
    });
  }
});

if(!toppromoterInnerScript) {
  console.error("Could not load Toppromoter: make sure the <script> tag includes data-toppromoter='<companyId>'")
}