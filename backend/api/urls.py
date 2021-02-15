from django.urls import path,include

from . import views

urlpatterns=[path('overview', views.apiOverview,name='api-overview'),
path('',views.memeList,name='api-meme-list'),
path('<int:pk>/',views.memeDetail,name='api-meme-detail'),
]