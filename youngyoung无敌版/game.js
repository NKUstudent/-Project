/*卡片类  创建卡片对象*/
class Card {
    constructor(image, name) {
        this.image = image;
        this.name = name;
        this.element = document.createElement('div');
        this.element.className = 'card';
        this.element.style.backgroundImage = `url(${image})`;
        this.element.addEventListener('click', () => this.onClick());
        this.isGray = false;
    }

    //位置
    setLocation(x, y) {
        this.element.style.position = 'absolute';
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    onClick() {
        if (!this.isGray) {
            selectedCards.push(this);
            cardSlot.appendChild(this.element);
            this.element.style.position = 'relative'; // 修改位置样式以适应卡槽
            this.element.style.left = '0px';
            this.element.style.top = '0px';
            checkForMatches();
        }
    }
}

//卡片图片
const images = [
    'images/刷子.png', 'images/剪刀.png', 'images/叉子.png', 'images/手套.png',
    'images/水桶.png', 'images/火.png', 'images/玉米.png', 'images/球.png',
    'images/瓶子.png', 'images/白菜.png', 'images/稻草.png', 'images/胡萝卜.png',
    'images/苹果.png', 'images/铃铛.png', 'images/肉腿.png', 'images/青草.png'
];

const cardNames = ['刷子', '剪刀', '叉子', '手套', '水桶', '火', '玉米', '球', '瓶子', '白菜', '稻草', '胡萝卜', '苹果', '铃铛', '肉腿', '青草'];
const cardPool = [];
const selectedCards = [];
const gameBoard = document.getElementById('game-board');
const cardSlot = document.getElementById('card-slot');

//音乐设置
var myAudio = document.getElementById("myAudio");
var playing = false;

function playPause() {
    if (myAudio.paused) {
        myAudio.play();
        playing = true;
    } else {
        myAudio.pause();
        playing = false;
    }
}

//初始化卡池 调用不同区域的初始化函数
function initGame() {
    shuffleArray(cardNames);
    for (let i = 0; i < cardNames.length; i++) {
        const image = `images/${cardNames[i]}.png`;
        for (let j = 0; j < 6; j++) {
            const card = new Card(image, cardNames[i]);
            cardPool.push(card);
        }
    }
    shuffleArray(cardPool);

    // 按指定布局初始化卡片
    initTowerArea();
    initRightArea2();
    initLeftArea2();
    initRightArea1();
    initLeftArea1()
}

//上方塔形布局
function initTowerArea() {
    let index = 0;
    for (let i = 1; i <= 5; i++) {
        for (let x = 0; x < i; x++) {
            for (let y = 0; y < i; y++) {
                const card = cardPool[index];
                card.setLocation(200 - (i - 1) * 25 + x * 50, 150 - (i - 1) * 25 + y * 50);
                gameBoard.appendChild(card.element);
                index++;
            }
        }
    }
}

function initRightArea2() {
    addCardToPanel(cardPool.slice(55, 66), 130, 360, -5, 0);  // 右侧区域2 卡片数为11
}

function initLeftArea2() {
    addCardToPanel(cardPool.slice(66, 76), 280, 360, 5, 0);  //  左侧区域2 卡片数为10
}

function initRightArea1() {
    addCardToPanel(cardPool.slice(76, 86), 100, 460, 0, 6);  //  右侧区域1 卡片数为10
}

function initLeftArea1() {
    addCardToPanel(cardPool.slice(86, 96), 300, 460, 0, 6);  //  左侧区域1 卡片数为10
}

//给定起始位置和偏移量 将卡片添加到面板中
function addCardToPanel(cards, startX, startY, offsetX, offsetY) {
    cards.forEach((card, index) => {
        const x = startX + index * offsetX;
        const y = startY + index * offsetY;
        card.setLocation(x, y);
        gameBoard.appendChild(card.element);
    });
}

//洗牌，随机打乱数组元素的顺序 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//检查是否有匹配的卡片
function checkForMatches() {
    const nameCounts = {};
    selectedCards.forEach(card => {
        nameCounts[card.name] = (nameCounts[card.name] || 0) + 1;
    });
    for (const name in nameCounts) {
        if (nameCounts[name] >= 3) {
            removeMatchedCards(name);
        }
    }
}

//移除匹配到的的卡片
function removeMatchedCards(name) {
    const matchedCards = selectedCards.filter(card => card.name === name);
    matchedCards.forEach(matchedCard => {
        matchedCard.element.remove();
        const index = selectedCards.indexOf(matchedCard);
        if (index !== -1) {
            selectedCards.splice(index, 1);
        }
    });
    // 检查游戏板上的卡片数量是否为0
    if (gameBoard.childElementCount === 0) {
        showImagePopup('images/ok.png'); // 显示图片
    }
}

//胜利图像弹出窗口 
function showImagePopup(imageSrc) {
    const popup = document.createElement('div');
    popup.className = 'popup';

    const img = document.createElement('img');
    img.src = imageSrc;
    popup.appendChild(img);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
}

initGame();