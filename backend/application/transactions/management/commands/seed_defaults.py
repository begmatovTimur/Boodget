from django.core.management.base import BaseCommand
from models_files.income_source_model import IncomeSource
from models_files.expense_category_model import ExpenseCategory

class Command(BaseCommand):
    help = "Seed default income sources and expense categories"

    def handle(self, *args, **kwargs):
        # Income Sources
        income_sources = [
            {"name": "Salary", "icon": "briefcase-business"},
            {"name": "Freelancing", "icon": "laptop"},
            {"name": "Gift", "icon": "gift"},
            {"name": "Investments/Dividends", "icon": "chart-line"},
            {"name": "Other", "icon": "circle-pound-sterling"},
            {"name": "Bank Interest", "icon": "university"},
            {"name": "Business Revenue", "icon": "store"},
            {"name": "Scholarship/Stipend", "icon": "graduation-cap"},
            {"name": "Rental Income", "icon": "building"},
            {"name": "Family Support", "icon": "users"},
        ]

        for item in income_sources:
            obj, created = IncomeSource.objects.get_or_create(name=item["name"], defaults={"icon": item["icon"]})
            if created:
                self.stdout.write(self.style.SUCCESS(f"✔️ Created income source: {item['name']}"))

        # Expense Categories
        expense_categories = [
            {"name": "Food & Drinks", "icon": "utensils"},
            {"name": "Transport", "icon": "car"},
            {"name": "Rent & Utilities", "icon": "house-plug"},
            {"name": "Subscriptions", "icon": "tv"},
            {"name": "Entertainment", "icon": "gamepad-2"},
            {"name": "Shopping", "icon": "shopping-cart"},
            {"name": "Healthcare", "icon": "heart-pulse"},
            {"name": "Education", "icon": "school"},
            {"name": "Travel", "icon": "plane"},
            {"name": "Donation/Zakat", "icon": "hand-heart"},
            {"name": "Repairs", "icon": "wrench"},
            {"name": "Books & Courses", "icon": "book-open"},
            {"name": "Family/Kids", "icon": "baby"},
            {"name": "Pets", "icon": "paw-print"},
            {"name": "Personal Care", "icon": "book-heart"},
            {"name": "Hobbies", "icon": "camera"},
            {"name": "Miscellaneous", "icon": "dices"},
            {"name": "Moving/Relocation", "icon": "truck"},
            {"name": "Tools/Equipment", "icon": "tool-case"},
            {"name": "Debt Repayment", "icon": "piggy-bank"},
        ]

        for item in expense_categories:
            obj, created = ExpenseCategory.objects.get_or_create(name=item["name"], defaults={"icon": item["icon"]})
            if created:
                self.stdout.write(self.style.SUCCESS(f"✔️ Created expense category: {item['name']}"))

        self.stdout.write(self.style.SUCCESS("✅ Done seeding all default categories!"))
