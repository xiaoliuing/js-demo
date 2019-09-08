function $(el) {
  return document.querySelector(el);
}

var container = $('.container');
var video = $('.container video');
var modaldom = $('.container .modal');  // 蒙层
var bfIcon  = $('.container .bofang'); // 底部播放、暂停
var btBar = $('.container .bottom-bar'); // 底部蒙层
var loveIcon = $('.container .bottom-bar .iconxihuan'); // 是否喜欢
var showFullTime = $('.container .bottom-bar .time .full-time');
var ShowCurrTime = $('.container .bottom-bar .time .curr-time');
var pressFull =  $('.container .bottom-bar .progress');
var bf_progress = $('.container .bottom-bar .progress .bf-progress');
var sw_progress = $('.container .bottom-bar .progress .sw-progress');
var sw_volume = $('.container .bottom-bar .shengyin input');
var iconVolume =  $('.container .bottom-bar .shengyin i');
var screen = $('.container .bottom-bar .iconfull_screen');
var suluv = document.querySelectorAll('.container .bottom-bar .iconicon_set_up ul li');

var videoAllTime; // 视频总时间
var currVolume = video.volume; // 记忆静音前的音量
sw_volume.value = video.volume * 100; // 初始化音量
var timer = null;

// 控制播放、暂停
modaldom.onclick = isPlayPause;
bfIcon.onclick = isPlayPause;

// 去除底部默认事件
btBar.onclick = function (e) {
  e.stopPropagation();
}

// 控制喜欢事件
loveIcon.onclick = function () {
  var _class = loveIcon.classList;
  if (_class.length > 3) {
    _class.remove('red');
  } else {
    _class.add('red');
  }
}

// 显示总时长
video.ondurationchange = function () {
  videoAllTime = video.duration;
  var fullTime = getTime(videoAllTime);
  showFullTime.innerHTML = fullTime;
};

// 更新当前播放时间
video.ontimeupdate = function () {
  setTime();
  setCurrentProgress(rect);
};

// 点击快进
pressFull.onmousedown = function (e) {
  setCurrentTime(e);
  modaldom.onmousemove = function (e) {
    setCurrentTime(e);
  }
  pressFull.onmouseup = modaldom.onmouseleave = function () {
    modaldom.onmousemove = undefined;
  }
}

sw_volume.onmousedown = function () {
  sw_volume.onmousemove = function () {
    video.volume = sw_volume.value / 100;
    sw_volume.onmouseup = onmouseleave = function() {
      currVolume = sw_volume.value / 100;
      sw_volume.onmousemove = undefined;
    }
  }
}

// 判断滑块到0时，静音， 否则取消
sw_volume.onchange = function () {
  if (this.value === '0') {
    iconVolume.classList.remove('iconshengyin');
    iconVolume.classList.add('iconjingyin');
  } else {
    iconVolume.classList.add('iconshengyin');
    iconVolume.classList.remove('iconjingyin');
  }
}

// 点击音量按钮事件
iconVolume.onclick = function () {
  var _classList =  Array.prototype.slice.call(this.classList);
  if (_classList.indexOf('iconjingyin') !== -1) {
    console.log(_classList);
    if (currVolume === 0) {
      currVolume = 0.5;
    }
    video.volume = currVolume;
    sw_volume.value = currVolume * 100;
    iconVolume.classList.add('iconshengyin');
    iconVolume.classList.remove('iconjingyin');
  } else {
    sw_volume.value = 0;
    video.volume = 0;
    iconVolume.classList.remove('iconshengyin');
    iconVolume.classList.add('iconjingyin');
  }
}

// 全屏
screen.onclick = function () {
  if (document.fullscreen) {
    document.exitFullscreen();
    this.classList.add('iconfull_screen');
    this.classList.remove('iconquxiaoquanping_o');
  } else {
    container.requestFullscreen();
    this.classList.remove('iconfull_screen');
    this.classList.add('iconquxiaoquanping_o');
  }
}

container.onfullscreenchange = function () {
  if (!document.fullscreen) {
    screen.classList.add('iconfull_screen');
    screen.classList.remove('iconquxiaoquanping_o');
  }
}

for (var i = 0; i < suluv.length; i ++) {
  suluv[i].onclick = function () {
    video.playbackRate = this.innerHTML;
  }
}
/**
 * 
 * ------  函数工具
 * 
 * 
 */

function isPlayPause () {
  if (video.paused) {
    video.play();
    modaldom.classList.add('pause');
    bfIcon.classList.add('iconbofangzanting');
    bfIcon.classList.remove('iconbofang');    
  } else {
    video.pause();
    modaldom.classList.remove('pause');
    bfIcon.classList.remove('iconbofangzanting');
    bfIcon.classList.add('iconbofang');
  }
}

function getTime (times) {
  times = parseInt(times);
  var m = Math.floor(times / 60);
  if (m < 10) {
    m = '0' + m;
  }
  var s = times - m * 60;
  if (s < 10) {
    s = '0' + s;
  }
  return m +':'+ s;
}

function setTime () {
  var curr = getTime(video.currentTime);
  ShowCurrTime.innerHTML = curr;
}

function setCurrentTime (e) {
  // 获取蒙版位置信息
  var rect = modaldom.getBoundingClientRect();  // 处理全屏、小屏进度条位置问题
  var offsetX = e.pageX - rect.left;
  video.currentTime = offsetX / modaldom.clientWidth * videoAllTime;
setCurrentProgress(); // 处理拖动进度条卡顿问题
}

function setCurrentProgress () {
  var _cur = video.currentTime / videoAllTime * 100;
  bf_progress.style.width = _cur + '%';
  sw_progress.style.left = _cur + '%';
}
