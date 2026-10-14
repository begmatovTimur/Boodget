from decimal import Decimal

from django.test import TestCase
from rest_framework.test import APIClient

from users.models import User
from .models import Account, Expense, ExpenseCategory, Income, IncomeSource


class TransactionSecurityTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="test-password")
        self.other = User.objects.create_user(username="other", password="test-password")
        self.account = Account.objects.create(user=self.owner)
        Account.objects.create(user=self.other)
        self.source = IncomeSource.objects.create(name="Salary", icon="Briefcase")
        self.category = ExpenseCategory.objects.create(name="Food", icon="Utensils")
        self.client = APIClient()
        self.client.force_authenticate(self.owner)

    def cases(self):
        return (
            ("incomes", Income, {"source": self.source.pk}, {"source": self.source}),
            ("expenses", Expense, {"category": self.category.pk}, {"category": self.category}),
        )

    def test_other_users_cannot_edit_or_delete_transactions(self):
        for route, model, payload, relation in self.cases():
            with self.subTest(route=route):
                item = model.objects.create(account=self.account, amount=Decimal("20"), **relation)
                self.account.refresh_from_db()
                balance = self.account.balance
                self.client.force_authenticate(self.other)
                url = f"/transactions/{route}/{item.pk}/"
                response = self.client.put(url, {"amount": "50", "note": "changed", **payload}, format="json")
                self.assertEqual(response.status_code, 404)
                self.assertEqual(self.client.delete(url).status_code, 404)
                item.refresh_from_db()
                self.account.refresh_from_db()
                self.assertEqual(item.amount, Decimal("20"))
                self.assertEqual(item.account_id, self.account.pk)
                self.assertEqual(self.account.balance, balance)

    def test_owner_can_create_update_and_delete_with_correct_balance(self):
        for route, model, payload, _ in self.cases():
            with self.subTest(route=route):
                response = self.client.post(f"/transactions/{route}/", {"amount": "20.25", **payload}, format="json")
                self.assertEqual(response.status_code, 201)
                url = f"/transactions/{route}/{response.data['id']}/"
                sign = 1 if route == "incomes" else -1
                self.account.refresh_from_db()
                self.assertEqual(self.account.balance, sign * Decimal("20.25"))
                response = self.client.put(url, {"amount": "35.50", **payload}, format="json")
                self.assertEqual(response.status_code, 200)
                self.account.refresh_from_db()
                self.assertEqual(self.account.balance, sign * Decimal("35.50"))
                self.assertEqual(self.client.delete(url).status_code, 204)
                self.account.refresh_from_db()
                self.assertEqual(self.account.balance, Decimal("0"))
                self.assertFalse(model.objects.filter(account=self.account).exists())

    def test_nonpositive_amounts_are_rejected_without_changing_balance(self):
        for route, model, payload, _ in self.cases():
            for amount in ("0", "-1", "-0.01"):
                with self.subTest(route=route, amount=amount):
                    response = self.client.post(f"/transactions/{route}/", {"amount": amount, **payload}, format="json")
                    self.assertEqual(response.status_code, 400)
                    self.assertIn("amount", response.data)
                    self.assertFalse(model.objects.filter(account=self.account).exists())
        self.account.refresh_from_db()
        self.assertEqual(self.account.balance, Decimal("0"))

    def test_unauthenticated_mutations_are_rejected(self):
        self.client.force_authenticate(user=None)
        for route, _, payload, _ in self.cases():
            with self.subTest(route=route):
                response = self.client.post(f"/transactions/{route}/", {"amount": "20", **payload}, format="json")
                self.assertEqual(response.status_code, 401)

    def test_invalid_trend_months_return_bad_request(self):
        for route in ("incomes", "expenses"):
            for month in (None, "invalid", "2026-13", "2026-00", 202610, ["2026-10"], {"month": "2026-10"}):
                with self.subTest(route=route, month=month):
                    response = self.client.post(f"/transactions/trends/{route}", {"month": month}, format="json")
                    self.assertEqual(response.status_code, 400)

    def test_invalid_comparison_months_return_bad_request(self):
        for month in (None, "invalid", "2026-13", 202610, ["2026-10"], "9999-12"):
            with self.subTest(month=month):
                response = self.client.post("/transactions/breakdown/", {"x_month": month, "y_month": "2026-10"}, format="json")
                self.assertEqual(response.status_code, 400)

    def test_valid_report_months_still_work(self):
        for route in ("incomes", "expenses"):
            response = self.client.post(f"/transactions/trends/{route}", {"month": "2026-10"}, format="json")
            self.assertEqual(response.status_code, 200)
        response = self.client.post("/transactions/breakdown/", {"x_month": "2026-09", "y_month": "2026-10"}, format="json")
        self.assertEqual(response.status_code, 200)
