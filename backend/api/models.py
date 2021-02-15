from django.db import models
from django.utils import timezone
# Create your models here.

class Meme(models.Model):

    name=models.CharField(null=False,max_length=200)
    url=models.URLField(null=False)
    caption=models.TextField()
    date=models.DateTimeField(default=timezone.now)

    class Meta:
        ordering=['-date']
        unique_together = ("name","url","caption")
