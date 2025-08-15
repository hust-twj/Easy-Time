// 获取DOM元素
document.addEventListener('DOMContentLoaded', function() {
  const digitalClockElement = document.getElementById('digital-clock');
  const analogClockElement = document.getElementById('analog-clock');
  const iconClockTypeSelect = document.getElementById('icon-clock-type');
  const hourHand = document.querySelector('.hour-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const secondHand = document.querySelector('.second-hand');

  // 更新时钟显示
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 更新数字时钟
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    digitalClockElement.textContent = timeString;

    // 更新模拟时钟
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const secondDeg = seconds * 6;

    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
  }

  // 监听下拉框变化
  iconClockTypeSelect.addEventListener('change', function() {
    // 保存选择的时钟类型到存储（仅用于外显图标）
    chrome.storage.local.set({ clockType: iconClockTypeSelect.value });
  });

  // 初始化时钟显示类型
  chrome.storage.local.get(['clockType'], function(result) {
    // 设置下拉框的值
    iconClockTypeSelect.value = result.clockType || 'digital';
    updateClock();
    setInterval(updateClock, 1000);
  });
});