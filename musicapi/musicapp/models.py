from django.db import models

class Song(models.Model):
    track_id = models.IntegerField()
    artists = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    track_name = models.CharField(max_length=255)
    popularity = models.IntegerField()
    duration_ms = models.IntegerField()
    explicit = models.BooleanField()
    danceability = models.FloatField()
    energy = models.FloatField()
    key = models.IntegerField()
    loudness = models.FloatField()
    mode = models.IntegerField()
    speechiness = models.FloatField()
    acousticness = models.FloatField()
    instrumentalness = models.FloatField()
    liveness = models.FloatField()
    valence = models.FloatField()
    tempo = models.FloatField()
    time_signature = models.IntegerField()
    track_genre = models.CharField(max_length=255)
    audioUrl = models.CharField(max_length=255)
    imageUrl = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.artists} - {self.track_name}'

class History(models.Model):
    track_id = models.IntegerField()
    track_name = models.CharField(max_length=255)
    artists = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.track_name} by {self.artists} at {self.timestamp}"

