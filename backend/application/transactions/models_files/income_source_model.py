from django.db import models



class IncomeSource(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return self.name

    class Meta:
        db_table = 'income_sources'