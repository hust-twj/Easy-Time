from PIL import Image

# 创建 1400x560 的白色背景图片
img1 = Image.new('RGB', (1400, 560), 'white')
img1.save('/Users/tangwenjing/Downloads/Easy Time/images/white_background_1400x560.png')

# 创建 440x280 的白色背景图片
img2 = Image.new('RGB', (440, 280), 'white')
img2.save('/Users/tangwenjing/Downloads/Easy Time/images/white_background_440x280.png')

# 创建 1280x800 的白色背景图片
img3 = Image.new('RGB', (1280, 800), 'white')
img3.save('/Users/tangwenjing/Downloads/Easy Time/images/white_background_1280x800.png')