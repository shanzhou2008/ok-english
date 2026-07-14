#!/usr/bin/env python3
import os
import urllib.request
import urllib.parse

SONGS_DIR = "/workspace/public/songs"
os.makedirs(SONGS_DIR, exist_ok=True)

songs_to_download = [
    {
        "id": "twinkle-twinkle",
        "title": "Twinkle Twinkle Little Star",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2026/02/Twinkle-Twinkle-Little-Star-Standard-Edit-Singing-Bell.mp3"
    },
    {
        "id": "abc-song",
        "title": "ABC Song",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2015/05/ABC-Song-Singing-Bell.mp3"
    },
    {
        "id": "head-shoulders",
        "title": "Head Shoulders Knees and Toes",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2015/01/Head-Shoulders-Knees-and-Toes.mp3"
    },
    {
        "id": "wheels-on-the-bus",
        "title": "The Wheels on the Bus",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2015/01/Wheels-on-the-bus-Singing-Bell.mp3"
    },
    {
        "id": "if-youre-happy",
        "title": "If You're Happy and You Know It",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2015/03/If-you-re-happy-and-you-know-it-Singing-Bell.mp3"
    },
    {
        "id": "old-macdonald",
        "title": "Old MacDonald Had a Farm",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2014/12/Old-McDonald-had-a-farm-Singing-Bell.mp3"
    },
    {
        "id": "five-little-ducks",
        "title": "Five Little Ducks",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2017/10/Five-Little-Ducks-Went-Swimming-One-Day-Singing-Bell.mp3"
    },
    {
        "id": "row-row-row",
        "title": "Row Row Row Your Boat",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2015/01/Row-Row-Row-your-boat.mp3"
    },
    {
        "id": "rainbow-song",
        "title": "I Can Sing a Rainbow",
        "singing_bell_url": None
    },
    {
        "id": "mary-little-lamb",
        "title": "Mary Had a Little Lamb",
        "singing_bell_url": "https://media.singing-bell.com/wp-content/uploads/2014/12/Mary-had-a-little-lamb-Singing-Bell.mp3"
    },
]

def download_file(url, filepath):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.singing-bell.com/'
        })
        with urllib.request.urlopen(req, timeout=60) as response:
            data = response.read()
            if len(data) > 50000:
                with open(filepath, 'wb') as f:
                    f.write(data)
                size_kb = len(data) // 1024
                print(f"  ✅ 下载成功: {os.path.basename(filepath)} ({size_kb}KB)")
                return True
            else:
                print(f"  ❌ 文件太小，可能不是有效MP3: {len(data)} bytes")
                return False
    except Exception as e:
        print(f"  ❌ 下载失败: {e}")
        return False

def main():
    print("=" * 60)
    print("  儿歌 MP3 批量下载工具")
    print("=" * 60)
    print(f"保存目录: {SONGS_DIR}")
    print()
    
    success_count = 0
    skip_count = 0
    fail_count = 0
    
    for i, song in enumerate(songs_to_download, 1):
        song_id = song["id"]
        filepath = os.path.join(SONGS_DIR, f"{song_id}.mp3")
        
        print(f"[{i}/{len(songs_to_download)}] {song['title']}")
        
        if os.path.exists(filepath) and os.path.getsize(filepath) > 50000:
            size_kb = os.path.getsize(filepath) // 1024
            print(f"  ⏭️  已存在 ({size_kb}KB)，跳过")
            skip_count += 1
            success_count += 1
            continue
        
        if song.get("singing_bell_url"):
            if download_file(song["singing_bell_url"], filepath):
                success_count += 1
                continue
        
        fail_count += 1
        print(f"  ❌ 下载失败")
    
    print()
    print("=" * 60)
    print(f"  下载完成: {success_count}/{len(songs_to_download)} 首")
    print(f"  成功: {success_count - skip_count} | 跳过: {skip_count} | 失败: {fail_count}")
    print("=" * 60)
    print()
    print("文件列表:")
    for f in sorted(os.listdir(SONGS_DIR)):
        filepath = os.path.join(SONGS_DIR, f)
        if os.path.isfile(filepath):
            size = os.path.getsize(filepath) // 1024
            print(f"  🎵 {f} - {size}KB")

if __name__ == "__main__":
    main()
