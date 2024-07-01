// 获取主角
let role = document.querySelector('.role');
// 获取大树
let tree = document.querySelector('.tree');
// 全局添加键盘按下事件，触发jump函数
document.body.addEventListener('keydown', jump);
// jump函数，见名知意，一看就是处理熊猫跳的，参数event
function jump(event) {
    // 32 代表键盘空格键
    if (event.keyCode == 32) {
        // 添加类名animate，即添加跳的动画
        if (role.classList != "animate") {
            role.classList.add("animate");
        }
        // 添加类之后，下次就跳不起来了，因为已经添加了
        // 所以正确的做法是，使用定时器，设置和动画一样的时间，并在回调中移除类名
        setTimeout(function () {
            role.classList.remove("animate");
        }, 500);
    }
}
// 每个十毫秒检查一次，是不是撞到了
var check = setInterval(function () {
    // 动态获取熊猫距离下方距离
    let blockButtom = parseInt(window.getComputedStyle(role)
        .getPropertyValue("bottom"));
    // 动态获取树离开右方的距离 
    let stopRight = parseInt(window.getComputedStyle(tree)
        .getPropertyValue("right"));
    // 因为总长600 熊猫70 自身20 所以树的坐标范围如果大于510小于600就是在熊猫脚下
    // 此时还要判断熊猫的脚丫是不是踩到了树，即距离底部小于25，如果都成立就是碰撞了，over 
    if (stopRight > 510 && stopRight < 600 && blockButtom < 25) {
        // 清空动画
        tree.style.animation = "none";
        role.style.animation = "none";
        // 清除定时器
        clearInterval(check);
    }
}, 10)
