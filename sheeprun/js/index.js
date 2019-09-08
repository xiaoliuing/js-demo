(function() { // 功能模块

  var baseData = {
    stage: document.getElementsByClassName('stage')[0],
    speed: 7, // 每次小羊所走的偏移量
    maxShepps: 20, // 屏幕上出现羊最多数
    sheepNum: 0, // 记录stage小羊个数
    rate: 70, // 羊动的频率
    width: 100, // 设置小羊的大小
    scale: (164/128).toFixed(2) // 宽高比，勿改
  }

  function Sheep (data) {
    this.stage = data.stage;
    this.sheepNode = document.createElement('div');
    this.stage.appendChild(this.sheepNode);
    initSheepStyle(this.sheepNode);
    this.speed = data.speed;
    this.rate = Math.floor(Math.random() * data.rate) + 20;
    this.sheepNum = data.sheepNum;
    this.width = baseData.width;
    this.currentSpeed = data.speed;
    this.cot = this.sheepNode.offsetLeft;
    this.top = 0;
  }

  init();

  // 入口函数
  function init () {
    creatSheep();
  }
  //初使小羊
  function initSheepStyle (sheepNode) {
    var _height = baseData.width/baseData.scale;
    sheepNode.className = "sheep";
    sheepNode.style.width = baseData.width + "px";
    sheepNode.style.height = _height + "px";
    sheepNode.style.backgroundSize = baseData.width * 8 + "px " + _height * 2 + "px";
    sheepNode.style.right = -baseData.width + "px";
    sheepNode.style.bottom = Math.random().toFixed(2)*100 + '%';
  }

  function creatSheep () {
    // 给body一个paddingtop值，防止随机出现的小羊跑到屏幕外面
    document.body.style.paddingTop = baseData.width/baseData.scale + "px";
    var timer = setInterval(function() {
      var currentSheeps = baseData.stage.children.length;
      if (currentSheeps < baseData.maxShepps) {
        var sheepPlus = new Sheep(baseData);
        sheepRun(sheepPlus);
      }
    }, 500);
  }

  function sheepRun (sheepPlus) {
    sheepPlus.timer = setInterval(function(){
      sheepPlus.sheepNum += sheepPlus.width;
      if (sheepPlus.sheepNum == sheepPlus.width*8) {
        sheepPlus.sheepNum = baseData.sheepNum;
      }
      sheepPlus.sheepNode.style.backgroundPosition = -sheepPlus.sheepNum + "px " + sheepPlus.top + "px";
      sheepPlus.cot = sheepPlus.sheepNode.offsetLeft - sheepPlus.speed;
      if (sheepPlus.cot <= -sheepPlus.width) {
        clearInterval(sheepPlus.timer);
        sheepPlus.stage.removeChild(sheepPlus.sheepNode);
      }
      sheepPlus.sheepNode.style.left = sheepPlus.cot + "px";
    }, sheepPlus.rate);

    // 拖拽🐏
    sheepPlus.sheepNode.onmousedown = function (e) {
      e = window.e || e;
      sheepPlus.speed = 0;
      sheepPlus.top = -baseData.width/baseData.scale;

      sheepPlus.x = e.pageX;
      sheepPlus.y = e.pageY;
      document.onmousemove = function (e) {
        e = window.e || e;
        sheepPlus.x = e.pageX - sheepPlus.x;
        sheepPlus.y = e.pageY - sheepPlus.y;
        sheepPlus.sheepNode.style.left = sheepPlus.x + sheepPlus.sheepNode.offsetLeft + "px";
        sheepPlus.sheepNode.style.top = sheepPlus.y + sheepPlus.sheepNode.offsetTop + "px";
        sheepPlus.x = e.pageX;
        sheepPlus.y = e.pageY;
      }
      document.onmouseup = function(e){
        document.onmousemove = null;
        sheepPlus.speed = sheepPlus.currentSpeed;
        sheepPlus.top = 0;
      }
    }
  }
})()
