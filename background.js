chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.notifications.create({
    type: "basic",
    title: message.title,
    message: message.message,
    iconUrl: "./icons/sindan.png",
  });
  sendResponse()
});
