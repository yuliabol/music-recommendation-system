from django.contrib import admin
from .models import Song
from .models import History

admin.site.register(History)

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['artists', 'track_name']
