"""
URL configuration for MusicAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from musicapp.views import Music_Recommender, Play_Song, SongListView, SaveHistoryView, ClearHistoryView
from musicapp.views import save_history, get_history, song_details


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recommendations/', Music_Recommender.as_view(), name='music_recommender'),
    path('api/play_song/<str:track_id>/', Play_Song.as_view(), name='play_song'),
    path('api/songs/', SongListView.as_view(), name='song-list'),
    path('api/save_history/', SaveHistoryView.as_view(), name='save_history'),
    path('api/history/', get_history, name='get_history'),
    path('api/clear_history/', ClearHistoryView.as_view(), name='clear_history'),
    path('api/songs/<int:track_id>/', song_details, name='song_details'),
]
