// 得到小鸟盒子 
let bird = document.querySelector('#bird');
let gamebox = document.querySelector('#gamebox');
// 帧编号 
let f = 0;
// 小鸟扑腾翅膀的步骤数字，0、1、2 
let step = 0;
// 小鸟top值（距顶部距离）
let birdTop = 150;
// 为了让下落越来越快，可以设置一个临时变量，表示每一帧下落多少 
let deltaTop = 0;
// 设置定时器，定时器的功能是指定某个毫秒数（1000毫秒等于1秒）就执行某些语句一次 
// 小鸟旋转角度 
let birdRotate = 0;
// 存储管子
let pipes = [];
// 计分
let score = 0;

//定义管子类
class Pipe {
    constructor() {
        this.isScore = false;
        //距离左边的距离
        this.left = 480;
        //上边半个管子的高度
        this.height1 = parseInt(Math.random() * 200 + 100);
        this.height2 = 560 - 180 - this.height1;
        //创建盒子
        this.pipeup = document.createElement('div');
        this.pipedown = document.createElement('div');
        //添加类名
        this.pipeup.className = 'pipeup';
        this.pipedown.className = 'pipedown';
        //设置高度
        this.pipeup.style.height = this.height1 + 'px';
        this.pipedown.style.height = this.height2 + 'px';
        //设置top
        this.pipedown.style.top = this.height1 + 180 + 'px';
        //设置left
        this.pipeup.style.left = this.left + 'px';
        this.pipedown.style.left = this.left + 'px';
        //挂载到游戏盒子中
        gamebox.appendChild(this.pipeup);
        gamebox.appendChild(this.pipedown);
        pipes.push(this);
    }
}
new Pipe();

var timer = setInterval(() => {
    // 让帧编号加1 
    f++;
    // 让deltaTop值加0.4，这个数值决定了小鸟下落的速度快慢 
    deltaTop += 0.4;
    // 小鸟下落 
    birdTop += deltaTop;
    if (birdTop < 0) { birdTop = 0; }
    if (birdTop > 500) {
        gameover();
    }
    // 设置top值 
    bird.style.top = birdTop + 'px';
    // 让小鸟旋转角度变化 
    birdRotate += 2;
    // 让小鸟旋转 
    bird.style['transform'] = 'rotate(' + birdRotate + 'deg)';
    // 每3帧扑腾一次翅膀 
    if (f % 3 == 0) {
        // 让扑腾翅膀的步骤数字加1 
        step++;
        // 如果扑腾翅膀的步骤数字大于2了，就重新从0开始 
        if (step > 2)
            step = 0;
        // 设置background-position 
        bird.style['background-position'] = -step * 100 + '% 0';
    }
    if (f % 100 == 0) {
        new Pipe();
    }

    // 更新所有管子。遍历pipes数组中的每一个管子 
    pipes.forEach(item => {
        // 让遍历出的这个管子移动。 
        item.left -= 4;
        item.pipeup.style.left = item.left + 'px';
        item.pipedown.style.left = item.left + 'px';

        // 小鸟的AABB盒之a1值 
        birdA1 = birdTop + 6;
        // 小鸟的AABB盒之a2值 
        birdA2 = birdTop + 28;
        // 小鸟的AABB盒之b1值 
        birdB1 = 170 + 6;
        // 小鸟的AABB盒之b2值 
        birdB2 = 170 + 45;
        // 在控制台输出小鸟的AABB盒数据 
        // console.log(birdA1, birdA2, birdB1, birdB2);

        // 判断有没有撞鸟 
        if (
            // 情况1：撞到上管子了 
            item.left < birdB2 && item.height2 > birdA1 && item.left + 88 > birdB1 ||
            // 情况2：撞到下管子了 
            item.left < birdB2 && item.height1 + item.space < birdA2 && item.left + 88 > birdB1) {
            gameover();
        }

        if (!item.isScore && item.left + 88 < birdB1) {
            // 分数加1 
            score++;
            // 更改分数显示 
            mainScore.innerText = score;
            // 将这个管子设置为已经加分 
            item.isScore = true;
        }
    });
}, 20);


// 设置点击事件 
gamebox.onclick = () => {
    // 点击鼠标时，小鸟应该有一个负向的变化量，这个数字绝对值越大，小鸟蹦的越高 
    deltaTop = -10;
    // 点击鼠标时，鸟头应该向上 
    birdRotate = -60
};

// 游戏结束函数 
function gameover() {
    // 清除定时器 
    clearInterval(timer);
    // 让大地停止运动 
    land.className = 'stop';
    // 让遮罩盒子出现 
    cover.style['visibility'] = 'visible';
    // 改变透明度 
    cover.style['opacity'] = 0.6;
    // 让工具盒子出现 
    tool.style['display'] = 'block';
    // 不显示主分数 
    mainScore.style['display'] = 'none';
    // 显示本局得分 
    s.innerText = score;
    // 读取本地存储，得到最高分 
    let bestScore = localStorage.getItem('bestScore');
    // 如果从来没有过best 
    if (bestScore == null) {
        // 那么本次分数就是best 
        bestScore = score;
        // 存进去 
        localStorage.setItem('bestScore', bestScore);
    } else {
        // 用本次得分和历史得分对比进行比较
        // 如果本次得分超过了历史最好得分 
        if (score > Number(bestScore)) {
            // 那么本次分数就是best 
            bestScore = score;
            // 存进去 
            localStorage.setItem('bestScore', bestScore);
        }
    }
    // 显示最好成绩 
    best.innerText = bestScore;
}

function reloadPage() {
    location.reload()
}


