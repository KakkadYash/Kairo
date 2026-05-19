from fastapi import APIRouter

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/")
def get_songs():
    return [
        {
            "id": "song-001",
            "title": "Golden Hour",
            "artist": "Kairo Demo",
            "album": "Midnight Archive",
            "language": "English",
            "genre": "R&B",
            "duration_seconds": 214,
            "cover_url": "https://example.com/covers/golden-hour.jpg",
            "stream_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
            "id": "song-002",
            "title": "Neon Rain",
            "artist": "Kairo Demo",
            "album": "City Lights",
            "language": "English",
            "genre": "Electronic",
            "duration_seconds": 188,
            "cover_url": "https://example.com/covers/neon-rain.jpg",
            "stream_url": "https://example.com/streams/neon-rain.mp3",
        },
        {
            "id": "song-003",
            "title": "Dil Se Drive",
            "artist": "Kairo Demo",
            "album": "Late Night Library",
            "language": "Hindi",
            "genre": "Pop",
            "duration_seconds": 241,
            "cover_url": "https://example.com/covers/dil-se-drive.jpg",
            "stream_url": "https://example.com/streams/dil-se-drive.mp3",
        },
    ]
