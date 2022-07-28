import { addEvent, isDOM, createElement, getElementById, isObj } from "./utils";
import { baseUrl } from "./constants";
import { merge, mergeConfig } from "./utils";
// import web3Mq from "web3-mq";
class SwapChatSdk {
  constructor(content, container, options = {}, params = {}) {
    if (!isDOM()(content) || !isDOM()(container)) {
      return this;
    }
    const defaultOp = { height: 600, width: 400 };
    const defaultParams = {
      platform: "twitter",
      user: { name: "", avatarUrl: "" },
      friend: {
        name: "",
        avatarUrl: "",
        id: "",
      },
      space: { id: "", title: "" },
    };
    this.defaultOptions = isObj(options)
      ? merge({}, defaultOp, options)
      : defaultOp;
    this.defaultParams = isObj(params)
      ? merge({}, defaultParams, params)
      : defaultParams;
    this.status = false;
    this.contenWrapper = content;
    this.button = `<div style="
     height: 44px; 
     min-width: 44px;
     border-radius: 999px;
     padding: 0 20px;
     display: flex; 
     align-items: center;
     font-family: sans-serif;
     background: #605DEC;
     color: #ffffff;
     "
     >
     <div style="display: inline-block; width: 30px; height: 30px; margin-right: 10px;">
        <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
     </div>
        Create a SwapChat        
    </div>`;
    this.container = container;
  }
  exect() {
    let that = this;
    that.contenWrapper.innerHTML = that.button;
    const firstButtonDom = that.contenWrapper.firstChild;
    addEvent(firstButtonDom, "click", function () {
      if (that.status) {
        that.closeClient();
        that.status = false;
      } else {
        that.creatClient();
        that.status = true;
      }
    });
  }
  creactIframeUrl() {
    const that = this;
    let { platform, user, friend, space } = that.defaultParams;
    if (!user.name || user.name === friend.name) {
      return;
    }
    let iframeUrl = `${baseUrl}/chat/chatWebPage?platform=${platform}&fromPage=normal`;
    try {
      if (user.name || friend.name) {
        iframeUrl += `&userHash=${encodeURIComponent(
          user.name + "@@" + friend.name
        )}`;
      }
      if (space.spacid && space.title) {
        let spaceHash = `${space.id}@@${space.title}`;
        iframeUrl += `&spaceHash=${encodeURIComponent(spaceHash)}`;
      }
      if (user.avatarUrl) {
        iframeUrl += `&userAvatar=${encodeURIComponent(user.avatarUrl)}`;
      }
      if (friend.avatarUrl) {
        iframeUrl += `&friendAvatar=${encodeURIComponent(friend.avatarUrl)}`;
      }
      if (friend.id) {
        iframeUrl += `&friendId=${encodeURIComponent(friend.id)}`;
      }
    } catch (e) {}
    return iframeUrl;
  }
  creatClientBox() {
    const that = this;
    let iframeUrl = this.creactIframeUrl();
    const IframeDomWrapper = getElementById("twitter-swapchat-message-body");
    if (IframeDomWrapper) {
      IframeDomWrapper.innerHTML = "";
      IframeDomWrapper.innerHTML = `<iframe class="twitter-swapchat-message-header-iframe" style='width: 100%; height: ${that.defaultOptions.height}px; border: 0;' src=${iframeUrl}></iframe>`;
      return;
    }
    let messageBoxEle =
      createElement(`<div id="web3-swapchat-message-box" style="min-width:120px;width:100%;width:${this.defaultOptions.width}px;overflow:auto">
            </div>`);
    let homeIconEle = createElement(
      "<img class='home-icon' src='https://chat.web3messaging.online/assets/icon/newHomeHeaderIcon.svg' alt='' style='width: auto;height: 28px;margin-right: 8px;border-radius: 4px;' >"
    );
    let goHomeIconEle = createElement(
      "<img class='go-home-icon' src='https://d97ch61yqe5j6.cloudfront.net/frontend/newRefreshIconx3.png' alt='' style='position: absolute;right: 50px;height: 22px;width: auto;z-index: 999;margin-right: 8px;border-radius: 4px; cursor: pointer;' >"
    );
    let slideToggleIconELe = createElement(
      "<img class='slide-toggle-icon' id='web3-slide-toggle-icon'  src='https://d97ch61yqe5j6.cloudfront.net/frontend/headerUp.png' alt='' style='position: absolute;right: 12px;height: 22px;width: auto;z-index: 999;margin-right: 8px;border-radius: 4px;cursor: pointer;'>"
    );
    let messageHeaderEle =
      createElement(`<div class="twitter-swapchat-message-header" style='min-width:240px;position:relative;width:100%;align-items: center;
      width: 100%;
      display:flex;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      font-family: sans-serif;
      padding-left:20px;
      border-bottom: 1px solid #F2F2F2;' >
            </div>
        `);
    let messageBodyEle = createElement(
      "<div class='twitter-swapchat-message-body' id ='twitter-swapchat-message-body' style='overflow:hidden;transition: max-height .25s;max-height:1000px'></div>"
    );
    addEvent(messageHeaderEle, "click", function () {
      const slideToggleIconElement = getElementById("web3-slide-toggle-icon");
      const oriSrc = slideToggleIconElement.src;
      if (oriSrc.indexOf("Up") !== -1) {
        slideToggleIconElement.setAttribute(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png"
        );
        messageBodyEle.style.maxHeight = "0px";
      } else {
        slideToggleIconElement.setAttribute(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerUp.png"
        );
        messageBodyEle.style.maxHeight = "1000px";
      }
    });
    addEvent(goHomeIconEle, "click", function (e) {
      e.stopPropagation();
      const IframeDomWrapper = getElementById("twitter-swapchat-message-body");
      if (IframeDomWrapper) {
        IframeDomWrapper.innerHTML = "";
        IframeDomWrapper.innerHTML = `<iframe class="twitter-swapchat-message-header-iframe" style='width: 100%; height: ${that.defaultOptions.height}px; border: 0;' src=${iframeUrl}></iframe>`;
      }
    });
    messageHeaderEle.appendChild(homeIconEle);
    messageHeaderEle.appendChild(goHomeIconEle);
    messageHeaderEle.appendChild(slideToggleIconELe);
    messageBoxEle.appendChild(messageHeaderEle);
    messageBodyEle.innerHTML = `<iframe
        class="twitter-swapchat-message-header-iframe"
        style="width: 100%; height: ${this.defaultOptions.height}px; border: 0;"
        src=${iframeUrl}
      ></iframe>`;

    messageBoxEle.appendChild(messageBodyEle);
    this.container.appendChild(messageBoxEle);
    this.currentMessageBoxEle = messageBoxEle;
  }
  loginByloginParams() {}
  async creatClient() {
    await this.creatClientBox();
  }
  closeClient() {
    if (this.currentMessageBoxEle) {
      this.container.removeChild(this.currentMessageBoxEle);
      this.currentMessageBoxEle = null;
    }
  }
}
SwapChatSdk.merge = merge;
SwapChatSdk.mergeConfig = mergeConfig;

export default SwapChatSdk;
