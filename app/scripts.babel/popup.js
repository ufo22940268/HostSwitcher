'use strict';

function isHostValid(h) {
  return /\w*\.?\w+\.[a-zA-Z]?(:\d+)?/.test(h);
}

let container = document.getElementById('container');

function updateListener() {
  Array.from(document.getElementsByClassName('remove')).forEach(el => {
    el.removeEventListener('click');
    el.addEventListener('click', event=> {
      event.target.parentNode.outerHTML = '';
      updateListener();
    })
  });
}

function buildRowItem(hosts) {
  if (!hosts) {
    hosts = ['', ''];
  }

  var p = document.createElement('p');
  p.innerHTML = `
  <input type="text" id="host1" class="host" placeholder="远程服务器地址" value="${hosts[0]}">
    <=========>
    <input type="text" id="host2" class="host" placeholder="本地服务器地址" value="${hosts[1]}">
    <button class="remove">删除</button>
  `;

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
      for (let i = 0; i < result.hosts.length; i += 2) {
        appendRow(result.hosts.slice(i, i + 2));
      }
    }
  });
}

initRows();

document.getElementById('append').addEventListener('click', ()=> appendRow());

document.getElementById('save').addEventListener('click', ()=> {

  var hosts = [...document.getElementsByClassName('host')].map(hostEl => hostEl.value);

  var filteredHosts = [];
  for (var i = 0; i < hosts.length; i += 2) {
    if (hosts[i] && hosts[i + 1]) {
      filteredHosts = filteredHosts.concat(hosts[i], hosts[i + 1]);
    }
  }
  hosts = filteredHosts;

  if (hosts.every(isHostValid)) {
    chrome.storage.sync.set({ hosts: hosts }, () => alert('保存成功'));
  } else {
    alert('域名不合法,合法的域名应该像"aaa.bbb.ccc" 或者"bbb.ccc"');
  }
});

