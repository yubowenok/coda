# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-16 19:13
from __future__ import unicode_literals

import codaproblem.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('batchID', models.IntegerField()),
                ('name', models.CharField(max_length=100)),
                ('constraints', models.TextField(blank=True)),
                ('timeLimitMS', models.IntegerField(default=0)),
                ('memoryLimitBytes', models.BigIntegerField(default=100000000)),
            ],
            options={
                'ordering': ('batchID',),
            },
        ),
        migrations.CreateModel(
            name='CheckerType',
            fields=[
                ('checkerID', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('onlyExecChecker', models.BooleanField()),
                ('needsFile', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('name', models.CharField(max_length=100, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('problemID', models.CharField(max_length=100, unique=True)),
                ('checker', models.FileField(null=True, upload_to=codaproblem.models.getProblemPath)),
                ('title', models.TextField(blank=True)),
                ('statement', models.TextField(blank=True)),
                ('pdfStatement', models.FileField(null=True, upload_to=codaproblem.models.getProblemPath)),
                ('usePDF', models.BooleanField(default=False)),
                ('input', models.TextField(blank=True)),
                ('output', models.TextField(blank=True)),
                ('timeLimitMS', models.BigIntegerField(default=0)),
                ('memoryLimitBytes', models.BigIntegerField(default=100000000)),
                ('checkerType', models.ForeignKey(default='diff', on_delete=django.db.models.deletion.PROTECT, to='codaproblem.CheckerType')),
                ('languages', models.ManyToManyField(to='codaproblem.Language')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Sample',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input', models.TextField(blank=True)),
                ('output', models.TextField(blank=True)),
                ('sampleID', models.IntegerField()),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='samples', to='codaproblem.Problem')),
            ],
            options={
                'ordering': ('sampleID',),
            },
        ),
        migrations.CreateModel(
            name='TestFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('testFileID', models.IntegerField()),
                ('input', models.FileField(blank=True, upload_to=b'')),
                ('output', models.FileField(blank=True, upload_to=b'')),
                ('resources', models.FileField(blank=True, upload_to=b'')),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='testFiles', to='codaproblem.Batch')),
            ],
            options={
                'ordering': ('testFileID',),
            },
        ),
        migrations.AddField(
            model_name='batch',
            name='problem',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='codaproblem.Problem'),
        ),
    ]
