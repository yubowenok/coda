# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-14 14:26
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('codaproblem', '0001_initial'),
        ('auth', '0007_alter_validators_add_error_messages'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
                ('startTime', models.DateTimeField()),
                ('endTime', models.DateTimeField()),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('graderGroups', models.ManyToManyField(related_name='contestgraders', to='auth.Group')),
                ('languages', models.ManyToManyField(to='codaproblem.Language')),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ContestBatch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.IntegerField(default=0)),
                ('canViewInput', models.BooleanField(default=False)),
                ('canViewOutput', models.BooleanField(default=False)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='codaproblem.Batch')),
            ],
        ),
        migrations.CreateModel(
            name='ContestProblem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('problemID', models.IntegerField()),
                ('contest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='problems', to='codacontest.Contest')),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='codaproblem.Problem')),
            ],
            options={
                'ordering': ('problemID',),
            },
        ),
        migrations.CreateModel(
            name='ScoringSystem',
            fields=[
                ('name', models.CharField(max_length=100, primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddField(
            model_name='contestbatch',
            name='contestProblem',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='codacontest.ContestProblem'),
        ),
        migrations.AddField(
            model_name='contest',
            name='scoringSystem',
            field=models.ForeignKey(default='ICPC', on_delete=django.db.models.deletion.PROTECT, to='codacontest.ScoringSystem'),
        ),
        migrations.AddField(
            model_name='contest',
            name='userGroups',
            field=models.ManyToManyField(related_name='contestusers', to='auth.Group'),
        ),
    ]
