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
    // When deploying for production, update this to your live domain!
    const baseUrl = "http://localhost:5173/analyzer";
    const encodedUrl = encodeURIComponent(targetUrl);
    
    chrome.tabs.create({ url: `${baseUrl}?url=${encodedUrl}` });
  }
});
