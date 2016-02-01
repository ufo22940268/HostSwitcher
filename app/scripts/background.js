'use strict';

var debug = false;
var debugHosts = ['admin.xinpinget.com', '127.0.0.1:4000', 'daily.xinpinget.com', '127.0.0.1:3000'];

function getHostsForProduction(callback) {
  chrome.storage.sync.get('hosts', function (result) {
    callback(result.hosts ? result.hosts : []);
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

    chrome.declarativeContent.onPageChanged.addRules([{
      // That fires when a page's URL contains a 'g' ...
      conditions: hosts.map(function (host) {
        return new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: host }
        });
      }),
      // And shows the extension's page action.
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
}

chrome.runtime.onInstalled.addListener(function (details) {
  if (!debug) {
    chrome.runtime.openOptionsPage(function () {});
  }
  updatePageRules(debug ? debugHosts : undefined);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  getHosts(function (hosts) {
    return updatePageRules(hosts);
  });
});

chrome.pageAction.onClicked.addListener(function (tab) {
  function swapHost(url) {
    getHosts(function (hosts) {
      console.log(hosts);
      for (var i in hosts) {
        i = Number(i);
        var host = hosts[i];
        if (url.includes(host)) {
          var newUrl = url.replace(/(http:\/\/).+?(\/.*)/, '$1' + hosts[i % 2 ? i - 1 : i + 1] + '$2');
          chrome.tabs.update(tab.id, { url: newUrl });
        }
      }
    });
  }

  swapHost(tab.url);
});