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

def main():
    load_dotenv()

    if not video_path.exists():
        print(f"❌ Video not found at {video_path}")
        sys.exit(1)

    if not metadata_file.exists():
        print(f"❌ Metadata not found at {metadata_file}")
        sys.exit(1)

    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

    with open(data_file, 'r', encoding='utf-8') as f:
        topic_data = json.load(f)

    title = metadata.get("title", f"{topic_data['mainTitle']['left']} vs {topic_data['mainTitle']['right']}")
    hashtags = metadata.get("hashtags", "#coding #tech #programming")
    if isinstance(hashtags, list):
        hashtags = " ".join(hashtags)

    print(f"\n🚀 UPLOADING: {title}")

    # --- YouTube ---
    try:
        print("📺 Uploading to YouTube...")
        upload_to_youtube(
            video_path=str(video_path),
            title=title[:100],
            description=metadata.get("yt_description", f"{title}\n\n{hashtags}"),
            tags=[t.strip("#") for t in hashtags.split()]
        )
    except Exception as e:
        print(f"⚠️ YouTube failed: {e}")

    # --- Instagram ---
    try:
        print("📸 Uploading to Instagram...")
        upload_to_instagram(str(video_path), f"{title}\n\n{hashtags}")
    except Exception as e:
        print(f"⚠️ Instagram failed: {e}")

    # --- Facebook ---
    try:
        print("📘 Uploading to Facebook...")
        upload_to_facebook(str(video_path), f"{title}\n\n{hashtags}", title=title[:100])
    except Exception as e:
        print(f"⚠️ Facebook failed: {e}")

    # --- Threads ---
    try:
        print("🧵 Uploading to Threads...")
        upload_to_threads(str(video_path), f"{title}\n\n{hashtags}")
    except Exception as e:
        print(f"⚠️ Threads failed: {e}")

    # --- Twitter ---
    try:
        print("🐦 Uploading to Twitter...")
        upload_to_twitter(str(video_path), f"{title}\n{hashtags}"[:280])
    except Exception as e:
        print(f"⚠️ Twitter failed: {e}")

    print("\n✅ UPLOAD PROCESS COMPLETED!")

if __name__ == "__main__":
    main()
