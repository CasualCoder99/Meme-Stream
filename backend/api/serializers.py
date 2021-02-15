from rest_framework import serializers
from .models import Meme

class MemeSerializer(serializers.ModelSerializer):
    id= serializers.ReadOnlyField()
    class Meta:
        model=Meme
        fields=('id','name','url','caption')

class editMemeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Meme
        fields=('url','caption')