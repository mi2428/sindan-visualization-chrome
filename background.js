chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.notifications.create({
    type: "basic",
    title: "test",
    iconUrl: "./icons/sindan.png",
    message: message,
  });
  sendResponse()
});
