from django.http import JsonResponse, HttpResponseRedirect, FileResponse
from django.views import View
from .models import Song
from sklearn.metrics.pairwise import euclidean_distances
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from .serializers import SongSerializer
from .models import History
from rest_framework.decorators import api_view
from itertools import groupby
from operator import itemgetter


# Завантажити модель кластеризації
song_cluster_pipeline = joblib.load('H:/music recommender/MusicAPI/musicapp/song_cluster_model.pkl')

# Вибір ознак, які використовуються для кластеризації
features = ['explicit', 'mode', 'speechiness', 'instrumentalness', 'tempo', 'time_signature']
metadata_cols = ['artists', 'track_name']

# Функція для попередньої обробки введених пісень
def input_preprocessor(song_list, dataset): 
    song_vectors = []

    for song in song_list:
        try:
            song_data = dataset[(dataset['artists'] == song['artists']) & 
                                (dataset['track_name'] == song['track_name'])].iloc[0]
        except IndexError:
            song_data = None

        if song_data is None:
            print('Warning: {} does not exist in our database'.format(song['track_name']))
            continue

        song_vectors.append(song_data[features].values)

    return np.mean(np.array(list(song_vectors)), axis=0)

# Класова в'юшка для отримання рекомендацій
class Music_Recommender(APIView):
    def post(self, request):
        # Перевірка, чи є необхідні дані в запиті
        song_list = request.data.get('song_list')
        n_songs = request.data.get('n_songs', 10)

        # Get recent history
        recent_history = History.objects.order_by('-timestamp')[:5]
        song_list += [
            {"artists": h.artists, "track_name": h.track_name}
            for h in recent_history
        ]
        print('song list', song_list)

        if not song_list or not isinstance(song_list, list):
            return Response({"error": "Invalid input. 'song_list' must be a list of songs."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Отримати дані з бази
        dataset = pd.read_excel('H:\music\musicapi\musicapp\selected_songs_modified.xlsx')

        # Попередня обробка введених даних
        song_center = input_preprocessor(song_list, dataset)
        if song_center is None or len(song_center) == 0:
            return Response({"error": "No songs found for the provided input."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Масштабування даних
        scaler = song_cluster_pipeline.steps[0][1]

        song_vectors = []
        for _, song in dataset.iterrows():
            song_vectors.append([song[feature] for feature in features])

        scaled_data = scaler.transform(np.array(song_vectors))
        scaled_song_center = scaler.transform(song_center.reshape(1, -1))

        # Обчислення євклідових відстаней
        ed_dist = euclidean_distances(scaled_song_center, scaled_data)
        index = list(np.argsort(ed_dist)[0, :n_songs])

        # Збирання результатів
        recommended_songs = []
        for idx in index:
            song = dataset.iloc[idx]
            audio_url = f"/static/music/{song['track_id']}.mp3" 
            recommended_songs.append({
                "track_id": song['track_id'],
                "artists": song['artists'],
                "track_name": song['track_name'],
                "audioUrl": song['audioUrl'],
                "imageUrl": song['imageUrl']
            })


        return Response(recommended_songs, status=status.HTTP_200_OK)


class Play_Song(APIView):
    def get(self, request, track_id):
        # Path to the audio file
        audio_path = os.path.join("H:\music\musicapi\musicapp\static\music", f"{track_id}.mp3")

        # Check if the file exists
        if not os.path.exists(audio_path):
            raise Http404("Audio file not found.")

        # Open the file and return a response with the file content
        try:
            audio_file = open(audio_path, 'rb')
            return FileResponse(audio_file, content_type='audio/mpeg')
        except Exception as e:
            return Response({"error": f"An error occurred while trying to serve the file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SongListView(APIView):
    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

class SongSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        songs = Song.objects.filter(track_name__icontains=query) | Song.objects.filter(artists__icontains=query)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def save_history(request):
    track_id = request.data.get('track_id')
    song = Song.objects.get(track_id=track_id)

    if song:
        History.objects.create(
            track_id=song.track_id,
            track_name=song.track_name,
            artists=song.artists,
        )
        return Response({"message": "Song added to history."}, status=201)

    return Response({"error": "Song not found."}, status=404)


@api_view(['GET'])
def get_history(request):
    history = History.objects.all().order_by('-timestamp')
    history_data = [
        {"track_id": h.track_id, "artists": h.artists, "track_name": h.track_name} for h in history
    ]
    history_data.sort(key=itemgetter("track_id"))  # Сортуємо для groupby
    unique_history_data = [next(group) for key, group in groupby(history_data, key=itemgetter("track_id"))]

    return Response(unique_history_data, status=200)
   

class SaveHistoryView(APIView):
    def post(self, request):
        print(f"Request data: {request.data}")
        # Логіка для обробки POST запиту
        track_id = request.data.get('track_id')
        print(track_id)
        song = Song.objects.filter(track_id=track_id).first()
        if song:
            existing_entry = History.objects.filter(track_id=song.track_id).first()
            if not existing_entry:
                History.objects.create(
                    track_id=song.track_id,
                    artists=song.artists,
                    track_name=song.track_name
                )
                return Response({"message": "Song added to history."}, status=201)
            return Response({"message": "Song already in history."}, status=200)

        if not song:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

        # Обробка збереження історії
        return Response({"message": "History saved"}, status=status.HTTP_200_OK)

class ClearHistoryView(APIView):
    def post(self, request):
        History.objects.all().delete()
        return Response({"message": "History cleared successfully"}, status=200)

    def get(self, request):
        # Якщо ви хочете підтримати метод GET
        History.objects.all().delete()
        return Response({"message": "History cleared successfully"}, status=200)


def song_details(request, track_id):
    try:
        song = Song.objects.get(track_id=track_id)
        data = {
            'track_name': song.track_name,
            'artists': song.artists,
            'imageUrl': song.imageUrl,
            'audioUrl': song.audioUrl,
        }
        return JsonResponse(data)
    except Song.DoesNotExist:
        return JsonResponse({'error': 'Song not found'}, status=404)


