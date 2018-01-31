import pako from './lib/pako.min.js'

import { usdt } from './common/coins.js'

const WS_URL = 'wss://api.huobi.pro/ws';

App({
  socketTask: null,
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
    const self = this;
    self.socketTask = wx.connectSocket({
      url: WS_URL
    });
    self.socketTask.onOpen(() => {
      console.log('WebSocket连接已打开！');

      usdt.forEach((item, index) => {
        self.socketTask.send({
          data: JSON.stringify({
            "sub": "market." + item + "usdt.kline.1min",
            "id": "usdt" + item
          })
        });
      })

      self.socketTask.onMessage((res) => {
        let text = pako.inflate(res.data, {
          to: 'string'
        });

        try {
          let respObj = JSON.parse(text);
          console.log(respObj);
          // heart beat
          if (respObj.ping) {
            self.socketTask.send({
              data: JSON.stringify({ "pong": respObj.ping })
            });
          }
        } catch (e) {

        }

      });

      self.socketTask.onClose((errMsg) => {
        debugger
        console.log(errMsg)
      });
      self.socketTask.onError((errMsg) => {
        debugger
        console.log(errMsg)
      });
    });

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    console.log(msg)
  }
})
