<!--
<template>
    <div>
        <div style="text-align:center;width:480px;">
            <button @click="moveup()">UP</button><br><br>
            <button @click="moveleft()">LEFT</button>
            <button @click="moveright()">RIGHT</button><br><br>
            <button @click="movedown()">DOWN</button>
        </div>
    </div>    
</template>

<script>
export default {
    name: 'game',
    data() {
        return {
            myGamePiece: null,
            myGameArea: {
                canvas : document.createElement("canvas"),
                start : function() {
                    this.canvas.width = 480;
                    this.canvas.height = 270;
                    this.context = this.canvas.getContext("2d");
                    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                    this.interval = setInterval(this.updateGameArea, 20);
                },
                clear : function() {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            }
        }
    },
    methods: {
        startGame() {
            this.myGamePiece = new this.component(30, 30, "red", 10, 120)
            this.myGameArea.start()
        },
        component(width, height, color, x, y) {
            this.width = width;
            this.height = height;
            this.speedX = 0;
            this.speedY = 0;
            this.x = x;
            this.y = y;    
            this.update = function() {
                ctx = this.myGameArea.context;
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            this.newPos = function() {
                this.x += this.speedX;
                this.y += this.speedY;        
            } 
        },
        updateGameArea() {
            this.myGameArea.clear();
            this.myGamePiece.newPos();    
            this.myGamePiece.update();
        },
        moveup() {
            this.myGamePiece.speedY -= 1; 
        },
        movedown() {
            this.myGamePiece.speedY += 1; 
        },
        moveleft() {
            this.myGamePiece.speedX -= 1; 
        },
        moveright() {
            this.myGamePiece.speedX += 1; 
        }
    },
    mounted() {
        this.startGame()
    }
}
</script>

<style scoped>
canvas {
    border:1px solid #d3d3d3;
    background-color: #f1f1f1;
}
</style>
-->