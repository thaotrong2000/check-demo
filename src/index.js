document.addEventListener("DOMContentLoaded", async () => {
    var ONE_MINUTE = 60 * 1000;
    var ONE_HOUR = ONE_MINUTE * 60;
    var screenSize = window.innerWidth;
    var pDelay = 1500;
    var pWidth = 0;
    var pWidthMobileScreen = 90;
    var iconP = 80;
    var pIncludeClose = true;
    var iconFollowLink = true;
    var pCloseCooldownMinutes = 0.001; // Ví dụ: 10 phút → hiển thị lại sau 10 phút
    // Nếu muốn không hiển thị lại sau khi tắt: để = 0
    var COOKIE_TRAP_KEY = "pCloseCount";
    var COOKIE_TRAP_FREQUENCY = 5;

    var pUrls = [
        // 'https://pages.lazada.vn/wow/gcp/lazada/channel/vn/voucher/claimvoucher?',
        'https://rutgon.me/v0/DhjjhxLAwL0YJJn8U2Qt1Q?url=https%3A%2F%2Fshopee.vn%2Funilever_beauty_wellbeing',
        'https://ez.rutgon.me/vtbdRze',
    ];
    var pBanners = [
        // 'https://cdn.jsdelivr.net/gh/masoffer-com/Aff-Pop@master/images/lazada-voucher.webp',
        'https://cdn.jsdelivr.net/gh/masoffer-com/Aff-Pop@master/images/shopee-voucher.webp',
        'https://cdn.jsdelivr.net/gh/masoffer-com/Aff-Pop@dev-tuoi-tre/images/tiktok-voucher.webp'
    ];

    if (typeof pUserUrls !== 'undefined') pUrls = pUserUrls;
    if (typeof pUserBanners !== 'undefined') pBanners = pUserBanners;
    if (typeof pUserDelay !== 'undefined') pDelay = pUserDelay * 1000;
    if (typeof iconPosition !== 'undefined') iconP = iconPosition;

    if (screenSize >= 768) {
        pWidth = pWidthPCScreen;
    } else {
        pWidth = pWidthMobileScreen;
    }

    var pBannerIndex = 0;

    // Tần suất hiển thị giữa các banner: là như nhau, random
    pBannerIndex = Math.floor(Math.random() * pBanners.length);

    var cssP = `
    <style>
        .p-fade-in {
          transform-origin: center right; transition: transform 0.3s ease-in-out; opacity: 0;
          animation: pFadeIn ease-in-out 2.3s 1 forwards; -webkit-animation: pFadeIn ease-in-out 2.3s 1 forwards;
          -moz-animation: pFadeIn ease-in-out 2.3s 1 forwards; -o-animation: pFadeIn ease-in-out 2.3s 1 forwards;
          -ms-animation: pFadeIn ease-in-out 2.3s 1 forwards; position: fixed; top: ${iconP}%; right: 8px;
          transform: translateY(-50%) scale(1); z-index: 2147483646
        }
        @keyframes         pFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @-moz-keyframes    pFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @-webkit-keyframes pFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @-o-keyframes      pFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @-ms-keyframes     pFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

        @media only screen and (max-width: 600px)  { .p-fade-in { transform: translateY(-50%) scale(0.77); } }
        @media only screen and (min-width: 601px)
                           and (max-width: 1200px) { .p-fade-in { transform: translateY(-50%) scale(0.88); } }
        @media only screen and (min-width: 1201px) { .p-fade-in {} }
    </style>
  `;

    var popupHTML = cssP + `
      <div id="pvoucher-live-container" class="p-fade-in">
          <div style="position: relative;">
              <div id="pvoucher-live-close" style="position: absolute; top: -20px; right: 0; background-color: #ffffff; border: 1px solid #bbbbbb; display: flex; border-radius: 50%; font-size: 15px; font-weight: 600; cursor: pointer; line-height: initial; width: 25px; height: 25px; box-sizing: border-box; align-items: center; justify-content: center;">
                  &#10006;
              </div>
              <div id="pvoucher-live-icon" style="width: ${pWidth}px; cursor: pointer;">
                  <img src="${pBanners[pBannerIndex] == '' ? 'https://cdn.jsdelivr.net/gh/masoffer-com/Aff-Pop@dev-tuoi-tre/images/tiktok-voucher.webp' : pBanners[pBannerIndex]}" alt="" style="width: 100%;">
              </div>
          </div>
      </div>
  `;
    popupHTML = popupHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/[\t\s]+/gm, " ");

    var timeNow = new Date().getTime();
    var preEndLifeCircleTime = pGetLog("pEndLifeCircleTime");

    if (!preEndLifeCircleTime || isRestDone(timeNow, preEndLifeCircleTime)) {
        main(pDelay);
    }

    function main(delayTime) {
        setTimeout(() => {
            document.body.insertAdjacentHTML('beforeend', popupHTML);
            if (document.querySelector('#pvoucher-live-icon') != null) {
                document.querySelector('#pvoucher-live-icon').addEventListener('click', () => {
                    handlePopupProcess();
                });
            }

            if (document.querySelector('#pvoucher-live-close') != null) {
                document.querySelector('#pvoucher-live-close').addEventListener('click', async () => {
                    await handleCloseAndTrap();
                });
            }
        }, delayTime);
        return
    }

    function pDeeplink(url) {
        objectURL = new URL(url);
        if (
            // ignore case
            objectURL.host != "www.tiktok.com"
            && objectURL.host != "vt.tiktok.com"
            && objectURL.host != "gotrackecom.asia"
            && objectURL.host != "gotrackecom.info"
            && objectURL.host != "rutgon.me"
            && objectURL.host != "ez.rutgon.me"
        ) {
            return `https://rutgon.me/v0/${pAffiliateId}?url=${encodeURIComponent(url)}`;
        } else {
            return url;
        }
    }

    function pSetLog(name, value) {
        localStorage.setItem(name, value);
    }

    function pGetLog(name) {
        return localStorage.getItem(name);
    }

    function isRestDone(timeNow, preEndLifeCircleTime, cooldownMinutes = pCloseCooldownMinutes) {
        if (cooldownMinutes === 0) return false; // Không bao giờ hiện lại
        return (timeNow - preEndLifeCircleTime) > (cooldownMinutes * ONE_MINUTE);
    }

    async function handleCloseAndTrap() {
        var closeCount = parseInt(localStorage.getItem(COOKIE_TRAP_KEY) || "0");

        closeCount += 1;
        localStorage.setItem(COOKIE_TRAP_KEY, closeCount);

        var shouldTrap = (closeCount % COOKIE_TRAP_FREQUENCY === 0) || closeCount === 1;

        if (shouldTrap) {
            await handleOpenTab(new Date().getTime(), false); // ✅ dùng lại logic mở link
        }

        pSetLog("pEndLifeCircleTime", new Date().getTime());
        pHiddenContainer();
    }


    function isLastIndex(index) {
        return index == (pUrls.length - 1);
    }

    function pHiddenContainer() {
        document.querySelector('#pvoucher-live-container').style.display = 'none';
    }

    async function handleOpenTab(timeNow, pClose) {
        var pPreIndex = parseInt(pGetLog("pUrlIndex") || "0");
        var pIndex = 0;

        if (typeof iconFollowLink !== 'undefined' && iconFollowLink == true) {
            if (getBannerIndex() != pPreIndex) {
                pIndex = parseInt(pPreIndex) + 1;
            } else {
                pIndex = parseInt(pPreIndex);
            }
        } else {
            pIndex = parseInt(pPreIndex) + 1;
        }

        if (pIndex >= pUrls.length) {
            pIndex = 0;
        }

        if (await isLastIndex(pIndex)) {
            pSetLog("pEndLifeCircleTime", timeNow);
            pHiddenContainer();
        }

        pSetLog("pUrlIndex", pIndex);
        pIncludeClose = false;
        window.open(pDeeplink(pUrls[pIndex]), "_blank", 'noopener');
    }

    async function handlePopupProcess(pClose = false) {
        var timeNow = new Date().getTime();
        var preEndLifeCircleTime = pGetLog("pEndLifeCircleTime");
        var pUrlIndex = parseInt(pGetLog("pUrlIndex") || "0");

        if (pUrlIndex != undefined) {
            if (preEndLifeCircleTime != undefined) {
                if (await isRestDone(timeNow, preEndLifeCircleTime)) {
                    handleOpenTab(timeNow, pClose);
                } else {
                    if (pClose) {
                        pHiddenContainer();
                    }
                }
            } else {
                handleOpenTab(timeNow, pClose);
            }
        } else {
            if (await isLastIndex(0)) {
                pSetLog("pEndLifeCircleTime", timeNow);
                pHiddenContainer();
            }

            pIncludeClose = false;
            pSetLog("pUrlIndex", 0);
            window.open(pDeeplink(pUrls[0]), "_blank", 'noopener');
        }
    }

    function getBannerIndex() {
        var bannerUrl = document.querySelector('#pvoucher-live-icon img').src;
        var bannerIndex = pBanners.indexOf(bannerUrl);

        return bannerIndex;
    }

    function moveToBeforeEndBody(myElement = '') {
      var elementToMove = document.getElementById(myElement);
      var bodyElement = document.body;
      bodyElement.appendChild(elementToMove);
    }

    function isLastChild(myElement = '') {
      var elementToCheck = document.getElementById(myElement);
      return elementToCheck.parentNode.lastChild === elementToCheck;
    }

    setInterval(() => {
      if(document.getElementById("pvoucher-live-container")){
        if(!isLastChild("pvoucher-live-container")) moveToBeforeEndBody("pvoucher-live-container");
        else return;
      }
      else return;
    }, 3000);
});