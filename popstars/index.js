
var squareWidth = 40;   //每个小方块大小
var borderWidth = 10;   //方块行列
var squareSet = [];     //当前桌面上方块的集合
var baseScore = 5;      //一个方块的分数
var disScore = 1600;    //目标分数
var currentScore = 0;   //当前总分数
var chooseSquare = [];
var timer = null;
var addScore = 10;
var flag = true;      //给点击事件加锁
var tempSquare = null;

function reflash () {
  for(var i = 0 ; i < squareSet.length ; i ++) {
    for(var j = 0 ; j < squareSet[i].length ;j ++) {
      if(!squareSet[i][j]) {
        continue;
      }
      squareSet[i][j].row = i;
      squareSet[i][j].col = j;
      squareSet[i][j].style.transition = 'left 0.3s, bottom 0.3s';   //重置方块的动画
      squareSet[i][j].style.left = squareSet[i][j].col * squareWidth + 'px';
      squareSet[i][j].style.bottom = squareSet[i][j].row * squareWidth + 'px';
      squareSet[i][j].style.backgroundImage = "url('./images/"+ squareSet[i][j].num +".png')";
      squareSet[i][j].style.backgroundSize = 'cover';
      squareSet[i][j].style.transform = 'scale(0.95)';
    }
  }
}
function createSquare (value, row, col) {
  var temp = document.createElement('div');
  temp.style.width = squareWidth + 'px';
  temp.style.height = squareWidth + 'px';
  temp.style.position = 'absolute';
  temp.style.display = 'inline-block';
  temp.style.boxSizing = 'border-box';
  temp.style.borderRadius = '12px';
  temp.num = value;
  temp.col = col;
  temp.row = row;
  return temp;
}

function selectSquare (square, arr) {
  if(!square) {
    return;
  }
  arr.push(square);

  //判断左边是否有颜色相等且相邻的方块
  if(square.col > 0 && 
    squareSet[square.row][square.col - 1] && 
    squareSet[square.row][square.col - 1].num == square.num && 
    arr.indexOf(squareSet[square.row][square.col - 1]) == -1) {
      selectSquare(squareSet[square.row][square.col - 1], arr);
  }
  //判断右边是否有颜色相等且相邻的方块
  if(square.col < 9 && 
    squareSet[square.row][square.col + 1] && 
    squareSet[square.row][square.col + 1].num == square.num && 
    arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
      selectSquare(squareSet[square.row][square.col + 1], arr);
  }
  //判断上边是否有颜色相等且相邻的方块
  if(square.row < 9 && 
    squareSet[square.row + 1][square.col] && 
    squareSet[square.row + 1][square.col].num == square.num && 
    arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
      selectSquare(squareSet[square.row + 1][square.col], arr);
  }
  //判断下边是否有颜色相等且相邻的方块
  if(square.row > 0 && 
    squareSet[square.row - 1][square.col] && 
    squareSet[square.row - 1][square.col].num == square.num && 
    arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
      selectSquare(squareSet[square.row - 1][square.col], arr);
  }
}

function flickerSquare (arr) {
  var num = 1;
  timer = setInterval(function() {
    for(var i = 0; i < arr.length; i ++) {
      arr[i].style.transform = 'scale('+ (0.90 + 0.05 * Math.pow(-1, num)) +')';
      arr[i].style.border = "3px solid #BFEFFF";
    }
    num ++;
  }, 300)
}

function restore () {
  if(timer != null) {
    clearInterval(timer);
  }
  for(var i = 0; i < squareSet.length; i ++) {
    for(var j = 0; j < squareSet[i].length; j ++) {
      if(!squareSet[i][j]) {
        continue;
      }
      squareSet[i][j].style.transform = "scale(0.95)";
      squareSet[i][j].style.border = "0px solid white";
    }
  }
} 

function selectSquareShow () {
  var score = 0;
  for(var i = 0; i < chooseSquare.length; i ++) {
    score += baseScore + i * addScore;
  }
  if(score == 0) {
    return;
  }
  var showTag = document.getElementById('star-checked');
  showTag.innerHTML = chooseSquare.length + '块' + score + '分';
  showTag.style.transition = '';
  showTag.style.opacity = '1';
  setTimeout(function() {
    showTag.style.transition = 'opacity 1s';
    showTag.style.opacity = '0';
  }, 1000)
}

