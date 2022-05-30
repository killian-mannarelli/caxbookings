# Generated by Django 4.0.4 on 2022-05-30 09:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Computers',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.IntegerField(blank=True, default=1)),
                ('name', models.CharField(blank=True, default='New PC', max_length=255)),
                ('host_name', models.CharField(blank=True, max_length=255)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.rooms')),
            ],
            options={
                'db_table': 'computers',
                'managed': True,
            },
        ),
        
        migrations.CreateModel(
            name='Bookings',
            fields=[
                ('id', models.AutoField(db_column='booking_id', primary_key=True, serialize=False)),
                ('start', models.DateTimeField(db_column='start_time')),
                ('end', models.DateTimeField(db_column='end_time')),
                ('status', models.IntegerField(blank=True, db_column='status', default=1)),
                ('computer', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.computers')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'bookings',
                'managed': True,
            },
        ),
    ]
