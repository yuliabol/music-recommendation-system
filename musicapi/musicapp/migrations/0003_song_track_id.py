# Generated by Django 4.2.7 on 2024-12-05 12:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0002_history'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='track_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
