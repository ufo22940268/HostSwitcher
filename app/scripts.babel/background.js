'use strict';

let debug = false;
let debugHosts = ['127.0.0.1:4000', 'admin.xinpinget.com'];

function getHostsForProduction(callback) {
  chrome.storage.sync.get(['host1', 'host2'], function (result) {
    if (result.host1 && result.host2) {
      callback([result.host1, result.host2]);
    }
  });
}

function getHostsForDebug(callback) {
  return callback(debugHosts);
}

var getHosts = debug ? getHostsForDebug : getHostsForProduction;


function updatePageRules(hosts) {
  hosts = hosts || [];
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    if (hosts.length == 0) return;
    // With a new rule ...

    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: hosts.map(host =>
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlContains: host},
          })),
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
}

chrome.runtime.onInstalled.addListener(details => {
  if (!debug) {
    chrome.runtime.openOptionsPage(() => {});
  }
  updatePageRules(debug ? debugHosts : undefined);
});




chrome.storage.onChanged.addListener((changes, namespace) => {
  getHosts((hosts) => updatePageRules(hosts));
});

chrome.pageAction.onClicked.addListener(function (tab) {
  function swapHost(url) {
    getHosts(hosts => {
      console.log(hosts);
      for (let i in hosts) {
        let host = hosts[i];
        if (url.includes(host)) {
          let newUrl = url.replace(/(http:\/\/).+?(\/.*)/, '$1' + hosts[(Number(i) + 1) % 2] + '$2');
          chrome.tabs.update(tab.id, {url: newUrl});
        }
      }
    });
  }

  swapHost(tab.url);
});

