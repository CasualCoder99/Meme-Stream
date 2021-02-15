from django.shortcuts import render, get_object_or_404,redirect
from api.models import Meme
from .forms import *


# Create your views here.

def meme_list(request):
    if(request.method=='POST'):
        form=MemeCreationForm(request.POST)
        if(form.is_valid()):
            meme= form.save(commit=False)
            meme.date=timezone.now()
            meme.save()
            return redirect("meme_list")
    else:
        form=MemeCreationForm()
    memes=Meme.objects.order_by('-date')
    return render(request,'memes/meme_list.html',
    {'memes':memes,'form':form})
    
def meme_detail(request,id):
    meme={'a':None}
    #meme= get_object_or_404(Meme,pk=id)
    return render(request,'memes/meme_detail.html',
    {'meme':meme})