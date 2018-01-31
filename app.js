import pako from './lib/pako.min.js'
const WS_URL = 'wss://api.huobi.pro/ws';

App({
  socketTask: null,
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
    const self = this;
    self.soketTask = wx.connectSocket({
      url: WS_URL
    });
    self.soketTask.onOpen(() => {
      console.log('WebSocket连接已打开！');

      self.soketTask.send({
        data: JSON.stringify({
          "req": "market.btcusdt.kline.1min",
          "id": "id10"
        })
      });
      self.soketTask.onMessage((res) => {
        let text = pako.inflate(res.data, {
          to: 'string'
        });
        console.log(JSON.parse(text))
        
      })
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
