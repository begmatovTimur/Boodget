from dateutil.relativedelta import relativedelta
from django.db.models.functions import TruncMonth
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from django.db.models import Avg, Sum

from datetime import date, timedelta, datetime

from .models import Income
from .models_files.expense_category_model import ExpenseCategory
from .models_files.expense_model import Expense
from .models_files.income_source_model import IncomeSource
from .serializers import IncomeSerializer
from .serializers_files.expense_serializers import ExpenseSerializer, ExpenseCategorySerializer
from .serializers_files.income_serializers import IncomeSourceSerializer


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
            end_of_week = today + timedelta(days=(6 - today.weekday()))

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


class CurrentUserData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "balance": user.account.balance,
        })


class UserIncomeTransactions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save(account=request.user.account)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            income = Income.objects.get(pk=pk)
            income.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Income.DoesNotExist:
            return Response({'error': 'Income not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            income = Income.objects.get(pk=pk)
        except Income.DoesNotExist:
            return Response({'error': 'Income not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = IncomeSerializer(income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserIncomeFilterTransactions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        incomes = Income.objects.all()
        date = data.get("date")
        source = data.get("source")
        order = data.get("order")

        incomes = incomes.filter(account__user=user)

        if date:
            incomes = incomes.filter(created_at=date)

        if source:
            incomes = incomes.filter(source__id=source)


        if order == "asc":
            incomes = incomes.order_by('amount')
        elif order == "desc":
            incomes = incomes.order_by('-amount')
        elif order == "newest":
            incomes = incomes.order_by("-created_at")
        elif order == "oldest":
            incomes = incomes.order_by("created_at")

        incomes_data = IncomeSerializer(incomes, many=True).data

        return Response({"message": "Data received!", "data": incomes_data})


class UserExpenseTransactions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(account=request.user.account)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk)
            expense.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Expense.DoesNotExist:
            return Response({'error': 'Expense not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk)
        except Expense.DoesNotExist:
            return Response({'error': 'Expense not found'}, status=status.HTTP_404_NOT_FOUND)

        print(request.data)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save(account=request.user.account)  # <-- important line
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserExpenseFilterTransactions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        expenses = Expense.objects.all()

        date = data.get("date")
        category = data.get("category")
        order = data.get("order")

        expenses = expenses.filter(account__user=user)

        if date:
            expenses = expenses.filter(created_at=date)

        if category:
            expenses = expenses.filter(category__id=category)

        if order == "asc":
            expenses = expenses.order_by('amount')
        elif order == "desc":
            expenses = expenses.order_by('-amount')
        elif order == "newest":
            expenses = expenses.order_by("-created_at")
        elif order == "oldest":
            expenses = expenses.order_by("created_at")

        expenses_data = ExpenseSerializer(expenses, many=True).data

        return Response({"message": "Data received!", "data": expenses_data})


class ExpenseCategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    queryset = ExpenseCategory.objects.filter(is_active=True)
    serializer_class = ExpenseCategorySerializer


class IncomeSourceListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    queryset = IncomeSource.objects.filter(is_active=True)
    serializer_class = IncomeSourceSerializer


class UserTransactionsBreakdown(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        x_month = data.get("x_month")  # e.g., "2025-04"
        y_month = data.get("y_month")  # e.g., "2025-08"

        if not x_month or not y_month:
            return Response({"error": "x_month and y_month are required."}, status=400)

        # Convert to datetime objects
        x_start = datetime.strptime(x_month, "%Y-%m")
        x_end = x_start + relativedelta(months=1)

        y_start = datetime.strptime(y_month, "%Y-%m")
        y_end = y_start + relativedelta(months=1)

        # Totals for x_month
        x_income_total = Income.objects.filter(
            created_at__gte=x_start, created_at__lt=x_end, account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        x_expense_total = Expense.objects.filter(
            created_at__gte=x_start, created_at__lt=x_end, account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        # Totals for y_month
        y_income_total = Income.objects.filter(
            created_at__gte=y_start, created_at__lt=y_end, account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        y_expense_total = Expense.objects.filter(
            created_at__gte=y_start, created_at__lt=y_end, account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        # Last 3 full months from now
        today = datetime.today().replace(day=1)
        last_3_months_start = today - relativedelta(months=3)
        last_3_months_end = today

        # Totals over the last 3 months
        last_3_income_total = Income.objects.filter(
            created_at__gte=last_3_months_start,
            created_at__lt=last_3_months_end,
            account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        last_3_expense_total = Expense.objects.filter(
            created_at__gte=last_3_months_start,
            created_at__lt=last_3_months_end,
            account__user=user
        ).aggregate(total=Sum("amount"))["total"] or 0

        # Monthly averages (divide by 3)
        avg_income = last_3_income_total / 3
        avg_expense = last_3_expense_total / 3

        return Response({
            "message": "Financial data fetched successfully!",
            "data": {
                "x_month": {
                    "income": round(x_income_total, 2),
                    "expense": round(x_expense_total, 2),
                },
                "y_month": {
                    "income": round(y_income_total, 2),
                    "expense": round(y_expense_total, 2),
                },
                "avg": {
                    "income": round(avg_income, 2),
                    "expense": round(avg_expense, 2),
                },
            },
        })


class UserIncomeTransactionTrends(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        month_str = data.get("month")  # e.g. "2025-08"
        if not month_str or "-" not in month_str:
            return Response({"error": "Month must be in format YYYY-MM"}, status=400)

        year, month = map(int, month_str.split("-"))

        # Get incomes grouped by source
        incomes = (
            Income.objects
            .filter(created_at__year=year, created_at__month=month, account__user=user)
            .values("source__id", "source__name", "source__icon")  # assuming IncomeSource has a "name" field
            .annotate(total_amount=Sum("amount"))
        )
        #

        order = data.get("order", "asc")
        if order == "asc":
            incomes = incomes.order_by("total_amount")
        elif order == "desc":
            incomes = incomes.order_by("-total_amount")

        # Add date to each result
        result = [
            {
                "id": income["source__id"],
                "source": income["source__name"],
                "total_amount": income["total_amount"],
                "icon": income["source__icon"],
            }
            for income in incomes
        ]

        return Response(result)


class UserExpenseTransactionTrends(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        month_str = data.get("month")
        if not month_str or "-" not in month_str:
            return Response({"error": "Month must be in format YYYY-MM"}, status=400)

        year, month = map(int, month_str.split("-"))

        # Group expenses by source
        expenses = (
            Expense.objects
            .filter(created_at__year=year, created_at__month=month, account__user=user)
            .values("category__id", "category__name", "category__icon")  # assuming ExpenseSource has a "name" field
            .annotate(total_amount=Sum("amount"))
        )

        order = data.get("order", "asc")
        if order == "asc":
            expenses = expenses.order_by("total_amount")
        elif order == "desc":
            expenses = expenses.order_by("-total_amount")

        result = [
            {
                "id": expense["category__id"],
                "category": expense["category__name"] or "Unknown",
                "total_amount": expense["total_amount"],
                "icon": expense["category__icon"],
            }
            for expense in expenses
        ]

        return Response(result)