function mouseOver (objsq) {  //鼠标移上
  if(!flag) {
    tempSquare = objsq;
    return;
  }
  //样式还原
  restore();
  //选中相邻方块
  chooseSquare = [];
  selectSquare(objsq, chooseSquare);
  if(chooseSquare.length <= 1) {
    chooseSquare = [];
    return;
  }  
  //选中方块闪烁
  flickerSquare(chooseSquare);
  
  //显示选中的块数和分数
  selectSquareShow();
}


function moveSquare () {
  for(var i = 0; i < borderWidth; i ++) {
    var jc = 0;
    for(var j = 0; j < borderWidth; j ++) {
      if(squareSet[j][i]) {
        if (j != jc) {
          squareSet[jc][i] = squareSet[j][i];
          squareSet[j][i].row = jc;
          squareSet[j][i] = null;
        }
        jc ++;
      }     
    }
  }
  for(var i = 0; i < squareSet[0].length; ) {
    if(squareSet[0][i] == null) {  
      for(var j = 0; j < borderWidth; j ++) {
        squareSet[j].splice(i, 1);
      }
      continue;           //返回接着判断新的第i列，直到这列不为空时，在 i++ 判断下一列
    }
    i ++;
  }
  reflash();
}

function isGameOver () {
  for(var i = 0 ; i < squareSet.length ; i ++) {
    for(var j = 0 ; j < squareSet[i].length ; j ++) {
      if(!squareSet[i][j]) {
        continue;
      }
      var arr = [];
      selectSquare(squareSet[i][j], arr);
      if(arr.length > 1) {
        return false;
      }
    }
  }
  return true;
}

function winDengji() {
  var winDiv = document.createElement('img');
  document.getElementsByClassName('wrapper-star')[0].appendChild(winDiv);
  winDiv.src = './images/clearance.png';
  winDiv.style.width = '40%';
  winDiv.style.position = 'absolute';
  winDiv.style.left = '30%';
  winDiv.style.top = '30%';
  setTimeout(function() {
    document.getElementsByClassName('wrapper-star')[0].removeChild(winDiv);
    document.getElementById('regame').style.display = 'block';
  }, 3000);
}

function gameOver () {
  var overDiv = document.createElement('div');
  document.getElementsByClassName('wrapper-star')[0].appendChild(overDiv);
  overDiv.style.width = '40%';
  overDiv.style.position = 'absolute';
  overDiv.style.textAlign = 'center';
  overDiv.style.left = '30%';
  overDiv.style.top = '30%';
  overDiv.innerHTML = '游戏失败';
  overDiv.style.fontSize = '30px';
  setTimeout(function() {
    document.getElementsByClassName('wrapper-star')[0].removeChild(overDiv);
    document.getElementById('regame').style.display = 'block';
  }, 3000);
}

function init () {
  var table = document.getElementsByClassName('wrapper-star')[0];
  document.getElementById('star-dis').innerHTML = '目标分数：' + disScore;
  for(var i = 0 ; i < borderWidth; i ++) {
    squareSet[i] = new Array();
    for(var j = 0 ; j < borderWidth ; j ++){
       var square = createSquare(Math.floor(Math.random() * 5), i, j);
       square.onmouseover = function () {
         mouseOver(this);
       }
       square.onclick = function () {
        if(chooseSquare <= 1 || !flag) {
          return;
        }
        flag = false;
        tempSquare = null;
        for(var k = 0; k < chooseSquare.length; k ++) {
          currentScore += baseScore + k * addScore;
          (function(k) {
            setTimeout(function() {
              squareSet[chooseSquare[k].row][chooseSquare[k].col] = null;
              table.removeChild(chooseSquare[k]);
            }, k * 100);
          }(k));
        }
        document.getElementById('star-score').innerHTML = '当前分数：' + currentScore;

        //选中的方块消失后，在移动方块
        setTimeout(function() {  
          moveSquare();

          //释放点击事件的锁
          setTimeout(function() {
            if(isGameOver()) {
              if(currentScore >= disScore) {
                winDengji();
              }else {
                gameOver();
              }
            } else {
              flag = true;
              chooseSquare = [];
              mouseOver(tempSquare);
            }
          }, 300);
        }, chooseSquare.length * 100);

       }
       squareSet[i][j] = square;
       table.appendChild(square);
    }
  }
  reflash();
}

window.onload = function() {
  init();
} 