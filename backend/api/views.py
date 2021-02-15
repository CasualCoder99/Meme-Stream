import requests
from django.shortcuts import render,redirect
from .models import Meme
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MemeSerializer
from rest_framework import status
from django.utils import timezone
 # Create your views here.

def image_validation_check(url): #validating the image by checking the content of the response
    try:
        response=requests.get(url)
        content=response.headers['Content-Type']
        if("image" in content):
            return True
        else:
            return False
    except:
        return False
    else:
        return False

@api_view(['GET'])
def apiOverview(request):
    
    api_urls={
        'List of Memes':'/memes',
        'Detail View of Meme':'/memes/<int:pk>'
    }
    return Response(api_urls)

@api_view(['GET','PATCH'])
def memeDetail(request,pk):
    try:
        meme=Meme.objects.get(id=pk)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if(request.method=="PATCH"):
        print(request.data)
        serializer=MemeSerializer(meme,data=request.data,partial=True)
        # print(f'DATA--------> {serializer}')
        if(serializer.is_valid()):
            print(f'Data---{serializer.validated_data}')
            name=meme.name
            if('url' in serializer.validated_data):
                url=serializer.validated_data['url']
                if(not image_validation_check(url)):
                    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
                
                # print(serializer)
            #meme_id=serializer.validated_data['id']
            for key in serializer.validated_data:
                if(key=="name" and serializer.validated_data[key]!=name):
                    return Response({"error":"Not allowed to change name!"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
            serializer.save()
            meme.date=timezone.now()
            #print(f'Serialiser----->{serializer.data["id"]}')
            return Response({},status=status.HTTP_200_OK)
    elif(request.method=="GET"):
        serializer=MemeSerializer(meme,many=False)
        return Response(serializer.data)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','POST'])
def memeList(request):
    if(request.method=="GET"):
        memes=(Meme.objects.all()[:100])
        serializer=MemeSerializer(memes,many=True)
        return Response(serializer.data)

    elif(request.method=="POST"):
        serializer=MemeSerializer(data=request.data)
        memes=Meme.objects.all()
        if(serializer.is_valid() and image_validation_check(request.data['url'])):
            meme_url=serializer.validated_data['url']
            for meme in memes:
                name=meme.name
                url=meme.url
                if(name==serializer.validated_data['name'] and
                    url==serializer.validated_data['url'] and
                    caption==serializer.validated_data['caption']):
                    return Response(serializer.errors,status=status.HTTP_409_CONFLICT)    
            serializer.save()
            #print(f'Serialiser----->{serializer}')
            #print(serializer.data)
            return Response({'id':serializer.data['id']},status=status.HTTP_201_CREATED)
        #print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    if(not image_validation_check(url)):
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)