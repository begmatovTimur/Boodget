from django.urls import path

from transactions.views import TransactionsReport, CurrentUserData, UserIncomeTransactions, UserExpenseTransactions, \
    UserIncomeFilterTransactions, UserExpenseFilterTransactions, IncomeSourceListView, \
    ExpenseCategoryListView, UserTransactionsBreakdown, UserIncomeTransactionTrends, UserExpenseTransactionTrends

urlpatterns = [
    path('dash-report/', TransactionsReport.as_view()),
    path('user-info/', CurrentUserData.as_view()),
    path('incomes/', UserIncomeTransactions.as_view()),
    path('incomes/<int:pk>/', UserIncomeTransactions.as_view()),
    path('incomes/filter', UserIncomeFilterTransactions.as_view()),
    path('expenses/', UserExpenseTransactions.as_view()),
    path('expenses/<int:pk>/', UserExpenseTransactions.as_view()),
    path('expenses/filter', UserExpenseFilterTransactions.as_view()),
    path('income-sources/', IncomeSourceListView.as_view()),
    path('expense-categories/', ExpenseCategoryListView.as_view()),
    path('breakdown/', UserTransactionsBreakdown.as_view()),
    path('trends/incomes', UserIncomeTransactionTrends.as_view()),
    path('trends/expenses', UserExpenseTransactionTrends.as_view())
]