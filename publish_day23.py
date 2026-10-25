import sys
import json
import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Paths
current_dir = Path(__file__).parent.absolute()
data_file = current_dir / "src/data/current_topic.json"
metadata_file = current_dir / "metadata.json"
video_path = current_dir / "recording.mp4"

# Import upload functions from the local 'upload' folder
sys.path.append(str(current_dir))
try:
    from upload.upload_instagram import upload_to_instagram
    from upload.upload_facebook import upload_to_facebook
    from upload.upload_threads import upload_to_threads
    from upload.upload_to_youtube import upload_to_youtube
    from upload.upload_twitter import upload_to_twitter
    print("✅ Successfully imported all upload modules.")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def sanitize_hashtags(raw_tags):
    clean = []
    clean.append("#kreggscode")
    if isinstance(raw_tags, list):
        for t in raw_tags:
            ct = str(t).strip().lower()
            if not ct.startswith("#"):
                ct = f"#{ct}"
            if ct not in clean:
                clean.append(ct)
    else:
        for t in str(raw_tags).split():
            ct = t.strip().lower()
            if ct.startswith("#") and ct not in clean:
                clean.append(ct)

    fallbacks = ["#systemdesign", "#softwareengineering", "#coding", "#backend", "#artificialintelligence"]
    for f in fallbacks:
        if len(clean) >= 5:
            break
        if f not in clean:
            clean.append(f)
    return " ".join(clean[:5])

