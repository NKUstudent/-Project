(function(){
	var Game = window.Game = function(){
		this.canvas = document.querySelector("canvas");
		this.canvas.width = document.documentElement.clientWidth;
		this.canvas.height = document.documentElement.clientHeight;
        this.init();
        this.ctx = this.canvas.getContext('2d');
        //这是图片字典
		this.imgArr = {};
		//这是管子数组
        this.pipeArr = [];
        //游戏分数：即通过的管子数
        this.score = 0;
 
        //记录过多少时间new一个管子
        this.time_count = 0;
 
        //这里也需要使用箭头函数，否则this指向window而不是window.Game
		this.loadResource(()=>{
		    this.startGame();
        });
	};
 
	//初始化画布宽高，适配移动端不同机型
	Game.prototype.init =  function(){
		if(this.canvas.width < 320){
			this.canvas.width = 320;
		}else if(this.canvas.width > 414){
			this.canvas.width = 414;
		}
		if(this.canvas.height < 568){
			this.canvas.height = 568;
		}else if(this.canvas.height > 823){
			this.canvas.height = 823;
		}
	};
 
	//加载资源
	Game.prototype.loadResource = function(callback){
		//定义已加载的资源数
		var resource_count = 0;
		var xhr = new XMLHttpRequest();
		//这里需使用箭头函数，否则将出现this指向错误，
		xhr.onreadystatechange = ()=>{
		    //此时的this指向window.Game
			if(xhr.readyState === 4 && xhr.status === 200){
				var obj = JSON.parse(xhr.responseText);
				for(let i=0;i<obj[0]["imgs"].length;i++){
                    this.imgArr[obj[0]["imgs"][i].name] = new Image();
                    this.imgArr[obj[0]["imgs"][i].name].src = obj[0]["imgs"][i].url;
                    this.imgArr[obj[0]["imgs"][i].name].onload = ()=> {
                        resource_count++;
                        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
                        this.ctx.save();
                        let text = "正在加载资源"+ resource_count +"/"+obj[0]["imgs"].length;
                        this.ctx.textAlign = "center";
                        this.ctx.font = "20px 微软雅黑";
                        this.ctx.beginPath();
                        this.ctx.fillText(text,this.canvas.width/2,this.canvas.height*(1-0.618));
                        this.ctx.restore();
                        //当加载图片的数量等于图片资源的数量时，说明图片资源加载完毕，执行回调函数
                        if(resource_count === obj[0]["imgs"].length){
                            callback();
                        }
                    }
				}
			}
		};
		xhr.open('GET',"./resource.json");
		xhr.send();
	};
 
    //主线程：游戏开始
    Game.prototype.startGame = function () {
        //实例化场景管理器
        this.sm = new SceneManager();
 
        this.timer = setInterval(()=>{
            this.time_count += 20;
 
            this.sm.render();
            this.sm.update();
        },20)
    };
})();