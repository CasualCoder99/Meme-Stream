from django.urls import path,include

from . import views

urlpatterns=[path('', views.meme_list,name='meme_list'),
path('<int:id>/',views.meme_detail,name='meme_detail'),
]