def main():
    load_dotenv()

    # Also check if video is named day23_*.mp4 if recording.mp4 doesn't exist
    target_video = video_path
    if not target_video.exists():
        mp4_candidates = list(current_dir.glob("*.mp4"))
        if mp4_candidates:
            target_video = mp4_candidates[0]
            print(f"ℹ️ Using discovered video: {target_video.name}")
        else:
            print(f"❌ Video not found at {video_path}")
            sys.exit(1)

    metadata = {}
    if metadata_file.exists():
        try:
            with open(metadata_file, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
        except Exception as e:
            print(f"⚠️ Error reading metadata.json: {e}")

    topic_data = {}
    if data_file.exists():
        try:
            with open(data_file, 'r', encoding='utf-8') as f:
                topic_data = json.load(f)
        except Exception as e:
            print(f"⚠️ Error reading current_topic.json: {e}")

    fallback_title = f"{topic_data.get('mainTitle', {}).get('left', 'Architecture')} vs {topic_data.get('mainTitle', {}).get('right', 'Comparison')} ⚡"
    title = metadata.get("title", fallback_title)
    hashtags = sanitize_hashtags(metadata.get("hashtags", []))

    brand_footer = (
        "🔗 Interactive visualizers & guides: https://kreggscode.com\n"
        "📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/\n"
        "Follow @kreggscode | AI & System Architecture Studio"
    )

    ig_caption = metadata.get("ig_caption", f"⚡ {title}\n\nKey architectural trade-offs broken down.")
    if "kreggscode.com" not in ig_caption:
        ig_caption = f"{ig_caption}\n\n{brand_footer}"
    instagram_full = f"{ig_caption}\n\n.\n.\n{hashtags}"

    fb_caption = metadata.get("fb_caption", f"Deep-Dive Technical Breakdown: {title}")
    if "kreggscode.com" not in fb_caption:
        fb_caption = f"{fb_caption}\n\nExplore interactive developer tools & apps at https://kreggscode.com and https://kreggscode.com/apps/"
    facebook_full = f"{fb_caption}\n\n{hashtags}"

    threads_caption = metadata.get("threads_caption", f"{title}\n\nhttps://kreggscode.com | Follow @kreggscode")
    threads_full = f"{threads_caption}\n\n{hashtags}"

    yt_description = metadata.get("yt_description", "")
    if "kreggscode.com" not in yt_description:
        yt_description = (
            f"{title}\n\n"
            f"Technical architectural comparison.\n\n"
            f"🔗 KreggsCode Ecosystem & Verified Resources:\n"
            f"🌐 Platform & Guides: https://kreggscode.com\n"
            f"📱 iOS & AI Apps: https://kreggscode.com/apps/\n"
            f"📸 Follow on Instagram: https://www.instagram.com/kreggscode/\n"
            f"🐦 Follow on X: https://x.com/kreggscode\n\n"
            f"#Shorts #kreggscode #systemdesign #coding #softwareengineering #technology #artificialintelligence"
        )

    yt_tags = metadata.get("yt_tags", [
        "kreggscode", "system design", "software engineering", "coding",
        "technology", "artificial intelligence", "backend architecture"
    ])
    if "kreggscode" not in yt_tags:
        yt_tags.insert(0, "kreggscode")

    print(f"\n{'='*55}")
    print(f"🚀 PUBLISHING DAY 23 COMPARISON REEL: {title}")
    print(f"📂 Video: {target_video.name}")
    print(f"{'='*55}\n")

    # 1. Instagram Reels (@kreggscode)
    ig_token = os.getenv("INSTAGRAM_ACCESS_TOKEN") or os.getenv("IG_ACCESS_TOKEN")
    if ig_token:
        try:
            print("📸 Uploading Reel to Instagram (@kreggscode)...")
            res_ig = upload_to_instagram(str(target_video), instagram_full, is_story=False)
            print(f"✅ Instagram Reel Success: {res_ig}")
        except Exception as e:
            print(f"⚠️ Instagram failed: {e}")
    else:
        print("ℹ️ Instagram skipped (INSTAGRAM_ACCESS_TOKEN not set).")

    # 2. Facebook Reels
    fb_token = os.getenv("FACEBOOK_PAGE_ACCESS_TOKEN") or os.getenv("FACEBOOK_ACCESS_TOKEN")
    if fb_token:
        try:
            print("📘 Uploading Reel to Facebook...")
            res_fb = upload_to_facebook(str(target_video), facebook_full, title=title[:100])
            print(f"✅ Facebook Reel Success: {res_fb}")
        except Exception as e:
            print(f"⚠️ Facebook failed: {e}")
    else:
        print("ℹ️ Facebook skipped (FACEBOOK_ACCESS_TOKEN not set).")

    # 3. YouTube Shorts
    yt_client = os.getenv("YT_CLIENT_ID") or os.getenv("YOUTUBE_CLIENT_ID")
    if yt_client:
        try:
            print("📺 Uploading to YouTube Shorts...")
            upload_to_youtube(
                video_path=str(target_video),
                title=title[:100],
                description=yt_description,
                tags=yt_tags
            )
            print("✅ YouTube Shorts Success")
        except Exception as e:
            print(f"⚠️ YouTube failed: {e}")
    else:
        print("ℹ️ YouTube skipped (YT_CLIENT_ID not set).")

    # 4. Threads
    threads_token = os.getenv("THREADS_ACCESS_TOKEN")
    if threads_token:
        try:
            print("🧵 Uploading to Threads...")
            upload_to_threads(str(target_video), threads_full)
            print("✅ Threads Success")
        except Exception as e:
            print(f"⚠️ Threads failed: {e}")
    else:
        print("ℹ️ Threads skipped (THREADS_ACCESS_TOKEN not set).")

    # 5. Twitter / X
    tw_key = os.getenv("TWITTER_API_KEY")
    if tw_key:
        try:
            print("🐦 Uploading to Twitter / X...")
            short_tw = f"{title}\n\nhttps://kreggscode.com\n\n{hashtags}"
            if len(short_tw) > 280:
                short_tw = short_tw[:277] + "..."
            upload_to_twitter(str(target_video), short_tw)
            print("✅ Twitter Success")
        except Exception as e:
            print(f"⚠️ Twitter failed: {e}")
    else:
        print("ℹ️ Twitter skipped (TWITTER_API_KEY not set).")

    print("\n✅ UPLOAD PROCESS COMPLETED!")

if __name__ == "__main__":
    main()
