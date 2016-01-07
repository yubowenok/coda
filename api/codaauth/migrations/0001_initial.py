# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-01-07 13:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
    ]

    operations = [
        migrations.CreateModel(
            name='CodaGroup',
            fields=[
                ('group', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.Group')),
            ],
        ),
        migrations.CreateModel(
            name='CodaUser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('affiliation', models.CharField(blank=True, max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='codagroup',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='codaauth.CodaUser'),
        ),
    ]
