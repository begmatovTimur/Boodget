from django.urls import path

from transactions.views import TransactionsReport

urlpatterns = [
    path('dash-report/', TransactionsReport.as_view()),
]