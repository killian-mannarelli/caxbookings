# Generated by Django 4.0.4 on 2022-05-10 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_user_id_bookings_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookings',
            name='end',
            field=models.TimeField(blank=True, db_column='end_time', null=True),
        ),
        migrations.AlterField(
            model_name='bookings',
            name='start',
            field=models.TimeField(blank=True, db_column='start_time', null=True),
        ),
    ]