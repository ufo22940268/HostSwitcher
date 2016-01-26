'use strict';

function isHostValid(h) {
  return /\w*\.?\w+\.[a-zA-Z]?(:\d+)?/.test(h);
}

document.getElementById('save').addEventListener('click', ()=> {
  var host1 = document.getElementById('host1').value;
  var host2 = document.getElementById('host2').value;

  if (!(host1 && host2)) return;


  if (isHostValid(host1) && isHostValid(host2)) {
    chrome.storage.sync.set({host1: host1, host2: host2}, () => alert('保存成功'));
  } else {
    alert('域名不合法,合法的域名应该像"aaa.bbb.ccc" 或者"bbb.ccc"');
  }
});
