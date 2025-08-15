// 监听存储变化，更新扩展图标
// 确保只创建一个offscreen文档
let creatingOffscreenDocument = null;

// 创建offscreen文档
async function createOffscreenDocument() {
  // 如果已经在创建中，等待创建完成
  if (creatingOffscreenDocument) {
    return creatingOffscreenDocument;
  }
  
  // 检查是否已经存在offscreen文档
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });
  
  // 如果不存在offscreen文档，则创建
  if (contexts.length === 0) {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DOM_SCRAPING'],
      justification: '绘制时钟图标'
    });
    
    try {
      await creatingOffscreenDocument;
    } finally {
      creatingOffscreenDocument = null;
    }
  }
}

// 更新指定类型的扩展图标
async function updateIconByType(clockType) {
  try {
    // 确保offscreen文档已创建
    await createOffscreenDocument();
    
    // 发送消息到offscreen文档绘制图标
    const response = await chrome.runtime.sendMessage({
      target: 'offscreen',
      action: 'drawIcon',
      clockType: clockType
    });
    
    // 将序列化的图像数据转换回ImageData对象
    const imageData = new ImageData(
      new Uint8ClampedArray(response.imageData.data),
      response.imageData.width,
      response.imageData.height
    );
    
    // 使用返回的图像数据更新扩展图标
    chrome.action.setIcon({ imageData: imageData });
  } catch (error) {
    console.error('更新图标时出错:', error);
  }
}

class ClockExtension {
  constructor() {
    this.updateIcon();
    this.startPeriodicUpdate();
  }

  // 更新扩展图标
  async updateIcon() {
    try {
      // 获取时钟显示类型
      const result = await chrome.storage.local.get(['clockType']);
      const clockType = result.clockType || 'digital';
      
      // 更新当前选择的时钟类型图标
      await updateIconByType(clockType);
      
      // 更新badge文本
      await this.updateBadgeText();
    } catch (error) {
      console.error('更新图标时出错:', error);
    }
  }

  // 更新badge文本
  async updateBadgeText() {
    // 获取时钟显示类型
    const result = await chrome.storage.local.get(['clockType']);
    const clockType = result.clockType || 'digital';
    
    // 如果是模拟时钟(指针形式)，隐藏badge
    if (clockType === 'analog') {
      chrome.action.setBadgeText({ text: '' });
      return;
    }
    
    // 数字时钟显示时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    chrome.action.setBadgeText({ text: timeString });
    chrome.action.setBadgeBackgroundColor({ color: '#000000' });
    chrome.action.setBadgeTextColor({ color: '#FFFFFF' });
  }

  // 开始定期更新图标
  startPeriodicUpdate() {
    // 每20秒更新一次图标
    setInterval(() => {
      this.updateIcon();
    }, 20000);
  }
}

// 初始化扩展
const clockExtension = new ClockExtension();

// 监听存储变化，及时更新图标和badge文本
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'local' && (changes.clockType || changes.iconType)) {
      clockExtension.updateIcon();
      // 异步调用updateBadgeText
      await clockExtension.updateBadgeText();
    }
  });