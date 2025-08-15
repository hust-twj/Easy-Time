// 在offscreen文档中绘制图标
let canvas = null;
let ctx = null;

// 初始化canvas
function initCanvas() {
  canvas = document.getElementById('iconCanvas');
  // 设置willReadFrequently属性以提高getImageData性能
  ctx = canvas.getContext('2d', { willReadFrequently: true });
}

// 绘制圆形背景
function drawCircularBackground() {
  ctx.clearRect(0, 0, 64, 64);
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
}

// 绘制圆角矩形背景
function drawRoundedRectBackground() {
  ctx.clearRect(0, 0, 64, 64);
  ctx.beginPath();
  roundedRect(ctx, 2, 2, 60, 60, 8);
  ctx.fillStyle = 'black';
  ctx.fill();
}

// 绘制圆角矩形
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 绘制数字时钟图标
function drawDigitalClock() {
  // 绘制圆角矩形背景
  drawRoundedRectBackground();
  
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  ctx.font = '24px Arial'; // 增大字体
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(timeString, 32, 32);
  
  // 返回图像数据
  return ctx.getImageData(0, 0, 64, 64);
}

// 绘制模拟时钟图标
function drawAnalogClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // 绘制圆形背景
  drawCircularBackground();
  
  // 绘制时钟边框
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 计算指针角度
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  
  // 绘制时针
  drawHand(hourDeg, 14, 4, 'white');
  
  // 绘制分针
  drawHand(minuteDeg, 20, 3, 'white');
  
  // 返回图像数据
  return ctx.getImageData(0, 0, 64, 64);
}

// 绘制时钟指针
function drawHand(angle, length, width, color) {
  const radian = angle * Math.PI / 180;
  const x = 32 + Math.sin(radian) * length;
  const y = 32 - Math.cos(radian) * length;
  
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

// 监听来自主页面的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 初始化canvas
  if (!canvas) {
    initCanvas();
  }
  
  // 根据消息类型绘制图标
  if (message.target === 'offscreen' && message.action === 'drawIcon') {
    let imageData;
    if (message.clockType === 'analog') {
      imageData = drawAnalogClock();
    } else {
      imageData = drawDigitalClock();
    }
    
    // 将ImageData对象转换为可序列化的格式
    const serializableImageData = {
      width: imageData.width,
      height: imageData.height,
      data: Array.from(imageData.data)
    };
    
    // 发送图像数据回主页面
    sendResponse({ imageData: serializableImageData });
  }
});