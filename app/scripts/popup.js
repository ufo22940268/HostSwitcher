'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function isHostValid(h) {
  return (/\w*\.?\w+\.[a-zA-Z]?(:\d+)?/.test(h)
  );
}

var container = document.getElementById('container');

function updateListener() {
  Array.from(document.getElementsByClassName('remove')).forEach(function (el) {
    el.removeEventListener('click');
    el.addEventListener('click', function (event) {
      event.target.parentNode.outerHTML = '';
      updateListener();
    });
  });
}

function buildRowItem(hosts) {
  if (!hosts) {
    hosts = ['', ''];
  }

  var p = document.createElement('p');
  p.innerHTML = '\n  <input type="text" id="host1" class="host" placeholder="远程服务器地址" value="' + hosts[0] + '">\n    <=========>\n    <input type="text" id="host2" class="host" placeholder="本地服务器地址" value="' + hosts[1] + '">\n    <button class="remove">删除</button>\n  ';

  updateListener();

  return p;
}

function appendRow(hosts) {
  container.appendChild(buildRowItem(hosts));
}

function initRows() {
  chrome.storage.sync.get('hosts', function (result) {
    if (!result.hosts) {
      appendRow();
    } else {
      for (var i = 0; i < result.hosts.length; i += 2) {
        appendRow(result.hosts.slice(i, i + 2));
      }
    }
  });
}

initRows();

document.getElementById('append').addEventListener('click', function () {
  return appendRow();
});

document.getElementById('save').addEventListener('click', function () {

  var hosts = [].concat(_toConsumableArray(document.getElementsByClassName('host'))).map(function (hostEl) {
    return hostEl.value;
  });

  var filteredHosts = [];
  for (var i = 0; i < hosts.length; i += 2) {
    if (hosts[i] && hosts[i + 1]) {
      filteredHosts = filteredHosts.concat(hosts[i], hosts[i + 1]);
    }
  }
  hosts = filteredHosts;

  if (hosts.every(isHostValid)) {
    chrome.storage.sync.set({ hosts: hosts }, function () {
      return alert('保存成功');
    });
  } else {
    alert('域名不合法,合法的域名应该像"aaa.bbb.ccc" 或者"bbb.ccc"');
  }
});