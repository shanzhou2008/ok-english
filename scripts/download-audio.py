import os
import requests

BASE_URL = "https://dict.youdao.com/dictvoice?audio={}&type=2"
OUTPUT_DIR = "../public/words"

words_to_download = [
    # 字母学习 - 字母发音
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    # 字母学习 - 单词
    'Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Fish', 'Giraffe', 'Horse',
    'Ice Cream', 'Jellyfish', 'Koala', 'Lion', 'Monkey', 'Nest', 'Orange',
    'Panda', 'Queen', 'Rabbit', 'Sun', 'Tiger', 'Umbrella', 'Van', 'Whale',
    'X-ray', 'Yellow', 'Zebra',
    # 数字学习 - 数字英文
    'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen', 'Twenty',
    # 颜色形状 - 颜色
    'Yellow', 'Green', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White',
    # 颜色形状 - 形状
    'Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart', 'Diamond', 'Oval',
    # 动物世界
    'Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Bear', 'Elephant', 'Lion', 'Monkey',
    'Panda', 'Tiger', 'Giraffe', 'Zebra', 'Dolphin', 'Whale', 'Butterfly', 'Frog', 'Snake',
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"准备下载 {len(words_to_download)} 个音频文件...")

success_count = 0
fail_count = 0

for word in words_to_download:
    file_name = word.lower().replace(' ', '-') + '.mp3'
    file_path = os.path.join(OUTPUT_DIR, file_name)
    
    if os.path.exists(file_path):
        print(f"✓ 已存在: {word} -> {file_name}")
        success_count += 1
        continue
    
    try:
        url = BASE_URL.format(word)
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200 and len(response.content) > 100:
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"✓ 下载成功: {word} -> {file_name} ({len(response.content)} bytes)")
            success_count += 1
        else:
            print(f"✗ 下载失败: {word} (状态码: {response.status_code}, 大小: {len(response.content)})")
            fail_count += 1
    except Exception as e:
        print(f"✗ 下载异常: {word} - {str(e)}")
        fail_count += 1

print(f"\n下载完成: 成功 {success_count} 个, 失败 {fail_count} 个")
