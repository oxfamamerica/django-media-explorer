# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150, null=True, blank=True)),
                ('file_name', models.CharField(max_length=150, null=True, blank=True)),
                ('original_file_name', models.CharField(max_length=150, null=True, blank=True)),
                ('credit', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('image', models.ImageField(max_length=255, null=True, upload_to=b'images/', blank=True)),
                ('image_url', models.CharField(max_length=255, null=True, blank=True)),
                ('image_width', models.IntegerField(default=b'0', null=True, blank=True)),
                ('image_height', models.IntegerField(default=b'0', null=True, blank=True)),
                ('video_url', models.CharField(max_length=255, null=True, blank=True)),
                ('video_embed', models.TextField(null=True, blank=True)),
                ('thumbnail_image', models.ImageField(max_length=255, null=True, upload_to=b'images/', blank=True)),
                ('thumbnail_image_url', models.CharField(max_length=255, null=True, blank=True)),
                ('thumbnail_image_width', models.IntegerField(default=b'0', null=True, blank=True)),
                ('thumbnail_image_height', models.IntegerField(default=b'0', null=True, blank=True)),
                ('type', models.CharField(default=b'image', max_length=10, verbose_name='Type', choices=[(b'image', b'Image'), (b'video', b'Video')])),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Elements',
            },
        ),
        migrations.CreateModel(
            name='Gallery',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100, null=True, blank=True)),
                ('short_code', models.CharField(max_length=100, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('thumbnail_image', models.ImageField(max_length=255, null=True, upload_to=b'images/', blank=True)),
                ('thumbnail_image_url', models.CharField(max_length=255, null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Galleries',
            },
        ),
        migrations.CreateModel(
            name='GalleryElement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('credit', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('sort_by', models.IntegerField(default=b'0', null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('element', models.ForeignKey(to='media_explorer.Element')),
                ('gallery', models.ForeignKey(to='media_explorer.Gallery')),
            ],
            options={
                'ordering': ['sort_by'],
                'verbose_name': 'Gallery element',
                'verbose_name_plural': 'Gallery elements',
            },
        ),
        migrations.CreateModel(
            name='ResizedImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file_name', models.CharField(max_length=150, null=True, blank=True)),
                ('size', models.CharField(max_length=25, null=True, blank=True)),
                ('image_url', models.CharField(max_length=255, null=True, blank=True)),
                ('image_width', models.IntegerField(default=b'0', null=True, blank=True)),
                ('image_height', models.IntegerField(default=b'0', null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('image', models.ForeignKey(to='media_explorer.Element')),
            ],
            options={
                'verbose_name': 'Resized image',
                'verbose_name_plural': 'Resized images',
            },
        ),
        migrations.AddField(
            model_name='gallery',
            name='elements',
            field=models.ManyToManyField(to='media_explorer.Element', through='media_explorer.GalleryElement'),
        ),
    ]
