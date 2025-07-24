from dateutil.relativedelta import relativedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from datetime import date, timedelta

from .models import Income
from .models_files.expense_model import Expense
from .serializers import IncomeSerializer
from .serializers_files.expense_serializers import ExpenseSerializer


class TransactionsReport(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()
        report_range = request.query_params.get('range')

        incomes = []
        expenses = []

        if report_range == 'today':
            incomes = Income.objects.filter(account__user=user, created_at=today)
            expenses = Expense.objects.filter(account__user=user, created_at=today)
        elif report_range == 'week':
            start_of_week = today - timedelta(days=today.weekday())
            end_of_week = today + timedelta(days=(6-today.weekday()))

            incomes = Income.objects.filter(account__user=user, created_at__range=(start_of_week, end_of_week))
            expenses = Expense.objects.filter(account__user=user, created_at__range=(start_of_week, end_of_week))
        elif report_range == 'month':
            start_of_month = today.replace(day=1)
            end_of_month = (start_of_month + relativedelta(months=1)) - relativedelta(days=1)

            incomes = Income.objects.filter(account__user=user, created_at__range=(start_of_month, end_of_month))
            expenses = Expense.objects.filter(account__user=user, created_at__range=(start_of_month, end_of_month))

        income_data = IncomeSerializer(incomes, many=True).data
        expense_data = ExpenseSerializer(expenses, many=True).data

        return Response({
            'incomes': income_data,
            'expenses': expense_data
        })