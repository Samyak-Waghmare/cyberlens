chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan-with-cyberlens",
    title: "Scan link with CyberLens",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan-with-cyberlens") {
    const targetUrl = info.linkUrl;
    
    // For local development, we redirect to the localhost UI.
    // Updated for production live deployment!
    const baseUrl = "https://cyberlens-app.vercel.app/analyzer";
    const encodedUrl = encodeURIComponent(targetUrl);
    
    chrome.tabs.create({ url: `${baseUrl}?url=${encodedUrl}` });
  }
});
