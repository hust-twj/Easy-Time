from PIL import Image

# 打开背景图片和前景图片
background = Image.open('/Users/tangwenjing/Downloads/Easy Time/images/white_background_1400x560.png')
foreground = Image.open('/Users/tangwenjing/Downloads/Easy Time/images/promo_large_1400x560_fixed.png')

# 计算前景图片放置在背景图片中心的位置
bg_width, bg_height = background.size
fg_width, fg_height = foreground.size

x = (bg_width - fg_width) // 2
y = (bg_height - fg_height) // 2

# 将前景图片粘贴到背景图片的中心位置，正确处理透明度
background.paste(foreground, (x, y), foreground)

# 保存合成后的图片
background.save('/Users/tangwenjing/Downloads/Easy Time/images/combined_1400x560.png')