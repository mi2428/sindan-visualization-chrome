chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.notifications.create({
    type: "basic",
    title: message.title,
    message: message.message,
    iconUrl: "./icons/sindan.png",
  });
  sendResponse()
});

chrome.alarms.create({ delayInMinutes: 0, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
  chrome.tabs.query({title: "ログキャンペーン一覧 | SINDAN VISUALIZATION"}, tabs => {
    for (let tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  });
});

