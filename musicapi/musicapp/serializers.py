from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['track_id', 'artists', 'track_name', 'audioUrl', 'imageUrl']  # Усі необхідні поля
