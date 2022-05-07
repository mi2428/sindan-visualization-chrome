chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.notifications.create({
    type: "basic",
    title: message.title,
    message: message.message,
    iconUrl: "./icons/sindan.png",
  });
  sendResponse()
});


const refresh_interval = 1  // minutes

setInterval(() => {
  chrome.tabs.query({title: "ログキャンペーン一覧 | SINDAN VISUALIZATION"}, tabs => {
    for (let tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  });
  console.log("reloaded");
}, refresh_interval * 60 * 1000);
