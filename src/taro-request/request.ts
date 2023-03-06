import Taro, {
  getStorageSync
  getCurrentInstance,
} from "@tarojs/taro";
const requestUrl =''
// 是否正在刷新的标记
let isRefreshing = false;
//重试队列
let requests = [];
const CODE_SUCCESS = 200;
export default async function fetch(options: any) {
  const {url, payload, method = "GET"} = options;
  const {showToast = true, showLoading = true} = payload || {
    showToast: true,
    showLoading: true
  };
  let token = getStorageSync('token')
  const header = token ? {Authorization: `${token}`} : {};
    header["content-type"] = "application/json;charset=utf-8";
  if (showLoading) {
    Taro.showLoading({
      title: "加载中..."
    });
  }
  return Taro.request({
    url: requestUrl + url,
    data: payload,
    method,
    header,
    mode: "no-cors",
    dataType: "json"
  })
    .then(async (res: any) => {
      const {data, success} = res.data;
      Taro.hideLoading();
      if (!success) {
        showToast &&
          Taro.showToast({
            title: data?.msg || data?.message || "",
            icon: "none",
            duration: 3000
          });
        return Promise.reject(res.data);
      }
      return res.data;
    })
    .catch((error: any) => {

      showLoading && Taro.hideLoading();
      if (showToast) {
        Taro.showToast({
          title: error?.msg || "服务异常",
          icon: "none",
          duration: 3000
        });
      }
      return Promise.reject(error);
    });
}


